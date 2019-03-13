import {
  GET_EXERCISE_LIST
} from '../actions/types';

const initialState = {
  exercises: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EXERCISE_LIST:
      return {
        ...state,
        exercises: action.payload,
      };
    default:
      return state;
  }
}
