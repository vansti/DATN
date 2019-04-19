const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  enrollDeadline:{
    type: Date
  },
  intro: {
    type: String
  },
  coursePhoto: {
    type: String,
    default: process.env.COURSE_PHOTO_DEFAULT
  },
  teachers: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  students: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  exercises: [{type: mongoose.Schema.ObjectId, ref: 'exercises'}],
  testQuiz: [{type: mongoose.Schema.ObjectId, ref: 'testquizzes'}],
  created: {
    type: Date,
    default: Date.now
  },
  pointColumns: {
    type: Array,
    required: true
  }
})

module.exports = Course = mongoose.model('courses', CourseSchema)

