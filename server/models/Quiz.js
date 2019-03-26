const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  listQuiz: [
    {      
      question: {
        type: String
      },
      answers: [{}],
      correctAnswer: {},
      time:{}
    }
  ],
  deadline:{
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  courseId:{type: mongoose.Schema.ObjectId, ref: 'courses'}
})

module.exports = Quiz = mongoose.model('quizzes', QuizSchema)
