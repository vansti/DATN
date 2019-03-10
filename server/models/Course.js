const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  coursePhoto: {
    type: String,
    default: process.env.COURSE_PHOTO_DEFAULT
  },
  mainteacher: { type: String },
  teachers: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  students: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  comments: 
  [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: 'users'}
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
})

module.exports = Course = mongoose.model('courses', CourseSchema)

