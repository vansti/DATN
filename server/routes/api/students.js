const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Student Model
const Student = require('../../models/Student');

router.use(cors());

// @route   POST api/students/register
// @desc    Register student
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Student.findOne({ email: req.body.email }).then(student => {
    if (student) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {

      const newStudent = new Student({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newStudent.password, salt, (err, hash) => {
          if (err) throw err;
          newStudent.password = hash;
          newStudent
            .save()
            .then(student => res.json(student))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/students/login
// @desc    Login Student / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find student by email
  Student.findOne({ email }).then(student => {
    // Check for Student
    if (!student) {
      errors.email = 'Student not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, student.password).then(isMatch => {
      if (isMatch) {
        // Student Matched
        const payload = { id: student.id, name: student.name }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'T ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/students/current
// @desc    Return current student
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
      id: req.student.id,
      name: req.student.name,
      email: req.student.email
    });
  }
);
module.exports = router;