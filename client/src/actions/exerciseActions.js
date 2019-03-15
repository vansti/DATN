import axios from 'axios';

import { GET_SUCCESS, GET_ERRORS, GET_EXERCISE_LIST, GET_COMMENT, CLEAR_SUCCESS} from './types';

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
      dispatch(getExerciseList(exerciseData.courseId));
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
    .get(`/api/exercises/${courseId}`)
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

// Add Comment
export const addComment = (commentData,exerciseId) => dispatch => {
  dispatch(clearSuccess());
  axios
    .post(`/api/exercises/comment/${exerciseId}`, commentData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Bình luận của bạn đã được gửi'}
      })
      dispatch(getComments(exerciseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get comment
export const getComments = (exerciseId) => dispatch => {
  dispatch(clearSuccess());
  axios
    .get(`/api/exercises/get-comments/${exerciseId}`)
    .then(res =>
      dispatch({
        type: GET_COMMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COMMENT,
        payload: {}
      })
    );
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};