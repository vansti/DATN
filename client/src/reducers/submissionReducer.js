import {
    GET_SUBMISSION
  } from '../actions/types';
  
  const initialState = {
    submission: {}
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_SUBMISSION:
        return {
          submission: action.payload,
        };
      default:
        return state;
    }
  }
  