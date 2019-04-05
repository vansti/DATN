import {
  GET_ATTENDANCE, CLEAR_ATTENDANCE, GET_STUDENT_ABSENT_LIST
} from '../actions/types';

const initialState = {
  attendance: null,
  student_absent_list: null 
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
      };
    case CLEAR_ATTENDANCE:
      return {
        ...state,
        attendance: null
      };
    case GET_STUDENT_ABSENT_LIST:
      return {
        ...state,
        student_absent_list: action.payload,
      };
    default:
      return state;
  }
}
