const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const passport = require('passport');
require('dotenv').config()

const formData = require('express-form-data')
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateProfileInput = require('../../validation/profile');
const validateChangePasswordInput = require('../../validation/password');

// User Model
const User = require('../../models/User');
const Course = require('../../models/Course');
const CourseDetail = require('../../models/CourseDetail');

router.use(cors());
router.use(formData.parse())

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email đã tồn tại';
      return res.status(400).json(errors);
    } else {

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find User by email
  User.findOne({ email }).then(user => {
    // Check for User
    if (!user) {
      errors.email_login = 'Không tìm thấy tài khoản này';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, role: user.role }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          //{ expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password_login = 'Mật khẩu sai';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current User
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      photo: req.user.photo,
      role: req.user.role
    });
  }
);

// @route   POST api/users/edit-profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/edit-profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.id = req.user.id;
    if (req.body.email) profileFields.email = req.body.email;
    if (req.body.name) profileFields.name = req.body.name;
    if (req.body.phone) profileFields.phone = req.body.phone;

    User.findByIdAndUpdate(req.user.id, profileFields, {new: true})
    .then(res.json({"mes":"Thay đổi thành công"}))
    .catch(err => console.log(err));
  }
);

// @route   post api/users/edit-avatar
// @desc    edit avatar
// @access  Private
router.post(
  '/edit-avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var fileGettingUploaded = req.files.image.path;
    cloudinary.uploader.upload(fileGettingUploaded, function(result) {
      User.updateOne(
        { _id: req.user.id },
        { $set:
           {
             photo: result.secure_url,
           }
        }
      )
      .then(res.json({"mes":"Thay đổi thành công"}))
      .catch(err => console.log(err));
    });
  }
);

// @route   POST api/users/change-password
// @desc    Change password
// @access  Private
router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePasswordInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    const opassword = req.body.opassword;
    const password = req.body.password;

    bcrypt.compare(opassword, req.user.password).then(isMatch => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            User.findByIdAndUpdate(req.user.id,{ $set: { password: hash }})
            .then(res.json({"mes":"Thay đổi password thành công"}))
            .catch(err => console.log(err));
          });
        });
      } else {
        errors.password = 'Mật khẩu hiện tại không đúng';
        return res.status(400).json(errors);
      }
    });
  }
);

// @route   GET api/users/get-users-in-course/:courseid
// @desc    get users in course
// @access  Private
router.get(
  '/get-users-in-course/:courseid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const users = {
      teachers:[],
      students:[]
    };

    async function run() {
      try {
        const course = await Course.findById(req.params.courseid)
        const teachers = await User.find({'_id': { $in: course.teachers}}, { name: 1, email: 1, photo: 1 })
        const students = await User.find({'_id': { $in: course.students}}, { name: 1, email: 1, photo: 1 })
        users.teachers = teachers;
        users.students = students;
        res.json(users)
      } catch (err) {
        console.log(err)
      }
    }

    run();
    
  }
);

// @route   GET api/users/:studentId
// @desc    Return student by id
// @access  Private
router.get('/:studentId', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.studentId)
 .then(student => res.json(student));
});

// @route   GET api/users/approve-list/student/:courseId
// @desc    lấy danh sách học viên ghi danh và danh sách học viên dc duyệt của 1 khóa học
// @access  Private
router.get(
  '/approve-list/student/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {
        const course = await     
          Course.findById(
            req.params.courseId ,
            { students: 1 }
          )
          .populate('students', '_id name email photo')

        const coursedetail = await 
          CourseDetail.findOne(
            { 'courseId' : req.params.courseId } ,
            { enrollStudents: 1 }
          )
          .populate('enrollStudents.student', '_id name email photo')

        const result = {
          students: course.students,
          enrollStudents: coursedetail.enrollStudents
        }
        console.log(result.enrollStudents);
        res.json(result)
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/users/approve-list/teacher/:courseId
// @desc    lấy danh sách giáo viên và danh sách giáo viên của 1 khóa học
// @access  Private
router.get(
  '/approve-list/teacher/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {
        const teacherInCourse = await     
          Course.findById(
            req.params.courseId,
            { teachers: 1 }
          )
          .populate('teachers', '_id name email photo')

        const teachers = await 
          User.find(
            { 'role' : 'teacher' } ,
            '_id name email photo'
          )
        const result = {
          teachers: teachers,
          teacherInCourse: teacherInCourse.teachers
        }
        res.json(result)
      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);
module.exports = router;