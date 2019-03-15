import axios from 'axios';

import { GET_USERS } from './types';

// Get a list of users
export const getUsers = (courseid) => dispatch => {
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

