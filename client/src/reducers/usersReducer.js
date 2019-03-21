import {
  GET_USERS, CLEAR_USER
} from '../actions/types';

const initialState = {
  users: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload
      };
    case CLEAR_USER:
      return {
        users: null
      };
    default:
      return state;
  }
}
