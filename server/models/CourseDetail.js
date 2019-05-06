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
  fee:{
    type: String
  },
  enrollStudents:[{
    student: {
      type: mongoose.Schema.ObjectId, ref: 'users'
    },
    enrollDate: {
      type: Date,
      default: Date.now
    }
  }]
})

module.exports = CourseDetail = mongoose.model('coursedetail', CourseDetailSchema)

