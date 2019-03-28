import {
  GET_EXERCISE_LIST, GET_EXER
} from '../actions/types';

const initialState = {
  exercises: null,
  exercise: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EXERCISE_LIST:
      return {
        ...state,
        exercises: action.payload,
      };
    case GET_EXER:
      return {
        ...state,
        exercise: action.payload,
      };
    default:
      return state;
  }
}
