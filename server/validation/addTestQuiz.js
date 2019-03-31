const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddTestQuizInput(data) {
  let errors = {};
  data.testTitle = !isEmpty(data.testTitle) ? data.testTitle : '';
  data.testSynopsis = !isEmpty(data.testSynopsis) ? data.testSynopsis : '';
  data.courseId = !isEmpty(data.courseId) ? data.courseId : '';

  if (Validator.isEmpty(data.testTitle)) {
    errors.testTitle = 'Hãy điền tiêu đề bài tập';
  }

  if (Validator.isEmpty(data.testSynopsis)) {
    errors.testSynopsis = 'Hãy điền hạn chót nộp bài';
  }

  if (Validator.isEmpty(data.courseId)) {
    errors.courseId = 'Hãy điền nội dung bài tập';
  }
  // data.quizzes.forEach(quiz => {
  //   quiz.question =  !isEmpty(data.courseId) ? quiz.question : '';
  //   if (Validator.isEmpty(data.question)) {
  //     errors.deadline = 'Hãy điền câu hỏi';
  //   }
  // });

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
