import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import successReducer from './successReducer';
import courseReducer from './courseReducer';
import usersReducer from './usersReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  success: successReducer,
  courses: courseReducer,
  users: usersReducer
});
