const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSubmitQuizInput(data) {
  let errors = {};
  
  data.deadline = !isEmpty(data.deadline) ? data.deadline :'';
  data.isLate = !isEmpty(data.isLate) ? data.isLate :'';
  data.point= !isEmpty(data.point) ? data.point:'';

  

  if(Validator.data.deadline < Date.now){
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