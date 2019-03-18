import axios from 'axios';

import { GET_SUCCESS, GET_ERRORS} from './types';

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

