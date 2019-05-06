import axios from 'axios';
import { SubmissionError } from 'redux-form';
// import moment from 'moment';
// import { format_date } from '../constants/format';
import isEmpty from '../validation/is-empty';
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
  return axios
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
      throw new SubmissionError(err.response.data);
    });
};

export const submitTestQuiz = (submisstionQuiz, history) => dispatch => {
  return axios
    .post('/api/test/sub-quiz', submisstionQuiz)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: {
          data: res.data
        }
      })
    })
    .catch(err =>{
      throw new SubmissionError(err.response.data);
    });
};

// Get list test quizzed
export const getListQuiz = () => dispatch => {
  axios
    .get('/api/test/quiz')
    .then(res => {
      let data = formatDataListQuizTest(res.data);
      dispatch({
        type: GET_CURRENT_TESTQUIZ,
        payload: {
          data: data,
          message: 'Đã nhận data thành công'
        }
      })
    }).catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })}
    );
}
// Get detail test quiz by id
export const getDetailQuiz = (testQuizId) => dispatch => {
  axios
    .get(`/api/test/quiz/${testQuizId}`)
    .then(res => {
      let data = formatDataListQuizTest(res.data);
      dispatch({
        type: GET_CURRENT_TESTQUIZ,
        payload: {
          data: data,
          message: 'Đã nhận data thành công'
        }
      })
    }).catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })}
    );
}
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

export const formatDataListQuizTest = data => {
  // let formatDate = format_date.default;
  if(isEmpty(data)){
    return data;
  }
  
  // data.deadline = moment(data.deadline, formatDate);
  return data;
}
