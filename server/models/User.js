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
    type: String
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
    type: String,
    default: 'https://res.cloudinary.com/dk9jsd8vf/image/upload/v1551844990/defaultavatar.png'
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
  ]

});

module.exports = User = mongoose.model('users',UserSchema)