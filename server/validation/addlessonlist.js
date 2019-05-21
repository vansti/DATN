const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddLessonListInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Hãy điền tiêu đề';
  }

  if (Validator.isEmpty(data.noLesson)) {
    errors.noLesson = 'Hãy điền số bài học';
  }

  return {
    errors, 
    isValid: isEmpty(errors)
  };
};
