const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSubmitExerciseInput(data) {
  let errors = {};
  
  data.date = !isEmpty(data.date) ? data.date :'';
  data.isLate = !isEmpty(data.isLate) ? data.isLate :'';

  if(Validator.data.date < Date.now){
    data.isLate = true;
  }
  
  if(Validator.data.isLate == true){
    errors.isLate = 'Hạn nộp bài đã hết';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};