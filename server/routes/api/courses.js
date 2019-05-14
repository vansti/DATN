const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
var cloudinary = require('cloudinary');
require('dotenv').config();
const formData = require('express-form-data');

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
const SubExercise = require('../../models/SubExercise');
const SubQuiz = require('../../models/SubQuiz');
const Schedule = require('../../models/Schedule');

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
      intro: req.body.intro,
      pointColumns: req.body.pointColumns
    });

    const newCourseDetail = new CourseDetail({
      studyTime: req.body.studyTime,
      openingDay: req.body.openingDay,
      endDay: req.body.endDay,
      fee: req.body.fee,
      info: req.body.info
    });

    const newSchedule = new Schedule({
      events: req.body.events
    });

    async function run() {
      try {
        const course = await newCourse.save()
        newCourseDetail.courseId = course._id
        newSchedule.courseId = course._id
        await newSchedule.save();
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
              intro: req.body.intro,
              pointColumns: req.body.pointColumns
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
              endDay: req.body.endDay,
              fee: req.body.fee,
              info: req.body.info
            }
          }
        )
        
        const find = await Schedule.findOne({ 'courseId' : req.params.courseId })

        if(find)
          Schedule.findOneAndUpdate(
            { 'courseId' : req.params.courseId },
            {
              $set: 
              {
                events: req.body.events
              }
            }
          )
        else{
          const newSchedule = new Schedule({
            courseId: req.params.courseId,
            events: req.body.events
          });
          newSchedule.save();
        }

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
        Course.findById(req.params.courseId, {coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1, pointColumns: 1}).lean()

        var course_detail = await  
        CourseDetail.findOne(
          { 'courseId' : req.params.courseId },
          { studyTime: 1, openingDay: 1, endDay: 1, fee: 1, info: 1, 
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

// @route   POST api/courses/approve/student/:courseId/:studentId
// @desc    approve student
// @access  Private
router.post(
  '/approve/student/:courseId/:studentId',
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

// @route   POST api/courses/approve/teacher/:courseId/:teacherId
// @desc    approve teacher
// @access  Private
router.post(
  '/approve/teacher/:courseId/:teacherId',
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
                student: req.params.teacherId
              }
            }
          }
        )

        await 
        Course.findByIdAndUpdate(
          req.params.courseId ,
          { 
            $push: {
              teachers: req.params.teacherId
            }
          }
        )
        
        await
        User.findByIdAndUpdate(
          req.params.teacherId ,
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

// @route   GET api/courses/get-point-columns/:courseId
// @desc    lấy cột điểm trong khóa học
// @access  Private
router.get(
  '/get-point-columns/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.findById(
      req.params.courseId,
      {pointColumns: 1}
    )
    .populate('pointColumns.test','title')
    .then(course => res.json(course))
    .catch(err => console.log(err));
  }
);

// @route   GET api/courses/set-point-colums-exercise/:courseId/:pointColumnsId/:exerciseId
// @desc    gán bài cho cột điểm
// @access  Private
router.get(
  '/set-point-colums-exercise/:courseId/:pointColumnsId/:exerciseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const subexerciseId = await SubExercise.findOne({ 'exerciseId' : req.params.exerciseId }, { _id : 1 })

        await Course.updateOne(
          { _id: req.params.courseId, "pointColumns._id": req.params.pointColumnsId },
          { 
            $set: 
            { 
              "pointColumns.$.test" :  req.params.exerciseId,
              "pointColumns.$.testModel" :  'exercises',
              "pointColumns.$.submit" :  subexerciseId._id,
              "pointColumns.$.submitModel" :  'subexcercise',              
            } 
          }
        )
        .catch(err => console.log(err));

        res.json({ mes: "Chọn bài tập thành công" })
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/courses/set-point-colums-quiz/:courseId/:pointColumnsId/:quizId
// @desc    gán bài cho cột điểm
// @access  Private
router.get(
  '/set-point-colums-quiz/:courseId/:pointColumnsId/:quizId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const subquizId = await SubQuiz.findOne({ 'quizId' : req.params.quizId }, { _id : 1 })

        await Course.updateOne(
          { _id: req.params.courseId, "pointColumns._id": req.params.pointColumnsId },
          { 
            $set: 
            { 
              "pointColumns.$.test" :  req.params.quizId,
              "pointColumns.$.testModel" :  'quizzes',
              "pointColumns.$.submit" :  subquizId._id,
              "pointColumns.$.submitModel" :  'subquiz',              
            } 
          }
        )
        .catch(err => console.log(err));

        res.json({ mes: "Chọn trắc nghiệm thành công" })
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/courses/get-point-columns-student/:courseId/:studentId
// @desc    lấy cột điểm trong khóa học
// @access  Private
router.get(
  '/get-point-columns-student/:courseId/:studentId',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.findById(
      req.params.courseId,
      {pointColumns: 1}
    )
    .populate({
      path: 'pointColumns.submit',
      match: { 'studentSubmission.userId': req.params.studentId },
      select: { 
        studentSubmission:  
        {
          $elemMatch: {
            'userId': req.params.studentId 
          }
        }
      }
    })
    .populate('pointColumns.test','title')
    .then(course => res.json(course))
    .catch(err => console.log(err));
  }
);

module.exports = router;