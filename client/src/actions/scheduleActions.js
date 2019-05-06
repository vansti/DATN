import axios from 'axios';

import { GET_SUCCESS, GET_ERRORS, GET_SCHEDULE} from './types';

// Add Schedule
export const addSchedule= (newSchedule) => dispatch => {
  axios
    .post('/api/schedule/add-schedule', newSchedule)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Lưu thành công'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get Schedule
export const getSchedule= (courseId) => dispatch => {
  axios
    .get('/api/schedule/get-schedule/'+ courseId)
    .then(res =>{
      dispatch({
        type: GET_SCHEDULE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_SCHEDULE,
        payload: {}
      })
    );
};