const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  listQuiz: [
    {      
      question: {
        type: String
      },
      answers: [],
      correctAnswer: [],
      time: Date,
      questionType: {
        type: String
      }
    }
  ],
  deadline:{
    type: Date,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Quiz = mongoose.model('quiz', QuizSchema)

