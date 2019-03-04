import axios from 'axios';

import { GET_ERRORS, GET_PROFILE } from './types';

// Edit Profle
export const editProfile = (userData, history) => dispatch => {
  axios
    .post('/api/users/edit-profile', userData)
    .then(res =>{
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
      history.push('/dashboard')
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
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
