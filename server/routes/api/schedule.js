const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');

// Course Model
const Schedule = require('../../models/Schedule');


router.use(cors());


// @route   POST api/schedule/add-schedule
// @desc    add schedule
// @access  Private
router.post(
  '/add-schedule',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Schedule.findOne({ courseId: req.body.courseId }).then(schedule=>{
      if (schedule) {
        
        schedule.events = req.body.events
        Schedule.findByIdAndUpdate(schedule._id, schedule, {new: true}).then(fschedule => res.json(fschedule))
        .catch(err => console.log(err));

      } else{

        const newSchedule = new Schedule({
          courseId: req.body.courseId,
          events: req.body.events
        });
    
        newSchedule
        .save()
        .then(schedule => {
          res.json(schedule)
        })

      }
    })

  }
);

// @route   GET api/schedule/get-schedule/:courseId
// @desc    get schedule by courseId
// @access  Private
router.get(
  '/get-schedule/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Schedule.findOne({ courseId: req.params.courseId }).then(schedule=>{
      res.json(schedule)
    })
    .catch(err => res.status(404))

  }
);



module.exports = router;