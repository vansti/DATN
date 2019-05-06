import axios from 'axios';

import { 
  GET_SUCCESS, 
  GET_ERRORS, 
  GET_EXERCISE_LIST, 
  GET_COMMENT, 
  CLEAR_SUCCESS, 
  GET_SUBMISSION, 
  DEL_SUBMISSION, 
  CLEAR_ERRORS,
  EXERCISE_LOADING, 
  COMMENT_LOADING
} from './types';

// Add Exercise
export const addExercise = (exerciseData) => dispatch => {
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

export const setExercisesLoading = () => {
  return {
    type: EXERCISE_LOADING
  };
};

export const getExerciseList = (courseId) => dispatch => {
  dispatch(setExercisesLoading());
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
export const addComment = (commentData, exerciseId) => dispatch => {
  axios
    .post(`/api/exercises/comment/${exerciseId}`, commentData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
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
  dispatch(setCommentsLoading());
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

export const setCommentsLoading = () => {
  return {
    type: COMMENT_LOADING
  };
};

// Add Submission
export const addSubmission = (data, exerciseId) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  let fd = new FormData();
  fd.append('file',data.file)
  axios({
    method: "post",
    url: `/api/exercises/${exerciseId}/submit`,
    data: fd,
    headers:{'Content-Type': 'multipart/form-data'},
  }).then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Bài nộp của bạn đã được gửi'}
      })
      //gọi cái này để cập nhật tên file vừa upload
      dispatch(getSubmission(exerciseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getSubmission = (exerciseId) => dispatch => {
  axios
    .get(`/api/exercises/${exerciseId}/get-submission`)
    .then(res =>{
      dispatch({
        type: GET_SUBMISSION,
        payload: res.data
      })
    }
    )
    .catch(err =>{

    });
};

export const download = (exerciseId, submission) => dispatch => {
  axios
    .get(`/api/exercises/${exerciseId}/download`,{
      responseType: 'blob'
    })
    .then(res =>{
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', submission);
      document.body.appendChild(link);
      link.click();
    })
    .catch(err =>{

    }
    );
};

export const deleteSubmission = (exerciseId, submission) => dispatch => {
  axios
    .delete(`/api/exercises/${exerciseId}/delete`)
    .then(res =>
      dispatch({
        type: DEL_SUBMISSION
      })
    )
    .catch(err =>{
    });
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};