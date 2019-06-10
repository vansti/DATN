const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');

// Model
const LessonList = require('../../models/LessonList');
const Lesson = require('../../models/Lesson');

const validateAddLessonListInput = require('../../validation/addlessonlist');

router.use(cors());


// @route   POST api/lesson/add-lesson-list
// @desc    add lesson list
// @access  Private
router.post(
  '/add-lesson-list',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    const { errors, isValid } = validateAddLessonListInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var lesson = [];
    for( var i=0; i < req.body.noLesson; i++ )
    {
      var temp = {}
      temp.text = 'Buổi học ' +  Number(i + 1);
      lesson.push(temp)
    }

    const newLessonList = new LessonList({
      title: req.body.title,
      lesson
    });
    newLessonList.save()
    .then(res.json({mes: 'Thêm danh sách bài học'}))
    .catch(err => console.log(err));
  }
);

// @route   POST api/lesson/get-lesson-list
// @desc    get lesson list
// @access  Private
router.get(
  '/get-lesson-list',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    LessonList.find({},'title lesson._id lesson.text').then(list=>res.json(list)).catch(err => console.log(err));
  }
);

// @route   POST api/lesson/get-lesson-in-list
// @desc    get a lesson in list
// @access  Private
router.get(
  '/get-lesson-in-list/:listId/:lessonId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    LessonList.findOne({ _id: req.params.listId },{ lesson:{ $elemMatch:{ _id: req.params.lessonId } } })
    .then(lesson=>res.json(lesson))
    .catch(err => console.log(err));
  }
);

// @route   POST api/lesson/edit-lesson/:listId/:lessonId
// @desc    edit lesson 
// @access  Private
router.post(
  '/edit-lesson/:listId/:lessonId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        await
        LessonList.updateOne(
          { _id: req.params.listId, "lesson._id": req.params.lessonId },
          { 
            $set: 
            { 
              "lesson.$.text" : req.body.text ,
              "lesson.$.files" : req.body.files ,
              "lesson.$.content" : req.body.content
            }
          }
        )
        
        await
        Lesson.updateMany(
          { "rootId": req.params.lessonId },
          {
            $set: 
            { 
              text : req.body.text ,
              files : req.body.files ,
              content : req.body.content
            }
          }
        )

      .then(res.json({mes: 'Thay đổi nội dung bài học thành công'}))
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/lesson/get-list-nolesson/:number
// @desc    lấy danh sách bài học có số buổi học tùy chọn
// @access  Private
router.get(
  '/get-list-lessonTotal/:lessonTotal',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    LessonList.aggregate([
      {
        $project: {
          title: 1,
          lessonTotal: { $size: "$lesson" }
        }
      }
    ])
    .then(list=>{
      var found = list.filter(element => element.lessonTotal == req.params.lessonTotal)
      res.json(found)
    })
    .catch(err => console.log(err));

  }
);

// @route   POST api/lesson/get-lesson-in-course/${courseId}/${lessonId}
// @desc    lấy 1 bài học trong khóa học
// @access  Private
router.get(
  '/get-lesson-in-course/:courseId/:lessonId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Lesson.findOne({_id: req.params.lessonId, courseId: req.params.courseId})
    .populate({
      path: 'exercises'
    })
    .populate({
      path: 'quizzes.quizId'
    })
    .then(lesson=>res.json(lesson))
    .catch(err => console.log(err));
  }
);

// @route   POST api/lesson/add-quiz-event/:courseId/:lessonId/:quizId
// @desc    add quiz inlesson
// @access  Private
router.post(
  '/add-quiz-event/:courseId/:lessonId/:quizId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    const quiz = {
      quizId: req.params.quizId,
      password: req.body.password,
      deadline: req.body.deadline,
      startTime: req.body.startTime
    }
    const newSubQuiz = new SubQuiz({
      quizId: req.params.quizId,
      courseId: req.params.courseId,
      studentSubmission: []
    });

    async function run() {
      try {

        const course = await Course.findById(req.params.courseId);
        const find = course.quizzes.find(quiz => quiz.toString() === req.params.quizId.toString());
        if(find === undefined)
        {
          course.quizzes.push(req.params.quizId);
          await course.save();
        }

        //create subQuiz
        await newSubQuiz.save();

        await  
        Lesson.updateOne(
          { courseId: req.params.courseId, _id: req.params.lessonId },
          { 
            $push: 
            { 
              quizzes : quiz
            }
          }
        )

        res.json({mes: 'Chọn bài trắc nghiệm cho bài học thành công'});
      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

module.exports = router;