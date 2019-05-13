import axios from 'axios';

import { GET_SUCCESS, GET_ERRORS, GET_SCHEDULE , SCHEDULE_LOADING, GET_EVENT_SCHEDULE, CLEAR_SUCCESS } from './types';

// Add Schedule
export const addSchedule= (newSchedule) => dispatch => {
  axios
    .post('/api/schedule/add-schedule', newSchedule)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Lưu thành công'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get Schedule
export const getSchedule= (courseId) => dispatch => {
  dispatch(setScheduleLoading());
  axios
    .get('/api/schedule/get-schedule/'+ courseId)
    .then(res =>{
      dispatch({
        type: GET_SCHEDULE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_SCHEDULE,
        payload: {}
      })
    );
};

// get Event Schedule
export const getEventSchedule = (courseId, eventId) => dispatch => {
  dispatch(setScheduleLoading());
  axios
    .get(`/api/schedule/get-event-schedule/${courseId}/${eventId}`)
    .then(res =>{
      dispatch({
        type: GET_EVENT_SCHEDULE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_EVENT_SCHEDULE,
        payload: {}
      })
    );
};

// edit Event Schedule
export const editEvent = (courseId, eventId, eventData) => dispatch => {
  axios
    .post(`/api/schedule/edit-event/${courseId}/${eventId}`, eventData)
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

export const addQuizEvent = (courseId, eventId, quizId) => dispatch => {
  axios
    .post(`/api/schedule/add-quiz-event/${courseId}/${eventId}/${quizId}`)
    .then(res =>
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};

export const setScheduleLoading = () => {
  return {
    type: SCHEDULE_LOADING
  };
};