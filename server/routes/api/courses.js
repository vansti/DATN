const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
var cloudinary = require('cloudinary');
require('dotenv').config()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});


// Load Input Validation
const validateAddCourseInput = require('../../validation/addcourse');


// Course Model
const Course = require('../../models/Course');

router.use(cors());


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
        if (req.body.coursePhoto === '') 
        {
          newCourse
          .save()
          .then(course => res.json(course))
          .catch(err => console.log(err));

        }else{
          cloudinary.v2.uploader.upload(req.body.coursePhoto)
            .then(result => {
              newCourse.coursePhoto = result.secure_url
              
              newCourse
              .save()
              .then(course => res.json(course))
              .catch(err => console.log(err));
            })
        }

      }
    })
  }
);

module.exports = router;