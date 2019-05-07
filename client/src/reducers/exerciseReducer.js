import {
  GET_EXERCISE_LIST,GET_EXER, 
  // EXERCISE_LOADING
} from '../actions/types';

const initialState = {
  exercises: null,
  exercise: null,
  // loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EXERCISE_LIST:
      return {
        ...state,
        exercises: action.payload,
        loading: false
      };
    // case EXERCISE_LOADING:
    //   return {
    //     ...state,
    //     loading: true
    //   };
    case GET_EXER:
      return {
        ...state,
        exercise: action.payload,
      };
    default:
      return state;
  }
}
