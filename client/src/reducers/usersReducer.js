import {
  GET_USERS, CLEAR_USER, GET_STUDENT, GET_APPROVE_LIST, USERS_LOADING
} from '../actions/types';

const initialState = {
  student: null,
  users: {
    students:[],
    teachers:[]
  },
  approve_list: {
    enrollStudents: [],
    students: []
  },
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,        
        loading: false        
      };
    case USERS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_STUDENT:
      return {
        ...state,
        student: action.payload,
        loading: false        
      };
    case GET_APPROVE_LIST:
      return {
        ...state,
        approve_list: action.payload,
        loading: false        
      };
    case CLEAR_USER:
      return {
        ...state,
        users: {
          students:[],
          teachers:[]
        }
      };
    default:
      return state;
  }
}
