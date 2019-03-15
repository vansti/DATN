import {
  GET_COMMENT
} from '../actions/types';

const initialState = {
  comments: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COMMENT:
      return {
        ...state,
        comments: action.payload,
      };
    default:
      return state;
  }
}
