const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    default: 'https://res.cloudinary.com/dk9jsd8vf/image/upload/v1552047406/1.png'
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

