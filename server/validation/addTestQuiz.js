const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddTestQuizInput(data) {
  let errors = {};
  data.testTitle = !isEmpty(data.testTitle) ? data.testTitle : '';
  data.testTime = !isEmpty(data.testTime) ? data.testTime : '';

  if (Validator.isEmpty(data.testTitle)) {
    errors.testTitle = 'Hãy điền tiêu đề bài tập';
  }

  if (Validator.isEmpty(data.testTime)) {
    errors.testTime = 'Hãy điền thời gian làm bài';
  }

  if (!data.listQuiz || !data.listQuiz.length) {
    errors.listQuiz = { _error: 'Bài kiểm tra phải có ít nhất một câu hỏi' };
  } else {
    //validate array question
    const quizArrayErrors = [];
    data.listQuiz.forEach((quiz, quizIndex) => {
      const quizErrors = {};
      if(!quiz || !quiz.question) {
        quizErrors.question = 'Yêu cầu';
      }
      if(!quiz || !quiz.correctAnswer) {
        quizErrors.correctAnswer = 'Yêu cầu';
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
      errors.listQuiz = quizArrayErrors;
    }
    //end array question
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
