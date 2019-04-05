import {
  GET_CURRENT_TESTQUIZ
} from '../actions/types';

const initialState = {
  listTestQuiz: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_TESTQUIZ:
      return {
        ...state,
        listTestQuiz: action.payload.data,
        message: action.payload.message
      };
    default:
      return state;
  }
}
