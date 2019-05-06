import {
  GET_EXERCISE_LIST, 
  EXERCISE_LOADING
} from '../actions/types';

const initialState = {
  exercises: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EXERCISE_LIST:
      return {
        ...state,
        exercises: action.payload,
        loading: false
      };
    case EXERCISE_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
