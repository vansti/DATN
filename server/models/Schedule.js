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
      //từ mấy giờ trong ngày
      start: {
        type: String
      },
      //đến mấy giờ trong ngày
      end: {
        type: String
      },
      //new
      // title: {
      //   type: String,
      //   required: true
      // },
      // content: {
      //   type: String
      // },
      // exercises: [
      //   {
      //     type: Schema.Types.ObjectId,
      //     ref: "exercises"
      //   }
      // ],
      // quizzes: [
      //   {
      //     type: Schema.Types.ObjectId,
      //     ref: "quizzes"
      //   }
      // ],
      //endnew
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