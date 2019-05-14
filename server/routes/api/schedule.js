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

    async function run() {
      try {
        const schedule = await 
        Schedule.findOne(
          { courseId: req.params.courseId }
        ).lean()
        
        res.json(schedule)
      } catch (err) {
        console.log(err)
      }
    }

    run();

  }
);

// @route   GET api/schedule/get-event-schedule/:courseId/:eventId
// @desc    get event schedule by courseId eventId
// @access  Private
router.get(
  '/get-event-schedule/:courseId/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {
        const schedule = await 
        Schedule.findOne(
          { 
            courseId: req.params.courseId
          },
          {
            events: { $elemMatch: { _id: req.params.eventId }}
          }
        )
        .populate({
          path: 'events.exercises'
        })
        .populate({
          path: 'events.quizzes'
        })
        res.json(schedule.events[0])
      } catch (err) {
        console.log(err)
      }
    }

    run();

  }
);

// @route   POST api/schedule/edit-event
// @desc    edit event
// @access  Private
router.post(
  '/edit-event/:courseId/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Schedule.updateOne(
      { courseId: req.params.courseId, "events._id": req.params.eventId },
      { 
        $set: 
        { 
          "events.$.text" : req.body.text ,
          "events.$.files" : req.body.files ,
          "events.$.content" : req.body.content
        }
      }
    )
    .then(res.json({mes: 'Thay đổi nội dung bài học thành công'}))
    .catch(err => console.log(err));
  }
);

// @route   POST api/schedule/add-quiz-event/:courseId/:eventId/:quizId
// @desc    add quiz event
// @access  Private
router.post(
  '/add-quiz-event/:courseId/:eventId/:quizId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Schedule.updateOne(
      { courseId: req.params.courseId, "events._id": req.params.eventId },
      { 
        $push: 
        { 
          "events.$.quizzes" : req.params.quizId 
        }
      }
    )
    .then(res.json({mes: 'Chọn bài trắc nghiệm cho bài học thành công'}))
    .catch(err => console.log(err));
  }
);

module.exports = router;