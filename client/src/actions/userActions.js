import axios from 'axios';

import { GET_USERS } from './types';

// Get a list of users
export const getUsers = (courseid) => dispatch => {
  axios
    .post('/api/users/get-list-users',courseid)
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

