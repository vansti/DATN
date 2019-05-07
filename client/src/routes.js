import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const EditProfile = React.lazy(() => import('./views/EditProfile/EditProfile'));
const AddCourse = React.lazy(() => import('./views/Courses/AddCourse'));
const CourseList = React.lazy(() => import('./views/Courses/CourseList'));
const CourseDetail = React.lazy(() => import('./views/Courses/CourseDetail'));
const QuizAdd = React.lazy(() => import('./views/Quiz/AddQuiz'));
const QuizList = React.lazy(() => import('./views/Quiz/QuizList'));
const QuizExercise = React.lazy(() => import('./views/Quiz/QuizExcercise'));
const QuizTest = React.lazy(() => import('./views/Quiz/QuizTest'));
const ExampleReactForm = React.lazy(() => import('./views/Example/ReactForm'));
const CheckAttendance = React.lazy(() => import('./views/Attendance/CheckAttendance'));
const ListAttendance = React.lazy(() => import('./views/Attendance/ListAttendance'));
const AddSchedule = React.lazy(() => import('./views/Schedule/AddSchedule'));
const Schedule = React.lazy(() => import('./views/Schedule/Schedule'));
const StudentInfo = React.lazy(() => import('./views/StudentInfo/StudentInfo'));
const AllCourses = React.lazy(() => import('./views/Courses/AllCourses'));
const CourseInfo = React.lazy(() => import('./views/Courses/CourseInfo'));
const ManageCourses = React.lazy(() => import('./views/Courses/ManageCourses'));
const ApproveStudent = React.lazy(() => import('./views/Courses/ApproveStudent'));
const EditCourse = React.lazy(() => import('./views/Courses/EditCourse'));
const PointList = React.lazy(() => import('./views/PointList/PointList'));
const ScoreExercise = React.lazy(() => import('./views/ScoreExercise/ScoreExercise'));
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Trang chủ', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/edit-profile', exact: true, name: 'Thay đổi thông tin', component: EditProfile },
  { path: '/add-course', exact: true, name: 'Thêm khóa học', component: AddCourse },
  { path: '/courses', exact: true, name: 'Khóa học của tôi', component: CourseList },
  { path: '/courses/:id', exact: true, name: 'Nội dung khóa học', component: CourseDetail },
  { path: '/quiz', exact: true, name: 'Danh sách bài trắc nghiệm', component: QuizList },
  { path: '/quiz/test/:id', exact: true, name: 'Nội dung kiểm tra trắc nghiệm', component: QuizTest },
  { path: '/quiz/excercise/:id', exact: true, name: 'Nội dung bài bài tập trắc nghiệm', component: QuizExercise },
  { path: '/quiz/add', exact: true, name: 'Thêm bài kiểm tra trắc nghiệm', component: QuizAdd },
  { path: '/example/react-form', exact: true, name: 'Demo react form', component: ExampleReactForm },
  { path: '/check-attendance', exact: true, name: 'Điểm danh', component: CheckAttendance },
  { path: '/list-attendance', exact: true, name: 'Lịch sử điểm danh', component: ListAttendance },
  { path: '/add-schedule', exact: true, name: 'Thêm thời khóa biểu', component: AddSchedule },
  { path: '/schedule', exact: true, name: 'Xem thời khóa biểu', component: Schedule },
  { path: '/student-info/:id', exact: true, name: 'Thông tin học viên', component: StudentInfo },
  { path: '/course-info', exact: true, name: 'Danh sách tất cả khóa học', component: AllCourses },
  { path: '/course-info/:id', exact: true, name: 'Thông tin khóa học', component: CourseInfo },
  { path: '/manage-courses', exact: true, name: 'Quản lý khóa học', component: ManageCourses },
  { path: '/score/:courseId/:exerciseId', exact: true, name: 'Chấm điểm', component: ScoreExercise },
  { path: '/manage-courses/approve/:courseId', exact: true, name: 'Phê duyệt', component: ApproveStudent },
  { path: '/manage-courses/edit-course/:courseId', exact: true, name: 'Chỉnh sửa khóa học', component: EditCourse },
  { path: '/point-list', exact: true, name: 'Quản lý cột điểm', component: PointList },

];

export default routes;

