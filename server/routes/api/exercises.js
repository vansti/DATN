const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
const Validator = require('validator');
const rimraf = require("rimraf");

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
router.get('/:courseId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Course.findById(req.params.courseId).then(course => {
    Exercise.find({
        '_id': { $in: course.exercises}
    }, async function(err, exercises){
      for(let i = 0; i < exercises.length; i++){
        // let temp = (await SubExercise.findById(exercises[i]._id));
        // if(temp){
        //   exercises[i]["point"] = temp.point;
        // }
        exercises[i]["point"] = "XYZ";
      }
      var a = [];
      return Promise.all(exercises.map(exercise=>{
        console.log(exercise)
        exercise.point = 'XYZ'
        return a.push(exercise) 
      })).then(()=>
        res.json(a)
      )
      //console.log(exercises[0]);

    });
  })
});

// @route   Get api/exercises/get-comments/:exerciseId
// @desc    Get comments
// @access  Private
router.get(
  '/get-comments/:exerciseId',
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {

  Exercise.findById(
    req.params.exerciseId ,
    { comments: 1 }
  )
  .populate('comments.user', '_id name email photo')
  .lean()
  .then(commments => res.json(commments))
  .catch(err => console.log(err));

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
    exercise.save().then(res.json({'mes':"Bình luận của bạn đã được gửi"}));
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
  let errors = {};

  if(uploadedFile.size > 5 * 1024 * 1024){
    errors.file = 'File quá lớn !'
    return res.status(404).json(errors);
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
router.get('/:exerciseId/download', passport.authenticate('jwt', { session: false }), (req, res) => {
  let file = fs.readdirSync('./file_upload/' + req.user.id + '/' + req.params.exerciseId)[0];
  //Path /file_upload/:userId/exerciseId/file
  return res.download('./file_upload/' + req.user.id + '/' + req.params.exerciseId + '/' + file);
});

// @route   POST api/exercises/:exerciseId/get-submission
// @desc    get a submission
// @access  Private
router.get('/:exerciseId/get-submission', passport.authenticate('jwt', { session: false }), (req, res) => {
  try{
    let fileName = fs.readdirSync('./file_upload/' + req.user.id + '/' + req.params.exerciseId)[0];
    res.json(fileName);
  }catch(e){
    res.json("")
  }
  //Path /file_upload/:userId/exerciseId/file
});

router.delete('/:exerciseId/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  try{
    rimraf.sync('./file_upload/' + req.user.id + '/' + req.params.exerciseId);
    res.json("Đã xóa");
  }catch(e){
    console.log(e);
    res.json("Không thể xóa");
  }
});

module.exports = router;