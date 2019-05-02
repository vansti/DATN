const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddTestQuizInput(data) {
  let errors = {};
  data.testTitle = !isEmpty(data.testTitle) ? data.testTitle : '';
  data.testSynopsis = !isEmpty(data.testSynopsis) ? data.testSynopsis : '';
  data.courseId = !isEmpty(data.courseId) ? data.courseId : '';
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
  if (!data.quizzes || !data.quizzes.length) {
    errors.quizzes = { _error: 'Bài kiểm tra phải có ít nhất một câu hỏi' };
  } else {
    //validate array question
    const quizArrayErrors = [];
    data.quizzes.forEach((quiz, quizIndex) => {
      const quizErrors = {};
      if(!quiz || !quiz.question) {
        quizErrors.question = 'Yêu cầu';
      }
      if (quiz || !quiz.answers || !quiz.answers.length) {
        //validate array answer
        const answerArrayErrors = [];
        quiz.answers.forEach((answer, answerIndex) => {
          if(!answer || !answer.length) {
            answerArrayErrors[answerIndex] = 'Yêu cầu';
          }
        })
        if (answerArrayErrors.length) {
          quizErrors.answers = answerArrayErrors;
          quizArrayErrors[quizIndex] = quizErrors;
        }
        //end array answer
      }
    });
    if(quizArrayErrors.length) {
      errors.quizzes = quizArrayErrors;
    }
    //end array question
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
