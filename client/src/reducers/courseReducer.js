import {
  GET_CURRENT_COURSES, 
  GET_STUDENT_COURSES, 
  GET_ALL_COURSES, 
  GET_COURSE_INFO,
  GET_ADMIN_COURSES
} from '../actions/types';

const initialState = {
  courseinfo: {
    course: {},
    course_detail: {}
  },
  allcourses: [],
  currentcourses: null,
  studentcourses: null,
  admincourses: null
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
    case GET_ALL_COURSES:
      return {
        ...state,
        allcourses: action.payload,
      };
    case GET_COURSE_INFO:
      return {
        ...state,
        courseinfo: action.payload,
      };
    case GET_ADMIN_COURSES:
      return {
        ...state,
        admincourses: action.payload,
      };
    default:
      return state;
  }
}
