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
const validateAddStudentInput = require('../../validation/addStudent');
const validateAddJoinedStudentInput = require('../../validation/addJoinedStudent');


// User Model
const User = require('../../models/User');
const Course = require('../../models/Course');
const CourseDetail = require('../../models/CourseDetail');

router.use(cors());
router.use(formData.parse())

const sendEmail = require('../../email/email.send')
const templates = require('../../email/email.templates')

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

      if(req.body.role === 'student')
      {
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          phone: req.body.phone
        });
      }else{
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          confirmed: true,
          phone: req.body.phone
        });
      }


      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user=>{
              sendEmail(user.email, templates.confirm(user._id, user.name))
              .then(res.json({mes:"Tạo tài khoản thành công"}))
              .catch(err => console.log(err));
  
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/add-student
// @desc    Add student
// @access  Public
router.post('/add-student', (req, res) => {
  const { errors, isValid } = validateAddStudentInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  async function run() {
    try {

      const course =         
      await 
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { isFull : 1 }
      )

      if(course.isFull === true)
      {
        let errors = {};
        errors.city = 'Lớp học đã đạt số thành viên tối đa không thể thêm!'
        return res.status(400).json(errors);
      }

      const find = await User.findOne({ email: req.body.email })
      if (find) {
        errors.email = 'Email đã tồn tại';
        return res.status(400).json(errors);
      } 
      
      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        confirmed: true,
        phone: req.body.phone
      });

      await
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
        });
      });

      await 
      CourseDetail.findOneAndUpdate(
        { 'courseId' : req.body.courseId },
        { 
          $push: {
            enrollStudents: {
              student: newUser._id,
              paymentMethod: 'Thanh toán tại trung tâm',
              paymentDetail: {
                recipient_name: req.body.recipient_name,
                email: req.body.email2,
                line1: req.body.line1,
                city: req.body.city
              }
            }
          }
        }
      )

      await 
      Course.findByIdAndUpdate(
        req.body.courseId ,
        { 
          $push: {
            students: newUser._id
          }
        }
      )

      await
      User.findByIdAndUpdate(
        newUser._id ,
        { 
          $push: {
            courses: req.body.courseId
          }
        }
      )
      
      const coursedetail = 
      await
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { maxStudent: 1, enrollStudents: 1}
      )

      if(coursedetail.enrollStudents.length >= coursedetail.maxStudent)
        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.body.courseId },
          { isFull: true }
        )

      res.json({mes:"Thêm học viên thành công"})
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   POST api/users/add-joined-student
// @desc    Add student
// @access  Public
router.post('/add-joined-student', (req, res) => {
  const { errors, isValid } = validateAddJoinedStudentInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  async function run() {
    try {

      const course =         
      await 
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { isFull : 1 }
      )

      if(course.isFull === true)
      {
        let errors = {};
        errors.city = 'Lớp học đã đạt số thành viên tối đa không thể thêm!'
        return res.status(400).json(errors);
      }

      await 
      CourseDetail.findOneAndUpdate(
        { 'courseId' : req.body.courseId },
        { 
          $push: {
            enrollStudents: {
              student: req.body.studentId,
              paymentMethod: 'Thanh toán tại trung tâm',
              paymentDetail: {
                recipient_name: req.body.recipient_name,
                email: req.body.email,
                line1: req.body.line1,
                city: req.body.city
              }
            }
          }
        }
      )

      await 
      Course.findByIdAndUpdate(
        req.body.courseId ,
        { 
          $push: {
            students: req.body.studentId
          }
        }
      )

      await
      User.findByIdAndUpdate(
        req.body.studentId ,
        { 
          $push: {
            courses: req.body.courseId
          }
        }
      )
      
      const coursedetail = 
      await
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { maxStudent: 1, enrollStudents: 1}
      )

      if(coursedetail.enrollStudents.length >= coursedetail.maxStudent)
        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.body.courseId },
          { isFull: true }
        )

      res.json({mes:"Thêm học viên thành công"})
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   GET api/users/re-send-mail
// @desc    Gửi lại mail
// @access  Public
router.post('/re-send-mail', (req, res) => {

  async function run() {
    try {
      const user = await User.findOne({ email: req.body.email }, 'email name')

      if (!user) {
        errors.email_login = 'Không tìm thấy email này';
        return res.status(404).json(errors);
      }

      sendEmail(user.email, templates.confirm(user._id, user.name))
      .then(res.json({mes:"Đã gửi lại mail xác nhận"}))
      .catch(err => console.log(err));

    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   GET api/users/search-student
// @desc    Gửi lại mail
// @access  Public
router.post('/search-student', (req, res) => {

  async function run() {
    try {
      const user = await User.findOne({ email: req.body.email }, 'email name photo')

      if (!user) {
        let errors = {};
        errors.search = 'Không tìm thấy email này';
        return res.status(404).json(errors);
      }

      res.json(user)
      
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   GET api/users/confirm/:userId
// @desc    Xác nhận mail
// @access  Public
router.post('/confirm/:userId', (req, res) => {

  async function run() {
    try {
      const user = await User.findById(req.params.userId, 'confirmed')
      if(user.confirmed === true)
        res.json({ mes: "Tài khoản mail đã được kích hoạt" })
      else{
        await User.findByIdAndUpdate(
                req.params.userId, 
                {
                  confirmed: true
                }
              )
        res.json({ mes: "Xác nhận thành công" })
      }
    } catch (err) {
      console.log(err)
    }
  }

  run();

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

    if (user.confirmed === false) {
      errors.email_login = 'Hãy xác nhận email của bạn trước khi đăng nhập';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, role: user.role, photo: user.photo, email: user.email }; // Create JWT Payload

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

        const coursedetail = await 
          CourseDetail.findOne(
            { 'courseId' : req.params.courseId } ,
            { enrollStudents: 1 , maxStudent: 1, minStudent: 1, isFull: 1 }
          )
          .populate('enrollStudents.student', '_id name email photo')
          .lean()
          
        const result = {
          enrollStudents: coursedetail.enrollStudents,
          maxStudent: coursedetail.maxStudent,
          minStudent: coursedetail.minStudent,
          isFull: coursedetail.isFull
        }
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