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
const validateAddExerciseInput = require('../../validation/addexercise');


// Course Model
const Course = require('../../models/Course');
const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
router.use(cors());


// @route   POST api/exercise/add-exercise
// @desc    add exercise
// @access  Private
router.post(
  '/add-exercise',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddExerciseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    const newExercise = new Exercise({
      user: req.user.id,
      userName: req.user.name,
      userPhoto: req.user.photo,
      title: req.body.title,
      text: req.body.text
    });

    if (req.body.attachFile === '') 
    {
      newExercise.save().then(exercise=>{
        Course.findById(req.body.courseId).then(course => {
          course.exercises.unshift(exercise._id);
          course.save().then(course => res.json(course));
        })
      })

    }else{
      cloudinary.v2.uploader.upload(req.body.attachFile)
      .then(result => {
        newExercise.attachFile = result.secure_url
        newExercise.save().then(exercise=>{
          Course.findById(req.body.courseId).then(course => {
            course.exercises.unshift(exercise._id);
            course.save().then(course => res.json(course));
          })
        })
      })
    }

  }
);


module.exports = router;