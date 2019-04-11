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
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.find(
      { 'enrollDeadline' : {$gte : new Date()}},
      {coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1}
    )
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
            enrollStudent:  
            {
              $elemMatch: {
                'studentId': req.user.id
              }
            }
          }
        ).lean()

        const result = {
          course: course,
          course_detail: course_detail
        }

        if(result.course_detail.enrollStudent === undefined)
          result.isEnroll = false
        else{   
          result.isEnroll = true
          delete result.course_detail.enrollStudent
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

    // var page = 1
    // var limit = 2
    // var skip = (page*limit)-limit;

    Course.find({ '_id': { $in: req.user.courses} })
          .sort({created: -1})
          // .skip(skip).limit(limit)
          .then(courses => res.json(courses));
});

// @route   GET api/courses/admin-courses
// @desc    lấy hết khóa học để admin chỉnh sữa
// @access  Private
router.get(
  '/admin-courses',
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
          enrollStudent: {
            studentId: req.user.id
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
          enrollStudent: {
            studentId: req.user.id
          }
        }
      }
    )
    .then(coursedetail => res.json(coursedetail))
    .catch(err => console.log(err));
  }
);

// @route   GET api/courses/aprove-list/:courseId
// @desc    enroll course
// @access  Private
router.get(
  '/aprove-list/:courseId',
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const course = await     
          Course.findById(
            req.params.courseId ,
            { students: 1 }
          )
          // Course.aggregate([
          //   {
          //     $match:{ '_id': req.params.courseId}
          //   },
          //   {
          //     $lookup:
          //     {
          //       from: "users",
          //       localField: "students",
          //       foreignField : "_id",
          //       as: "attendance_users"
          //     }
          //   }
          // ])
        const coursedetail = await 
          // CourseDetail.findOne(
          //   { 'courseId' : req.params.courseId },
          //   { enrollStudent: 1 }
          // )
          CourseDetail.aggregate([
            {
              $match:{ 'courseId': req.params.courseId}
            },
            {
              $lookup:
              {
                from: "users",
                localField: "enrollStudent.studentId",
                foreignField : "_id",
                as: "students"
              }
            }
          ])

          coursedetail[0].enrollStudent.map((student)=>{
            const temp = coursedetail[0].students.filter(user => user._id.toString() === student.studentId.toString());
            student.name = temp[0].name
            student.email = temp[0].email
            student.photo = temp[0].photo
          })
        
        const result = {
          students: course.students,
          enrollStudent: coursedetail[0].enrollStudent
        }
        res.json(result)
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);
module.exports = router;