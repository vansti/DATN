import {
    GET_SUBMISSION, DEL_SUBMISSION,GET_SUBMISSION2
  } from '../actions/types';
  
  const initialState = {
    submission: ''
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_SUBMISSION:{
        //console.log(GET_SUBMISSION)
        return {
          submission: action.payload,
        };
        
      }
      
        case GET_SUBMISSION2:{
          //console.log(GET_SUBMISSION2)
        return {
          submission: action.payload,
        };
      }
      // xóa thì set lại là rỗng
      case DEL_SUBMISSION:
        return {
          submission: ''
        };
      default:
        return state;
    }
  }
  