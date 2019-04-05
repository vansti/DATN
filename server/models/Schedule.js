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
      id: {
        type: String
      },
      start: {
        type: String
      },
      end: {
        type: String
      },
      text: {
        type: String
      },
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