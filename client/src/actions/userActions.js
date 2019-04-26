import axios from 'axios';

import { GET_USERS, CLEAR_USER, GET_STUDENT, GET_APPROVE_LIST, GET_SUCCESS, GET_ERRORS, CLEAR_SUCCESS, USERS_LOADING } from './types';

// Get a list of users
export const getUsers = (courseid) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get('/api/users/get-users-in-course/' + courseid)
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: {}
      })
    );
};

export const setUsersLoading = () => {
  return {
    type: USERS_LOADING
  };
};

// Clear a list of users
export const clearUsers = () => {
  return {
    type: CLEAR_USER
  };
};

// Get student info
export const getStudent = (studentId) => dispatch => {
  axios
    .get('/api/users/' + studentId)
    .then(res =>
      dispatch({
        type: GET_STUDENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STUDENT,
        payload: {}
      })
    );
};

// lấy danh sách học viên ghi danh và danh sách học viên dc duyệt của 1 khóa học
export const getApproveList = (courseId) => dispatch => {
  axios
    .get('/api/users/approve-list/' + courseId)
    .then(res =>
      dispatch({
        type: GET_APPROVE_LIST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_APPROVE_LIST,
        payload: {}
      })
    );
};

// Approve Student to Course
export const approveStudent = (courseId, studentId) => dispatch => {
  axios
    .post(`/api/courses/approve/${courseId}/${studentId}`)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      dispatch(getApproveList(courseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};
