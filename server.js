const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

const students = require('./server/routes/api/students');


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

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./server/config/passport')(passport);

// Students Route
app.use('/api/students', students)


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