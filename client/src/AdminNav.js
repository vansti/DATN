export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-home',
    },
    {
      name: 'Khóa học',
      icon: 'fa fa-book',
      children: [
        {
          name: 'Thêm khóa học',
          url: '/add-course',
          icon: 'fa fa-plus',
        },
        {
          name: 'Khóa học của tôi',
          url: '/courses',
          icon: 'fa fa-book',
        },
        {
          name: 'Quản lý khóa học',
          url: '/manage-courses',
          icon: 'fa fa-wrench',
        }
      ]
    },
    {
      name: 'Điểm danh',
      icon: 'fa fa-clock-o',
      children: [
        {
          name: 'Điểm danh học viên',
          url: '/check-attendance',
          icon: 'fa fa-check',
        },
        {
          name: 'Lịch sử điểm danh',
          url: '/list-attendance',
          icon: 'fa fa-history',
        },
      ]
    },
    {
      name: 'Thời khóa biểu',
      icon: 'fa fa-calendar',
      children: [
        {
          name: 'Thêm thời khóa biểu',
          url: '/add-schedule',
          icon: 'icon-calendar',
        },
        {
          name: 'Xem thời khóa biểu',
          url: '/schedule',
          icon: 'fa fa-calendar',
        },
      ]
    },
    {
      name: 'Quiz',
      icon: 'fa fa-question-circle',
      children: [
        {
          name: 'Thêm quiz',
          url: '/add-quiz',
          icon: 'icon-plus',
        },
        {
          name: 'Danh sách quiz',
          url: '/quiz',
          icon: 'icon-list',
        }
      ]
    }
  ],
};
