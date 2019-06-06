import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));
const Home = React.lazy(() => import('./views/Home'));
const Confirm = React.lazy(() => import('./views/Confirm'));
const EditProfile = React.lazy(() => import('./views/EditProfile'));
const CourseInfo = React.lazy(() => import('./views/CourseInfo'));
const AllCourse = React.lazy(() => import('./views/AllCourse'));
const AboutUs = React.lazy(() => import('./views/AboutUs'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, component: DefaultLayout },
  { path: '/home', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/confirm/:id', component: Confirm },
  { path: '/edit-profile', component: EditProfile },
  { path: '/course-info/:courseId', component: CourseInfo },
  { path: '/all-course', component: AllCourse },
  { path: '/about-us', component: AboutUs }

];

export default routes;

