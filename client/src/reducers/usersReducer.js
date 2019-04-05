import {
  GET_USERS, CLEAR_USER, GET_STUDENT
} from '../actions/types';

const initialState = {
  student: null,
  users: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload
      };
    case GET_STUDENT:
      return {
        ...state,
        student: action.payload
      };
    case CLEAR_USER:
      return {
        users: null
      };
    default:
      return state;
  }
}
