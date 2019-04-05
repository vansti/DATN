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

    Course.findOne({ courseCode: req.body.courseCode }).then(course => {
      if (course) {
        errors.courseCode = 'Mã khóa học đã tồn tại';
        return res.status(400).json(errors);
      } else {
        
        const newCourse = new Course({
          title: req.body.title,
          courseCode: req.body.courseCode
        });
        
        if(req.user.role === 'teacher')
        {
          User.findById(req.user.id).then(user=>{
            newCourse.teachers.push(req.user.id)
            newCourse
            .save()
            .then(course => {
              user.courses.push(course.id)
              User.findByIdAndUpdate(req.user.id, user, {new: true}).then(profile => res.json(profile))
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          })
        }else{
          User.findById(req.user.id).then(user=>{
            newCourse
            .save()
            .then(course => {
              user.courses.push(course.id)
              User.findByIdAndUpdate(req.user.id, user, {new: true}).then(profile => res.json(profile))
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          })
        }

      }
    })
  }
);

// @route   post api/courses/add-course-avatar/:courseCode
// @desc    add course avatar
// @access  Private
router.post(
  '/add-course-avatar/:courseCode',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var fileGettingUploaded = req.files.image.path;
    cloudinary.uploader.upload(fileGettingUploaded, function(result) {
      Course.updateOne(
        { courseCode: req.params.courseCode },
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

// @route   POST api/courses/enroll-course
// @desc    enroll course
// @access  Private
router.post(
  '/enroll-course',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    let errors = {};

    if (Validator.isEmpty(req.body.courseCode)) {
      errors.courseCode = 'Hãy điền mã khóa học';
      return res.status(400).json(errors);
    }

    var isEnroll = false;

    Course.findOne({ courseCode: req.body.courseCode }).then(course => {
      if (course) {
        req.user.courses.map(courseid => {
          if(courseid.toString() == course._id.toString())
          {
            isEnroll = true;
            errors.courseCode = 'Đã ghi danh vào khóa học này';
            return res.status(400).json(errors);
          }
        })

        if(isEnroll == false)
        {
            if(req.user.role === 'student') {
              const user = req.user;
              course.students.push(req.user.id)
              Course.findByIdAndUpdate(course._id, course, {new: true})
              .then(course2 => {
                user.courses.push(course2._id)
                User.findByIdAndUpdate(req.user.id, user, {new: true}).then(profile => res.json(profile))
                .catch(err => console.log(err));
              })
            }
            else if(req.user.role === 'teacher') {
              const user = req.user;
              course.teachers.push(req.user.id)
              Course.findByIdAndUpdate(course._id, course, {new: true})
              .then(course2 => {
                user.courses.push(course2._id)
                User.findByIdAndUpdate(req.user.id, user, {new: true}).then(profile => res.json(profile))
                .catch(err => console.log(err));
              })
            }else{
              const user = req.user;
              user.courses.push(course._id)
              User.findByIdAndUpdate(req.user.id, user, {new: true}).then(profile => res.json(profile))
              .catch(err => console.log(err));
            }
        }

      } else {
        errors.courseCode = 'Mã khóa học không tồn tại';
        return res.status(400).json(errors);
      }
    })
  }
);

// @route   POST api/courses/unenroll-course/:courseId
// @desc    unenroll course
// @access  Private
router.post(
  '/unenroll-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    User.updateOne( { _id: req.user.id }, { $pull: { courses: req.params.courseId } } )
    .then(()=>{
      if(req.user.role === 'student') {
        Course.updateOne( { _id: req.params.courseId }, { $pull: { students: req.user.id } } )
      }else if(req.user.role === 'teacher')
      {
        Course.updateOne( { _id: req.params.courseId }, { $pull: { teachers: req.user.id } } )
      }
    })
    .then(result => res.json(result))
    .catch(err => res.status(400).json(err))
  }
);
module.exports = router;