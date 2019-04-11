import axios from 'axios';

import { GET_ERRORS, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS,
         GET_CURRENT_COURSES, GET_STUDENT_COURSES , GET_ALL_COURSES,
         GET_COURSE_INFO, GET_ADMIN_COURSES } from './types';

// Add Course
export const addCourse = (courseData, fileData) => dispatch => {
  axios
    .post('/api/courses/add-course', courseData)
    .then(res =>{

      if(fileData !== null)
      {
        let fd = new FormData();
        fd.append('image', fileData, fileData.name)
        axios.post('/api/courses/add-course-avatar/' + res.data.course, fd)
        .then(data  => {
          dispatch({
            type: GET_SUCCESS,
            payload: {data: 'Thêm khóa học thành công'}
          })
        });
      }
      else
      {
        dispatch({
          type: GET_SUCCESS,
          payload: {data: 'Thêm khóa học thành công'}
        })
      }

    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Enroll Course
export const enrollCourse = (courseId) => dispatch => {
  axios
    .post('/api/courses/enroll-course/' + courseId)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Đã ghi danh thành công'}
      })
      dispatch(getCourseInfo(courseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Unenroll Course
export const unenrollCourse = (courseId) => dispatch => {
  axios
    .post('/api/courses/unenroll-course/' + courseId)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Đã hủy ghi danh thành công'}
      })
      dispatch(getCourseInfo(courseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get curent user courses
export const getCurentCourse = () => dispatch => {
  axios
    .get('/api/courses/current')
    .then(res =>
      dispatch({
        type: GET_CURRENT_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CURRENT_COURSES,
        payload: {}
      })
    );
};

// lấy hết khóa học chưa hết hạn ghi danh
export const getAllCourse = () => dispatch => {
  axios
    .get('/api/courses/all-course')
    .then(res =>
      dispatch({
        type: GET_ALL_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ALL_COURSES,
        payload: {}
      })
    );
};

// lấy thông tin chi tiết của 1 khóa học
export const getCourseInfo = (courseId) => dispatch => {
  axios
    .get(`/api/courses/course-info/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_COURSE_INFO,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COURSE_INFO,
        payload: {}
      })
    );
};

// lấy tất cả các khóa học
export const getAdminCourses = () => dispatch => {
  axios
    .get(`/api/courses/admin-courses`)
    .then(res =>
      dispatch({
        type: GET_ADMIN_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ADMIN_COURSES,
        payload: {}
      })
    );
};

// get student courses by student id
export const getStudentCourse = (studentId) => dispatch => {
  axios
    .get('/api/courses/' + studentId)
    .then(res =>
      dispatch({
        type: GET_STUDENT_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STUDENT_COURSES,
        payload: {}
      })
    );
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};
