const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
<<<<<<< HEAD
=======
  courseId: {
    type: mongoose.Schema.ObjectId, 
    ref: 'courses'
  },
>>>>>>> master
  listQuiz: [
    {      
      question: {
        type: String
      },
      answers: [{}],
<<<<<<< HEAD
      correctAnswer: {},
      time:{}
    }
  ],
  deadline:{
    type: Date
=======
      correctAnswer: [{}],
      time: {},
      questionType: {
        type: String
      }
    }
  ],
  deadline:{
    type: Date,
    required: true
>>>>>>> master
  },
  created: {
    type: Date,
    default: Date.now
<<<<<<< HEAD
  },
  courseId:{type: mongoose.Schema.ObjectId, ref: 'courses'}
})

module.exports = Quiz = mongoose.model('quizzes', QuizSchema)
=======
  }
})

module.exports = Quiz = mongoose.model('quiz', QuizSchema)

>>>>>>> master
