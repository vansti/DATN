const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const AttendanceSchema = new Schema({
  courseId: {
    type: String
  },
  students: [
    {      
      userId: {
        type: mongoose.Schema.ObjectId, ref: 'users'
      },
      isPresent: {
        type: Boolean
      }
    }
  ],
  date: {
    type: Date,
    default: moment(new Date()).format('YYYY-MM-DD')
  }
})

module.exports = Attendance = mongoose.model('attendance', AttendanceSchema)

