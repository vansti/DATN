const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
const Validator = require('validator');



// Load Input Validation
const validateAddCourseInput = require('../../validation/addcourse');


// Course Model
const Course = require('../../models/Course');
const User = require('../../models/User');
const Attendance = require('../../models/Attendance');

router.use(cors());


// @route   POST api/attendance/add-attendance
// @desc    add attendance
// @access  Private
router.post(
  '/add-attendance',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newAttendance = new Attendance({
      courseId: req.body.courseId,
      students: req.body.students,
      date: req.body.date,
    });

    newAttendance
    .save()
    .then(attendance => {
      res.json(attendance)
    })
  }
);

// @route   POST api/attendance/get-attendance
// @desc    add attendance
// @access  Private
router.post(
  '/get-attendance/:courseId',
  (req, res) => {

    Attendance.aggregate([
      {
        $match:{ 'courseId': req.params.courseId}
      },
      {
        $lookup:
        {
          from: "users",
          localField: "students.userId",
          foreignField : "_id",
          as: "attendance_users"
        }
      }
    ]).then((attendance)=>{
      attendance.map(element=>{
        element.students.map((student)=>{
          const temp = element.attendance_users.filter(user => user._id.toString() === student.userId.toString());
          student.name = temp[0].name
          student.photo = temp[0].photo
        })
        delete element.attendance_users
      })
      res.json(attendance)
    })

  }
);

// @route   POST api/attendance/edit-attendance
// @desc    edit attendance
// @access  Private
router.post(
  '/edit-attendance',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Attendance.updateOne(
      { "_id" : req.body._id},
      { $set: { "students" :  req.body.students} }
    )    
    .then(attendance => {
      res.json(attendance)
    })
  }
);

module.exports = router;