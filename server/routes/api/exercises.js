const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
const Validator = require('validator');



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
      title: req.body.title,
      text: req.body.text,
      attachFiles: req.body.attachFiles,
      deadline: req.body.deadline
    });

    newExercise.save().then(exercise=>{
      Course.findById(req.body.courseId).then(course => {
        course.exercises.unshift(exercise._id);
        course.save().then(course => res.json(course));
      })
    })
  }
);

// @route   GET api/exercises/:courseId
// @desc    Return exercise list
// @access  Private
router.get('/:courseId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Course.findById(req.params.courseId).then(course => {
    Exercise.find({
        '_id': { $in: course.exercises}
    }, function(err, exercises){
      res.json(exercises)
    });
  })
});

// @route   Get api/exercises/get-comments/:exerciseId
// @desc    Get comments
// @access  Private
router.get('/get-comments/:exerciseId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Exercise.find({'_id': req.params.exerciseId},{ comments: 1 },function(err, comments){
    res.json(comments)
  });
});

// @route   POST api/exercises/comment/:exerciseId
// @desc    Comment on a exercise
// @access  Private
router.post('/comment/:exerciseId', passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = {};

  if (Validator.isEmpty(req.body.text)) {
    errors.text = 'Hãy nhập bình luận';
    return res.status(400).json(errors);
  }

  Exercise.findById(req.params.exerciseId).then(exercise=>{
    const newComment = {
      userName: req.user.name,
      userPhoto: req.user.photo,
      text: req.body.text
    }

    exercise.comments.push(newComment);
    exercise.save().then(exercise => res.json(exercise));
  })
  .catch(err => res.status(404).json({ exercisenotfound: 'Không tìm thấy exercise' }));
});

module.exports = router;