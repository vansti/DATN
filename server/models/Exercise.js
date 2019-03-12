const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  userName: {
    type: String
  },
  userPhoto: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  attachFile:{
    type: String
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      userName: {
        type: String
      },
      userPhoto: {
        type: String
      },
      created: {
        type: Date,
        default: Date.now
      }
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Exercise = mongoose.model('exercises', ExerciseSchema)

