const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

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
    type: String
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: process.env.USER_PHOTO_DEFAULT
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
      ref: "courses"
    }
  ],
  created:{
    type: Date,
    default : Date.now
  },

});

module.exports = User = mongoose.model('users',UserSchema)