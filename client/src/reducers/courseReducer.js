import {
  GET_CURRENT_COURSES, GET_STUDENT_COURSES
} from '../actions/types';

const initialState = {
  currentcourses: null,
  studentcourses: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_COURSES:
      return {
        ...state,
        currentcourses: action.payload,
      };
    case GET_STUDENT_COURSES:
      return {
        ...state,
        studentcourses: action.payload,
      };
    default:
      return state;
  }
}
