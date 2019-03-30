const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config()

const users = require('./server/routes/api/users');

const courses = require('./server/routes/api/courses');

const exercises = require('./server/routes/api/exercises');

const attendance = require('./server/routes/api/attendance');

const schedule = require('./server/routes/api/schedule');

const quiz = require('./server/routes/api/quiz');

const app = express();

//Bodyparser Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended : false
  })
)

//DB config
const db = require('./server/config/keys').mongoURI;

//Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(()=> console.log('Mongodb connected ...'))
  .catch(err => console.log(err));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./server/config/passport')(passport);

// users Route
app.use('/api/users', users)

// courses Route
app.use('/api/courses', courses)

// exercises Route
app.use('/api/exercises', exercises)

// attendance Route
app.use('/api/attendance', attendance)

// schedule Route
app.use('/api/schedule', schedule)

// exercises Route
app.use('/api/quiz', quiz);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server starting on ${port}`));