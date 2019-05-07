import {
  GET_CURRENT_TESTQUIZ,
  GET_QUIZ_LIST,
  QUIZ_LOADING
} from '../actions/types';

const initialState = {
  listTestQuiz: null,
  quizzes: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_TESTQUIZ:
      return {
        ...state,
        listTestQuiz: action.payload.data,
        message: action.payload.message
      };
    case GET_QUIZ_LIST:
      return {
        ...state,
        quizzes: action.payload,
        loading: false
      };
    case QUIZ_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
