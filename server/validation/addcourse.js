const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddCourseInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.courseCode = !isEmpty(data.courseCode) ? data.courseCode : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Hãy điền tên khóa học';
  }

  if (Validator.isEmpty(data.courseCode)) {
    errors.courseCode = 'Hãy điền mã khóa học';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
