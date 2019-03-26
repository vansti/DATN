const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const SubExerciseSchema = new Schema({
  exerciseId:{type: mongoose.Schema.ObjectId, ref: 'exercises'},
  studenExercise:[
    {
      userId:{type: mongoose.Schema.ObjectId, ref: 'users'},
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
        }
      ],
      note:{
        type: String,
      },
      point:{ 
        type: Double,
      },
    }
  ],
  date: {
    type: Date
  },
  isLate:{
    type: Boolean
  }
})

module.exports = SubExercise = mongoose.model('subexcercise', SubExerciseSchema)
