import {
  GET_CURRENT_COURSES
} from '../actions/types';

const initialState = {
  currentcourses: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_COURSES:
      return {
        ...state,
        currentcourses: action.payload,
      };
    default:
      return state;
  }
}
