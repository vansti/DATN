const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
// const Validator = require('validator');

const Quiz = require('../../models/Quiz');
router.use(cors());


// @route   POST api/quiz/submit-quiz
// @desc    students submit quiz
// @access  Private
router.post(
    '/submit-quiz',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({"message": "function under construction"});
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