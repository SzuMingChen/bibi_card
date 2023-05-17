import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login/Login.vue'),
    },
    {
      path: '/attendanceSearch',
      name: 'home',
      component: () => import('../layout/Layout.vue'),
      children: [
        {
          path: '/attendanceSearch',
          name: '出勤查詢',
          component: () => import('../views/AttendanceSearch/AttendanceSearch.vue'),
        },
        {
          path: '/studentManage',
          name: '學員管理',
          component: () => import('../views/StudentManage/StudentManage.vue'),
        },
        {
          path: '/leaveManage',
          name: '請假管理',
          component: () => import('../views/LeaveManage/LeaveManage.vue'),
        },
      ],
    },
  ]
})

export default router
