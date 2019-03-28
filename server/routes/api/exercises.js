const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
const Validator = require('validator');

const fileUpload = require('express-fileupload');
const fs = require('fs');


// Load Input Validation
const validateAddExerciseInput = require('../../validation/addexercise');


// Course Model
const Course = require('../../models/Course');
const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const SubExercise = require('../../models/SubExercise');

router.use(cors());

router.use(fileUpload());


// @route   POST api/exercise/add-exercise
// @desc    add exercise
// @access  Private
router.post(
  '/add-exercise',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddExerciseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    const newExercise = new Exercise({
      title: req.body.title,
      text: req.body.text,
      attachFiles: req.body.attachFiles,
      deadline: req.body.deadline,
      courseId: req.body.courseId
    });

    newExercise.save().then(exercise=>{
      Course.findById(req.body.courseId).then(course => {
        course.exercises.unshift(exercise._id);
        course.save().then(course => res.json(course));
      })
    })
  }
);

// @route   GET api/exercises/:courseId
// @desc    Return exercise list
// @access  Private
router.get('/:courseId', (req, res) => {
  Course.findById(req.params.courseId).then(course => {
    Exercise.find({
        '_id': { $in: course.exercises}
    }, function(err, exercises){
      res.json(exercises)
    });
  })
});

// @route   Get api/exercises/get-comments/:exerciseId
// @desc    Get comments
// @access  Private
router.get('/get-comments/:exerciseId', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Exercise.find({'_id': req.params.exerciseId},{ comments: 1 },function(err, comments){
  //   res.json(comments)
  // });

  Exercise.findById(req.params.exerciseId).then(exercise => {
    var cexercise = {
      comments: [],
      _id: exercise._id
    }

    return Promise.all(exercise.comments.map(comment=>{
      return User.findById(comment.user).then(user=>{
        var temp_comment = {
          _id: comment._id,
          userName: user.name,
          userPhoto: user.photo,
          text: comment.text,
          created: comment.created,
        }
        cexercise.comments.push(temp_comment)
      })
    })).then(()=>{
      cexercise.comments.sort(function(a, b) {
        a = new Date(a.created);
        b = new Date(b.created);
        return a<b ? -1 : a>b ? 1 : 0;
      });
      res.json(cexercise)
    })
  })
});

// @route   POST api/exercises/comment/:exerciseId
// @desc    Comment on a exercise
// @access  Private
router.post('/comment/:exerciseId', passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = {};

  if (Validator.isEmpty(req.body.text)) {
    errors.text = 'Hãy nhập bình luận';
    return res.status(400).json(errors);
  }

  Exercise.findById(req.params.exerciseId).then(exercise=>{
    const newComment = {
      user: req.user.id,
      text: req.body.text
    }

    exercise.comments.push(newComment);
    exercise.save().then(exercise => res.json(exercise));
  })
  .catch(err => res.status(404).json({ exercisenotfound: 'Không tìm thấy exercise' }));
});

// @route   Get api/exercises/exercise/:id
// @desc    Get 1 exercise
// @access  Private
router.get('/exercise/:id', (req, res) => {
  Exercise.findById(req.params.id, { title: 1 }).then(exercise => {
    res.json(exercise)
    // console.log(exercise)
  })
  .catch(err => res.status(404).json({ exercisenotfound: 'Không tìm thấy exercise' }));

});
// @route   POST api/exercises/:exerciseId/submit
// @desc    submit a exercise
// @access  Private
router.post('/:exerciseId/submit', passport.authenticate('jwt', { session: false }), (req, res) => {
  
  let uploadedFile = req.files.file;
  // if(!uploadedFile.name.endWith(".txt") && !uploadedFile.name.endWith(".pdf") 
  //   && !uploadedFile.name.endWith(".docx") && !uploadedFile.name.endWith(".doc")){
  //   return res.send('.txt/.pdf/.docx/.doc extension only');
  // }

  if(uploadedFile.size > 5 * 1024 * 1024){
    return res.send('File is too large!');
  }

  var dir = './file_upload/' + req.user._id + '/' + req.params.exerciseId + '/'; 
  
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, {recursive: true}, err=>{});
  }
  //Path /file_upload/:userId/:exerciseId
  uploadedFile.mv('./file_upload/' + req.user._id + '/' + req.params.exerciseId + '/' + uploadedFile.name, function(err) {
    if (err)
      return res.status(500).send(err);
  });
  const submission = {
        name: uploadedFile.name,
        url: './file_upload/' + req.user._id + '/' + req.params.exerciseId + '/' + uploadedFile.name,
    }
  SubExercise.findOne({exerciseId: req.params.exerciseId}).then((data)=>{
    if(data != null){
      if(!data.studentExercise.find(submission => submission.userId.toString() === req.user._id)){
        SubExercise.updateOne({
          exerciseId: req.params.exerciseId
        },{
          $push: { 
            studenExercise: {
              userId: req.user._id,
              attachFile: submission,
          }} 
        }).then(()=>{
          res.json("Đã nộp");
        });
      }else{
        res.json("Đã có bài tập, hãy xóa bài cũ");
      }
      
    }else{
      const subExercise = new SubExercise({
        exerciseId: req.params.exerciseId,
        studenExercise:[
          {
            userId: req.user._id,
            attachFile:submission
          }
        ]
      });
      subExercise.save().then(()=>{
        res.json("Đã nộp");
      })
    }
  })
});

// @route   POST api/exercises/:exerciseId/download
// @desc    download a submission to exercise
// @access  Private
router.post('/:exerciseId/download', passport.authenticate('jwt', { session: false }), (req, res) => {
  let file = fs.readdirSync('./file_upload')[0];
  //Path /file_upload/:userId/exerciseId/file
  res.download(__dirname + './file_upload/' + req.user.id + '/' + req.params.exerciseId + '/' + file, 
    (err)=>{
      if(err){
        res.send("Can't download file");
      }
  });
});

module.exports = router;