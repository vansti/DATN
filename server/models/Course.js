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
  quizzes: [{type: mongoose.Schema.ObjectId, ref: 'quizzes'}],
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Course = mongoose.model('courses', CourseSchema)

