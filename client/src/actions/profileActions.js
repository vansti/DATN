import axios from 'axios';

import { GET_ERRORS, GET_PROFILE, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS} from './types';

// Edit Profle
export const editProfile = (userData, history) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .post('/api/users/edit-profile', userData)
    .then(res =>{
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
      dispatch(getSuccess());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};

// Get Profle
export const getCurrentProfile = () => dispatch => {
  axios
    .get('/api/users/current')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Change Password
export const changePassword = (passwordData, history) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .post('/api/users/change-password', passwordData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Thay đổi password thành công'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
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
