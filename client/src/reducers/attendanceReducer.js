import {
  GET_ATTENDANCE, CLEAR_ATTENDANCE
} from '../actions/types';

const initialState = {
  attendance: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ATTENDANCE:
      return {
        attendance: action.payload,
      };
    case CLEAR_ATTENDANCE:
      return {};
    default:
      return state;
  }
}
