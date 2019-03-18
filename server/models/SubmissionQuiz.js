const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

//Create schema
const SubQuizSchema = new Schema({
  studenQuiz:[{
    userId: {
      type: mongoose.Schema.ObjectId, ref: 'users'
    },
    listAnswer:[{
      
    }],
    point:{
      type: Number,
    },
  }],
  deadline:{
    type: Date,
  },
  students: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  isLate:{
    type: Boolean,
  },
  created: {
    type: Date,
    default: Date.now
  },
})

module.exports = SubQuiz = mongoose.model('subquiz', SubQuizSchema)