import React from 'react';
import DefaultLayout from './containers/DefaultLayout';


const Dashboard = React.lazy(() => import('./views/Dashboard'));
const EditProfile = React.lazy(() => import('./views/EditProfile/EditProfile'));
const AddCourse = React.lazy(() => import('./views/Courses/AddCourse'));
const CourseList = React.lazy(() => import('./views/Courses/CourseList'));
const CourseDetail = React.lazy(() => import('./views/Courses/CourseDetail'));
const QuizAdd = React.lazy(() => import('./views/Quiz/AddQuiz'));
const QuizList = React.lazy(() => import('./views/Quiz/QuizList'));
const QuizExercise = React.lazy(() => import('./views/Quiz/QuizExcercise'));
const QuizTest = React.lazy(() => import('./views/Quiz/QuizTest'));
const QuizTestResult = React.lazy(() => import('./views/Quiz/QuizTestResult'));
const CheckAttendance = React.lazy(() => import('./views/Attendance/CheckAttendance'));
const ListAttendance = React.lazy(() => import('./views/Attendance/ListAttendance'));
const AddSchedule = React.lazy(() => import('./views/Schedule/AddSchedule'));
const Schedule = React.lazy(() => import('./views/Schedule/Schedule'));
const StudentInfo = React.lazy(() => import('./views/StudentInfo/StudentInfo'));
const AllCourses = React.lazy(() => import('./views/Courses/AllCourses'));
const CourseInfo = React.lazy(() => import('./views/Courses/CourseInfo'));
const ManageCourses = React.lazy(() => import('./views/Courses/ManageCourses'));
const ApproveStudent = React.lazy(() => import('./views/Courses/ApproveStudent'));
const ApproveTeacher = React.lazy(() => import('./views/Courses/ApproveTeacher'));
const EditCourse = React.lazy(() => import('./views/Courses/EditCourse'));
const PointList = React.lazy(() => import('./views/PointList/PointList'));
const ScoreExercise = React.lazy(() => import('./views/ScoreExercise/ScoreExercise'));
const InLesson = React.lazy(() => import('./views/Lesson/InLesson'));
const Lesson = React.lazy(() => import('./views/Lesson/Lesson'));
const QuizLesson = React.lazy(() => import('./views/Lesson/Quiz/QuizLesson'));
const QuizDetail= React.lazy(() => import('./views/Quiz/QuizDetail'));
const LessonList= React.lazy(() => import('./views/LessonList/LessonList'));
const EditLesson= React.lazy(() => import('./views/LessonList/EditLesson'));
const MyInfo = React.lazy(() => import('./views/MyInfo/MyInfo'));
const AddQuizCSV = React.lazy(() => import('./views/Quiz/AddQuizCSV'));
const CreateAccount = React.lazy(() => import('./views/CreateAccount/CreateAccount'));
const ViewCourseList = React.lazy(() => import('./views/Courses/ViewCourseList'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Trang chủ', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/edit-profile', exact: true, name: 'Thay đổi thông tin', component: EditProfile },
  { path: '/add-course', exact: true, name: 'Thêm khóa học', component: AddCourse },
  { path: '/courses', exact: true, name: 'Khóa học của tôi', component: CourseList },
  { path: '/view-courses', exact: true, name: 'Danh sách khóa học', component: ViewCourseList },
  { path: '/view-courses/:id', exact: true, name: 'Nội dung khóa học', component: CourseDetail },
  { path: '/courses/:id', exact: true, name: 'Nội dung khóa học', component: CourseDetail },
  { path: '/quiz', exact: true, name: 'Danh sách bài trắc nghiệm', component: QuizList },
  { path: '/quiz/test/:id', exact: true, name: 'Nội dung kiểm tra trắc nghiệm', component: QuizTest },
  { path: '/quiz/test-result/:id', exact: true, name: 'Kết quả kiểm tra trắc nghiệm', component: QuizTestResult },
  { path: '/quiz/excercise/:id', exact: true, name: 'Nội dung bài bài tập trắc nghiệm', component: QuizExercise },
  { path: '/quiz/add', exact: true, name: 'Thêm bài kiểm tra trắc nghiệm', component: QuizAdd },
  { path: '/check-attendance', exact: true, name: 'Điểm danh', component: CheckAttendance },
  { path: '/list-attendance', exact: true, name: 'Lịch sử điểm danh', component: ListAttendance },
  { path: '/add-schedule', exact: true, name: 'Chỉnh sửa thời khóa biểu', component: AddSchedule },
  { path: '/schedule', exact: true, name: 'Xem thời khóa biểu', component: Schedule },
  { path: '/student-info/:id', exact: true, name: 'Thông tin học viên', component: StudentInfo },
  { path: '/course-info', exact: true, name: 'Danh sách tất cả khóa học', component: AllCourses },
  { path: '/course-info/:id', exact: true, name: 'Thông tin khóa học', component: CourseInfo },
  { path: '/manage-courses', exact: true, name: 'Quản lý khóa học', component: ManageCourses },
  { path: '/score/:courseId/:exerciseId', exact: true, name: 'Chấm điểm', component: ScoreExercise },
  { path: '/manage-courses/approve/student/:courseId', exact: true, name: 'Quản lý học viên', component: ApproveStudent },
  { path: '/manage-courses/edit-course/:courseId', exact: true, name: 'Chỉnh sửa khóa học', component: EditCourse },
  { path: '/manage-courses/approve/teacher/:courseId', exact: true, name: 'Quản lý giáo viên', component: ApproveTeacher },
  { path: '/point-list', exact: true, name: 'Quản lý cột điểm', component: PointList },
  { path: '/courses/:id/add-in-lesson/:lessonId', exact: true, name: 'Nội dung bài học', component: InLesson },
  { path: '/courses/:id/lesson/:lessonId', exact: true, name: 'Nội dung bài học', component: Lesson },
  { path: '/view-courses/:id/lesson/:lessonId', exact: true, name: 'Nội dung bài học', component: Lesson },
  { path: '/courses/:id/lesson/:lessonId/:quizId', exact: true, name: 'Bài trắc nghiệm', component: QuizLesson },
  { path: '/quiz/quiz-detail/:id', exact: true, name: 'Nội dung bài kiểm tra trắc nghiệm', component: QuizDetail },
  { path: '/lesson-list', exact: true, name: 'Danh sách bài học', component: LessonList },
  { path: '/lesson-list/edit-lesson/:listId/:lessonId', exact: true, name: 'Chỉnh sửa nội dung bài học', component: EditLesson },
  { path: '/my-info', exact: true, name: 'Thông tin cá nhân', component: MyInfo },
  { path: '/quiz/add/csv', exact: true, name: 'Thêm bằng tập tin csv', component: AddQuizCSV },
  { path: '/create-account', exact: true, name: 'Tạo tài khoản', component: CreateAccount },

];

export default routes;

