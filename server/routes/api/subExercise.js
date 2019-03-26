const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
const Validator = require('validator');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

//Course Model
const SubExercise = require('../../models/SubExercise');
const User = require('../../models/User');

router.use(cors());

//@route POST api/subExercise/checkpoint
//@desc checkpoint
//@access Private

router.get(
  '/checkpoint/:subexerciseid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const points = {
      students:[]
    };
    SubExercise.findById(req.params.subexerciseid).then(subexercise=>{
      User.find({'_id': { $in: subexercise.students}}, {point : 1},function(err,students){
        points.students = students;
        res.json(points)
      });
    });
  }
);
