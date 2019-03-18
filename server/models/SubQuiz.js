const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

//Create schema
const SubQuizSchema = new Schema({
  quizId:{type: mongoose.Schema.ObjectId, ref: 'quizzes'},
  studenQuiz:[
    {
      userId: {
        type: mongoose.Schema.ObjectId, ref: 'users'
      },
      listAnswer:[{
        
      }],
      point:{
        type: Number,
      }
    }
  ],
  date: {
    type: Date
  },
  isLate:{
    type: Boolean
  }
})

module.exports = SubQuiz = mongoose.model('subquiz', SubQuizSchema)