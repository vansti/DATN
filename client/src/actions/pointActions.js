import axios from 'axios';

import { 
  POINT_LOADING,
  GET_POINT_COLUMNS,
  GET_SUCCESS,
  GET_ERRORS
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

// gán pointcolumn loại exercise
export const setPointColumnsExercise = ( courseId, pointColumnsId, exerciseId ) => dispatch => {
  axios
    .get(`/api/courses/set-point-colums-exercise/${courseId}/${pointColumnsId}/${exerciseId}`)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};