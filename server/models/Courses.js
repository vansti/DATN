const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required.'
  },
  description: {
    type: String,
    required: 'Title is required.'
  },
  courseCode: {
    type: String,
    required: 'Course code is required.',
    unique: 'Course code already exists.',
  },
  coursePhoto: {
    data: Buffer,
    contentType: String
  },
  students: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  comments: 
  [
      {
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
      }
  ],
  instructor: String,
  created: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('Course', CourseSchema)

