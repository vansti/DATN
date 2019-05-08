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
      name: 'Kiểm tra trắc nghiệm',
      icon: 'fa fa-question-circle',
      children: [
        {
          name: 'Danh sách',
          url: '/quiz',
          icon: 'icon-list',
        },
        {
          name: 'Thêm bài kiểm tra',
          url: '/quiz/add',
          icon: 'icon-plus',
        },
      ]
    },
    {
      name: 'Quản lý cột điểm',
      url: '/point-list',
      icon: 'fa fa-bars',
    },
    // {
    //   name: 'Example',
    //   icon: 'fa fa-question-circle',
    //   children: [
    //     {
    //       name: 'Demo react form',
    //       url: '/example/react-form',
    //       icon: 'icon-plus',
    //     },
    //   ]
    // },
  ],
};
