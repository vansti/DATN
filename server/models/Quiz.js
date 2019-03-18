const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

//Create Schema
const QuizSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: Array,
    required: true
  },
  course_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
});

module.exports = Quiz = mongoose.model('quiz', QuizSchema)