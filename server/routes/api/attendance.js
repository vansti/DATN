const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
const moment = require('moment');

// Course Model
const Course = require('../../models/Course');
const User = require('../../models/User');
const Attendance = require('../../models/Attendance');
const Schedule = require('../../models/Schedule');

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

// @route   GET api/attendance/get-attendance/:courseId
// @desc    get attendance by courseId
// @access  Private
router.get(
  '/get-attendance/:courseId',
  passport.authenticate('jwt', { session: false }),
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
          student.email = temp[0].email
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

// @route   GET api/attendance/get-student-absent/:courseId/:studentId
// @desc    get a student absent list in a course by courseId and that studentId
// @access  Private
router.get(
  '/get-student-absent/:courseId/:studentId',
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Attendance.find({
      'courseId': req.params.courseId,
      students: { $elemMatch: { 'userId': req.params.studentId, isPresent: false } } 
    },{date: 1}, function(err, absentlist){
      Attendance.countDocuments({ 
        'courseId': req.params.courseId, 
        'students.userId': req.params.studentId
      },function(err, count) {
        const data = {};
        data.attendanceNumber = count
        data.absentlist = []
        
        return Promise.all(absentlist.map(element=>{
        return Schedule.find(
          {
            'courseId': req.params.courseId, 
            "events.date": element.date
          },
          { 
            _id: 0,
            events: { 
              $elemMatch: {
                'date': element.date
              }
            }
          })
          .then(schedule => {
            var temp = {};
            if(schedule[0] != null )
              if(schedule[0].events.length !== 0)
                temp.event = schedule[0].events[0]

            temp._id = element._id
            temp.date = element.date
            data.absentlist.push(temp)
          })
        }))
        .then(()=>res.json(data))
      })
    });

  }
);
module.exports = router;