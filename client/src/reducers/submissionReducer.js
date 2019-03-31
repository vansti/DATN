import {
    GET_SUBMISSION, DEL_SUBMISSION
  } from '../actions/types';
  
  const initialState = {
    submission: ''
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_SUBMISSION:
        return {
          submission: action.payload,
        };
      // xóa thì set lại là rỗng
      case DEL_SUBMISSION:
        return {
          submission: ''
        };
      default:
        return state;
    }
  }
  