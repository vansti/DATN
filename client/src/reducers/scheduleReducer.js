import {
  GET_SCHEDULE
} from '../actions/types';

const initialState = {
  schedule: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        schedule: action.payload,
      };
    default:
      return state;
  }
}
