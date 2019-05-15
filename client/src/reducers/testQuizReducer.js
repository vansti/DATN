import {
  GET_CURRENT_TESTQUIZ,
  GET_QUIZ_LIST,
  QUIZ_LOADING,
  GET_QUIZ_SUBMISSTION,
  GET_QUIZ_DETAIL
} from '../actions/types';

const initialState = {
  quizDetail: {},
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
        message: action.payload.message,
        loading: false
      };
    case GET_QUIZ_SUBMISSTION:
      return {
        ...state,
        quizSubmission: action.payload,
      };
    case GET_QUIZ_LIST:
      return {
        ...state,
        quizzes: action.payload,
        loading: false
      };
    case GET_QUIZ_DETAIL:
      return{
        ...state,
        quizDetail: action.payload,
        loading: false
      }
    case QUIZ_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
