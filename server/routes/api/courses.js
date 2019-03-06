const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'dk9jsd8vf', 
  api_key: '547842791548264', 
  api_secret: 'EfwMSaL8AQG9QOFGBFsti8txE0Y' 
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