const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
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
    }
  ],
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
  deadline:{
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Exercise = mongoose.model('exercises', ExerciseSchema)

