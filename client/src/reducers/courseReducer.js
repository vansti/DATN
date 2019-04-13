import {
  GET_CURRENT_COURSES, 
  GET_STUDENT_COURSES, 
  GET_ALL_COURSES, 
  GET_COURSE_INFO,
  GET_MANAGE_COURSES
} from '../actions/types';

const initialState = {
  courseinfo: {
    course: {},
    course_detail: {}
  },
  allcourses: [],
  currentcourses: null,
  studentcourses: null,
  managecourses: null
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
    case GET_MANAGE_COURSES:
      return {
        ...state,
        managecourses: action.payload,
      };
    default:
      return state;
  }
}
