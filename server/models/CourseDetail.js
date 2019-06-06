const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseDetailSchema = new Schema({
  courseId:{
    type: String
  },
  info: {
    type: String
  },
  studyTime:{
    type: String
  },
  openingDay:{
    type: Date
  },
  endDay:{
    type: Date
  },
  fee:{
    type: String
  },
  maxStudent: {
    type: Number
  },
  minStudent: {
    type: Number
  },
  isFull:{
    type: Boolean,
    default: false
  },
  enrollStudents:[{
    student: {
      type: mongoose.Schema.ObjectId, ref: 'users'
    },
    paymentMethod:{
      type: String
    },
    paymentDetail:{
      recipient_name:{
        type: String
      },
      email:{
        type: String
      },
      payerID:{
        type: String
      },
      line1:{
        type: String
      },
      city:{
        type: String
      }
    },
    enrollDate: {
      type: Date,
      default: Date.now
    }
  }]
})

module.exports = CourseDetail = mongoose.model('coursedetail', CourseDetailSchema)

