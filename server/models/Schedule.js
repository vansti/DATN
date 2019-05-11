const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ScheduleSchema = new Schema({
  courseId:{
    type: Schema.Types.ObjectId,
    ref: "courses"
  },
  events: [
    {
      start: {
        type: String
      },
      end: {
        type: String
      },
      text: {
        type: String,
      },
      content: {
        type: String
      },
      files: [
        {
          id:{
            type: String
          },
          name: {
            type: String
          },
          url: {
            type: String
          }
        }
      ],
      exercises: [
        {
          type: Schema.Types.ObjectId,
          ref: "exercises"
        }
      ],
      quizzes: [
        {
          type: Schema.Types.ObjectId,
          ref: "quizzes"
        }
      ],
      date:{
        type: String
      }
    }
  ],
  created:{
    type: Date,
    default : Date.now
  }
});

module.exports = Schedule = mongoose.model('schedule', ScheduleSchema)