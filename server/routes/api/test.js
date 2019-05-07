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
const Quiz = require('../../models/Quiz');
const SubQuiz = require('../../models/SubQuiz');
router.use(cors());


// @route   POST api/test/add-quiz
// @desc    teachcer create test quiz
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
        const newQuiz = new Quiz({
            title: req.body.testTitle,
            description: req.body.testSynopsis,
            courseId: req.body.courseId,
            listQuiz: req.body.quizzes,
            time: '1600',
            deadline: '2019-06-01',
        });
        const newSubQuiz = new SubQuiz({
            studentExercise: []
        });
        async function run() {
            try {
                const quiz = await newQuiz.save();
                //create subQuiz
                newSubQuiz.quizId = quiz._id;
                const subQuiz = await newSubQuiz.save();
                //update array quiz for course
                const course = await Course.findById(req.body.courseId);
                course.quizzes.unshift(quiz._id);
                const courseUpdated = await course.save();

                res.json(courseUpdated);
            } catch (err) {
                console.log(err)
            }
        }
    run();
});

// @route   get api/test/quiz
// @desc    get all quizes
// @access  Private
router.get(
    '/quiz',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Quiz.find((err, quizes) => {
            res.json(quizes);
        });
    }
);

// @route   get api/test/quiz-detail
// @desc    get one quiz
// @access  Private
router.get('/quiz/detail/:idTestQuiz', passport.authenticate('jwt', { session: false }), (req, res) => {
    Quiz.findById(req.params.idTestQuiz).then(quiz => {
        res.json(quiz);
    }).catch(err => console.log(err));
});

function checkvalueKeyExist(arr, key, value) {
    let result = -1;
    arr.forEach((element, index) => {
        if(JSON.stringify(element[key]) === JSON.stringify(value)) {
            result = index;
        }
    });
    return result;
}

function calPointQuiz(listQuiz, submistionAnswer) {
    let numberQuizCorrect = 0;
    listQuiz.forEach((element, index) => {
        if(element.correctAnswer == submistionAnswer[index]) {
            numberQuizCorrect++;
        }
    });
    return numberQuizCorrect / listQuiz.length * 10;
}
// @route   POST api/test/sub-quiz
// @desc    get one quiz
// @access  Private
router.post('/sub-quiz', passport.authenticate('jwt', { session: false }), (req, res) => {
    let params = req.body;
    submission = {
        userId: req.user._id,
        answer: params.answer
    }
    async function run() {
        try {
            const subQuiz = await SubQuiz.findOne({'quizId': req.body.quizId});
            const quiz = await Quiz.findById(req.body.quizId);

            submission.point = calPointQuiz(quiz.listQuiz, params.answer);
            let index = checkvalueKeyExist(subQuiz.studentSubmission, 'userId', submission.userId)
            if(index !== -1) {
                subQuiz.studentSubmission.unshift(submission);
                const subQuizUpdated = await subQuiz.save();
                res.json(subQuizUpdated);
            } else {
                res.json({error: 'Không thể tiếp tục, bạn đã làm bài kiểm tra này.'});
            }

        } catch (err) {
            console.log(err)
        }
    }
    run();
});

// @route   GET api/test/:courseId
// @desc    Return all quiz in a course
// @access  Private
router.get('/:courseId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Course.findById(req.params.courseId).then(course => {
    Quiz.find({
        '_id': { $in: course.quizzes}
    }, function(err, quizzes){
      res.json(quizzes)
    });
  })
});

module.exports = router;