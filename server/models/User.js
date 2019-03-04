const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date:{
    type: Date,
    default : Date.now
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  role: { 
    type: String,
    trim: true
  },
  courses: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Course model
      ref: "Course"
    }
  ]

});

module.exports = User = mongoose.model('users',UserSchema)