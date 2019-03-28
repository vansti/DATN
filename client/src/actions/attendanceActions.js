import axios from 'axios';

import { GET_SUCCESS, GET_ERRORS, GET_ATTENDANCE, CLEAR_ATTENDANCE} from './types';

// Add Attendance
export const addAttendance= (newAttendance) => dispatch => {
  axios
    .post('/api/attendance/add-attendance', newAttendance)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Điểm danh thành công'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Attendance
export const editAttendance= (editAttendance) => dispatch => {
  axios
    .post('/api/attendance/edit-attendance', editAttendance)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Điểm danh thành công'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const clearAttendance = () => {
  return {
    type: CLEAR_ATTENDANCE
  };
};

// Get Attendance
export const getAttendance = (courseId) => dispatch => {
  axios
    .get('/api/attendance/get-attendance/' + courseId)
    .then(res =>{
      dispatch({
        type: GET_ATTENDANCE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ATTENDANCE,
        payload: {}
      })
    );
};
