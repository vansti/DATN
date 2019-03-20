const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.ObjectId, 
    ref: 'courses'
  },
  listQuiz: [
    {      
      question: {
        type: String
      },
      answers: [{}],
      correctAnswer: [{}],
      questionType: {
        type: String
      }
    }
  ],
  time: {
    type: Date,
    required: true
  },
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

