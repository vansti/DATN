import axios from 'axios';

import { GET_ERRORS, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS,GET_CURRENT_COURSES } from './types';

// Add Course
export const addCourse = (courseData, history) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .post('/api/courses/add-course', courseData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Thêm khóa học thành công'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Enroll Course
export const enrollCourse = (courseData) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .post('/api/courses/enroll-course', courseData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Đã tham gia vào khoa học'}
      })
      dispatch(getCurentCourse())
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get curent user courses
export const getCurentCourse = () => dispatch => {
  axios
    .get('/api/courses/current')
    .then(res =>
      dispatch({
        type: GET_CURRENT_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CURRENT_COURSES,
        payload: {}
      })
    );
};

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
