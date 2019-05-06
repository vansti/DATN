import axios from 'axios';

import { 
  POINT_LOADING,
  GET_POINT_COLUMNS
} from './types';


export const setPointLoading = () => {
  return {
    type: POINT_LOADING
  };
};

// get point columns of a course
export const getPointColumns = (courseId) => dispatch => {
  dispatch(setPointLoading())
  axios
    .get(`/api/courses/get-point-columns/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_POINT_COLUMNS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POINT_COLUMNS,
        payload: {}
      })
    );
};