import axios from 'axios';

import {
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_SUCCESS,
  CLEAR_SUCCESS,
  GET_CURRENT_TESTQUIZ
} from './types';

export const addTestQuiz = (testQuizData, history) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .post('/api/test/add-quiz', testQuizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: {
          data: 'Thêm bài kiểm tra thành công'
        }
      })
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })}
    );
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};
