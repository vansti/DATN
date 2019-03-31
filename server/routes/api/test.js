const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()

// Load Input Validation
const validateAddTestQuizInput = require('../../validation/addTestQuiz');

// Model
const Course = require('../../models/Course');
const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const Quiz = require('../../models/TestQuiz');
router.use(cors());


// @route   POST api/quiz/submit-quiz
// @desc    students submit quiz
// @access  Private
router.post(
    '/add-quiz', passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        const { errors, isValid } = validateAddTestQuizInput(req.body);
        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }
        const newTestQuiz = new Quiz({
            title: req.body.testTitle,
            description: req.body.testSynopsis,
            courseId: req.body.courseId,
            listQuiz: req.body.quizzes,
            time: '1600',
            deadline: '2019-06-01',
        });
        
        newTestQuiz.save().then(testQuiz => {
            Course.findById(req.body.courseId).then(course => {
                course.testQuiz.unshift(testQuiz._id);
                course.save().then(course => res.json(course));
            })
        })
        // res.json({
        //     "message": "function under construction",
        //     "data": req.body
        // });
    }
);

// @route   POST api/quiz/get-quiz
// @desc    get all quizes
// @access  Private
router.get(
    '/get-quiz',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Quiz.find((err, quizes) => {
          res.json(quizes);
        });
    }
);

// @route   POST api/quiz/get-quiz
// @desc    get one quiz
// @access  Private
router.get(
    '/get-quiz/detail/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({"message": "function under construction"});
    }
);
module.exports = router;