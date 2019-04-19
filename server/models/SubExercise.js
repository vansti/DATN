const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const SubExerciseSchema = new Schema({
  exerciseId:{type: mongoose.Schema.ObjectId, ref: 'exercises'},
  studentExercise:[
    {
      userId:{type: mongoose.Schema.ObjectId, ref: 'users'},
      // attachFile: 
      //   {
      //     name: {
      //         type: String
      //       },
      //     url: {
      //       type: String
      //       },
      //     thumbnail: {
      //       type: String
      //     }
      //   },
      point:{ 
        type: Number,
      },
      created: {
        type: Date,
        default: Date.now
      },
    }
  ],
  
})

module.exports = SubExercise = mongoose.model('subexcercise', SubExerciseSchema)