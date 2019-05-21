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
//service
const quizService = require('../../service/quizService');
router.use(cors());


// @route   POST api/test/add-quiz
// @desc    teachcer create test quiz
// @access  Private
router.post('/add-quiz', passport.authenticate('jwt', {session: false}),(req, res) => {
    const { errors, isValid } = validateAddTestQuizInput(req.body);
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    const newQuiz = new Quiz({
      title: req.body.testTitle,
      description: req.body.testDescription,
      time: req.body.testTime,
      listQuiz: req.body.listQuiz
    });

    newQuiz
    .save()
    .then(res.json({mes: 'Thêm bài kiểm tra thành công'}))
    .catch(err => console.log(err));

});

// @route   get api/test/quiz
// @desc    get all quizes
// @access  Private
router.get('/quiz', passport.authenticate('jwt', { session: false }), (req, res) => {
    Quiz.find({}, { title: 1, time: 1})
    .then(quiz=> res.json(quiz))
    .catch(err => console.log(err));
});

// @route   get api/test/quiz-detail
// @desc    get one quiz
// @access  Private
router.get('/quiz-detail/:idTestQuiz', passport.authenticate('jwt', { session: false }), (req, res) => {
    Quiz.findById(req.params.idTestQuiz).then(quiz => {
        res.json(quiz);
    }).catch(err => console.log(err));
});

// @route   get api/test/sub-quiz
// @desc    get one quiz
// @access  Private
router.get('/sub-quiz/:idTestQuiz', passport.authenticate('jwt', { session: false }), (req, res) => {
    async function run() {
        try {
            let subQuiz = await SubQuiz.findOne({'quizId': req.params.idTestQuiz});
            subQuiz = subQuiz.studentSubmission.find(
                object => JSON.stringify(object.userId) == JSON.stringify(req.user._id));
            console.log(subQuiz);
            res.json(subQuiz);
        } catch (err) {
            console.log(err)
        }
    }
    run();
});

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
            const subQuiz = await SubQuiz.findOne({'quizId': req.body.quizId, 'courseId': req.body.courseId});
            const quiz = await Quiz.findById(req.body.quizId);
            if(params.answer.length === 0)
              submission.point = 0
            else
              submission.point = quizService.calPointQuiz(quiz.listQuiz, params.answer);
            let index = quizService.checkvalueKeyExist(subQuiz.studentSubmission, 'userId', submission.userId);
            if(index === -1) {
                subQuiz.studentSubmission.unshift(submission);
                const subQuizUpdated = await subQuiz.save();
                
                response = {
                    data: submission.point,
                    message: 'success'
                }
                res.json(response);
            } else {
                response = {
                    data: 'Bạn đã làm bài kiểm tra này mời bạn chọn bài kiểm tra khác.',
                    message: 'failure'
                }
                res.json(response);
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

// @route   GET api/test/is-do-quiz/:courseId
// @desc    Kiem tra hoc vien da lam trac nghiem chua
// @access  Private
router.get('/is-do-quiz/:courseId/:quizId', passport.authenticate('jwt', { session: false }), (req, res) => {

  async function run() {
    try {
      const subQuiz = await SubQuiz.findOne({'quizId': req.params.quizId, 'courseId': req.params.courseId}).lean();
      const find = subQuiz.studentSubmission.find(element => element.userId.toString() ===  req.user._id.toString())
      if(find)
        res.json(find)
      else
        res.json({})
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

module.exports = router;