import axios from 'axios';

import { GET_SUCCESS, GET_ERRORS, GET_EXERCISE_LIST} from './types';

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
      var arr = {};
      arr.courseId = exerciseData.courseId
      dispatch(getExerciseList(arr));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getExerciseList = (courseId) => dispatch => {
  axios
    .post('/api/exercises/get-exercise-list', courseId)
    .then(res =>
      dispatch({
        type: GET_EXERCISE_LIST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EXERCISE_LIST,
        payload: {}
      })
    );
};

