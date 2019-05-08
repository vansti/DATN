const quizService = {
  //params: array: listQuiz, array submistionAnswer
  //return: float point
  calPointQuiz: (listQuiz, submistionAnswer) => {
    let numberQuizCorrect = 0;
    listQuiz.forEach((element, index) => {
        if(element.correctAnswer == submistionAnswer[index]) {
            numberQuizCorrect++;
        }
    });
    return numberQuizCorrect / listQuiz.length * 10;
  },
  checkvalueKeyExist: (arr, key, value) => {
    let result = -1;
    arr.forEach((element, index) => {
        if(JSON.stringify(element[key]) === JSON.stringify(value)) {
            result = index;
        }
    });
    return result;
  }
}

module.exports = quizService;