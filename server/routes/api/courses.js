const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
var cloudinary = require('cloudinary');
require('dotenv').config()
const Validator = require('validator');
const formData = require('express-form-data')

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});


// Load Input Validation
const validateAddCourseInput = require('../../validation/addcourse');


// Course Model
const Course = require('../../models/Course');
const CourseDetail = require('../../models/CourseDetail');
const User = require('../../models/User');
router.use(cors());
router.use(formData.parse())


// @route   POST api/courses/add-course
// @desc    add course
// @access  Private
router.post(
  '/add-course',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddCourseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    console.log(req.body);
    const newCourse = new Course({
      title: req.body.title,
      enrollDeadline: req.body.enrollDeadline,
      intro: req.body.intro
    });

    const newCourseDetail = new CourseDetail({
      studyTime: req.body.studyTime,
      openingDay: req.body.openingDay,
      fee: req.body.fee,
      info: req.body.info
    });

    async function run() {
      try {
        const course = await newCourse.save()
        newCourseDetail.courseId = course._id
        const coursedetail = await newCourseDetail.save()
        res.json(coursedetail)
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/courses/edit-course/:courseId
// @desc    edit course
// @access  Private
router.post(
  '/edit-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddCourseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    async function run() {
      try {
        await 
        Course.findByIdAndUpdate(
          req.params.courseId,
          {
            $set: 
            {
              title: req.body.title,
              enrollDeadline: req.body.enrollDeadline,
              intro: req.body.intro
            }
          }
        )

        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.params.courseId },
          {
            $set: 
            {
              studyTime: req.body.studyTime,
              openingDay: req.body.openingDay,
              fee: req.body.fee,
              info: req.body.info
            }
          }
        )

        res.json("Chỉnh sửa khóa học thành công")
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   post api/courses/add-course-avatar/:courseId
// @desc    add course avatar
// @access  Private
router.post(
  '/add-course-avatar/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var fileGettingUploaded = req.files.image.path;
    cloudinary.uploader.upload(fileGettingUploaded, function(result) {
      Course.updateOne(
        { _id: req.params.courseId },
        { $set:
          {
            coursePhoto: result.secure_url,
          }
        }
      )
     .then(course => res.json(course));
    });
  }
);

// @route   GET api/courses/all-course
// @desc    lấy hết khóa học chưa hết hạn ghi danh
// @access  Private
router.get(
  '/all-course',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.find(
      { 'enrollDeadline' : {$gte : new Date()}},
      {coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1}
    )
    .sort({created: -1})
    .then(courses => res.json(courses))
    .catch(err => console.log(err));
  }
);

// @route   GET api/courses/course-info/:courseId
// @desc    lấy thông tin chi tiết của khóa học
// @access  Private
router.get(
  '/course-info/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        var course = await 
        Course.findById(req.params.courseId, {coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1}).lean()

        var course_detail = await  
        CourseDetail.findOne(
          { 'courseId' : req.params.courseId },
          { studyTime: 1, openingDay: 1, fee: 1, info: 1, 
            enrollStudents:  
            {
              $elemMatch: {
                'student': req.user.id
              }
            }
          }
        ).lean()

        const result = {
          course: course,
          course_detail: course_detail
        }

        if(result.course_detail.enrollStudents === undefined)
          result.isEnroll = false
        else{   
          result.isEnroll = true
          delete result.course_detail.enrollStudents
        } 

        res.json(result)
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/courses/current
// @desc    Return current user courses
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  Course.find({ '_id': { $in: req.user.courses} })
        .sort({created: -1})
        .then(courses => res.json(courses));
});

// @route   GET api/courses/manage-courses
// @desc    lấy hết khóa học để admin chỉnh sữa
// @access  Private
router.get(
  '/manage-courses',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.find({},{coursePhoto: 1, title: 1})
    .then(courses => {
      res.json(courses)
    })
    .catch(err => console.log(err));
  }
);

// @route   GET api/courses/:studentId
// @desc    Return current user courses
// @access  Private
router.get('/:studentId', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.studentId)
  .then(student =>{
    Course.find({'_id': { $in: student.courses}})
          .sort({created: -1})
          .then(courses => res.json(courses));
  });
});

// @route   POST api/courses/enroll-course/:courseId
// @desc    enroll course
// @access  Private
router.post(
  '/enroll-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    CourseDetail.findOneAndUpdate(
      { 'courseId' : req.params.courseId },
      { 
        $push: {
          enrollStudents: {
            student: req.user.id
          }
        }
      }
    )
    .then(coursedetail => res.json(coursedetail))
    .catch(err => console.log(err));
  }
);

// @route   POST api/courses/unenroll-course/:courseId
// @desc    unenroll course
// @access  Private
router.post(
  '/unenroll-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    CourseDetail.findOneAndUpdate(
      { 'courseId' : req.params.courseId },
      { 
        $pull: {
          enrollStudents: {
            student: req.user.id
          }
        }
      }
    )
    .then(coursedetail => res.json(coursedetail))
    .catch(err => console.log(err));
  }
);

// @route   POST api/courses/approve/:courseId/:studentId
// @desc    approve student
// @access  Private
router.post(
  '/approve/:courseId/:studentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.params.courseId },
          { 
            $pull: {
              enrollStudents: {
                student: req.params.studentId
              }
            }
          }
        )

        await 
        Course.findByIdAndUpdate(
          req.params.courseId ,
          { 
            $push: {
              students: req.params.studentId
            }
          }
        )
        
        await
        User.findByIdAndUpdate(
          req.params.studentId ,
          { 
            $push: {
              courses: req.params.courseId
            }
          }
        )

        res.json("Duyệt thành công")
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/courses/join-course/:courseId
// @desc    join course
// @access  Private
router.post(
  '/join-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        const isJoin = await User.find({'_id': req.user.id, 'courses': req.params.courseId})

        if(isJoin.length === 0)
        {
          if(req.user.role === 'teacher')
          {
            await 
            Course.findByIdAndUpdate(
              req.params.courseId ,
              { 
                $push: {
                  teachers: req.user.id
                }
              }
            )
          }
  
          await
          User.findByIdAndUpdate(
            req.user.id ,
            { 
              $push: {
                courses: req.params.courseId
              }
            }
          )
  
          res.json("Tham gia khóa học thành công")
        }else{

          res.json("Đã tham gia vào khóa học này")
        }
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

module.exports = router;