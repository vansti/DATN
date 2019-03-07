const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const passport = require('passport');
require('dotenv').config()

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

router.use(cors());

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
        password: req.body.password
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
      errors.email = 'Không tìm thấy tài khoản này';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password sai';
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
      photo: req.user.photo
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
    

    cloudinary.v2.uploader.upload(req.body.photo)
      .then(result => {
        if (req.body.photo) profileFields.photo = result.secure_url
        User.findByIdAndUpdate(req.user.id, profileFields, {new: true}).then(profile => res.json(profile));
      })

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

    User.findById(req.user.id).then(user=>{
      
      bcrypt.compare(opassword, user.password).then(isMatch => {
        if (isMatch) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              User.findByIdAndUpdate(req.user.id, user, {new: true}).then(profile => res.json(profile));
            });
          });
        } else {
          errors.password = 'Password hiện tại không đúng';
          return res.status(400).json(errors);
        }
      });

    })
  }
);

module.exports = router;