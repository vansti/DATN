import axios from 'axios';

import { GET_ERRORS, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS,GET_CURRENT_COURSES } from './types';

// Add quiz
export const addQuiz = (quizData) => dispatch => {
    dispatch(clearErrors());
    dispatch(clearSuccess());
}

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const getSuccess = () => dispatch => {
  dispatch({
    type: GET_SUCCESS,
    payload: {data: 'Thay đổi thành công'}
  })
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};