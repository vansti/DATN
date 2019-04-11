const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddCourseInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.title)) 
    errors.title = 'Hãy điền tên khóa học';

  if (Validator.isEmpty(data.intro)) 
    errors.intro = 'Hãy điền giới thiệu ngắn';

  if (data.enrollDeadline === null) 
    errors.enrollDeadline = 'Hãy chọn hạn chót ghi danh';
  
  if (Validator.isEmpty(data.studyTime))
    errors.studyTime = 'Hãy điền thời gian học';

  if (data.openingDay === null) 
    errors.openingDay = 'Hãy chọn ngày khai giảng';
  
  if (Validator.isEmpty(data.fee)) 
    errors.fee = 'Hãy điền học phí';  
  
  if (Validator.isEmpty(data.info)) 
    errors.info = 'Hãy điền nội dung khoa học'; 
     
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
