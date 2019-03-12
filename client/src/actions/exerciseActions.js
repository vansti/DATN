import axios from 'axios';

import { GET_SUCCESS, GET_ERRORS} from './types';

// Add Exercise
export const addExercise = (exerciseData) => dispatch => {
  // dispatch(clearErrors());
  // dispatch(clearSuccess());
  axios
    .post('/api/exercises/add-exercise', exerciseData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Thêm bài tập thành công!'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

