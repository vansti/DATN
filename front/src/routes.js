import DefaultLayout from './containers/DefaultLayout';
import Home from './Views/Home';

const routes = [
  { path: '/', exact: true, name: 'Trang chủ', component: DefaultLayout },
  { path: '/home', exact: true, name: 'Trang chủ', component: Home },
  { path: '/course', exact: true, name: 'Khóa học', component: Home },
  { path: '/blog', exact: true, name: 'Blog', component: Home },
  { path: '/page', exact: true, name: 'Trang', component: Home },
  { path: '/contact', exact: true, name: 'Liên lạc', component: Home },
]

export default routes;