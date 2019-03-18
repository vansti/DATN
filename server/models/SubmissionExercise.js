const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

//Create schema
const SubExerciseSchema = new Schema({
    exerciseId:{
      type: mongoose.Schema.ObjectId, ref: 'exercises'
    },
    studenExercise:[{
        userId:{
          type : Number,
        },
      attachFiles: [
        {      
          id: {
              type: String
            },
          name: {
              type: String
            },
          url: {
            type: String
            },
            thumbnail: {
              type: String
            }
        }],
      note:{
        type: String,
      },
      point:{ 
        type: Number,
      },
    }
  ],
  date: {
    type: Date,
  },
  students: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  isLate:{
    type: Boolean,
  },
})

module.exports = SubExercise = mongoose.model('subexcercise', SubExerciseSchema)