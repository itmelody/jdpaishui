import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'workbench',
        name: 'Workbench',
        meta: { title: '工作台' },
        component: () => import('@/views/workbench/index.vue')
      },
      {
        path: 'drainage-network',
        name: 'DrainageNetwork',
        meta: { title: '排水管网监管' },
        component: () => import('@/views/drainage-network/index.vue')
      },
      {
        path: 'drainage-user',
        name: 'DrainageUser',
        meta: { title: '排水户监管' },
        component: () => import('@/views/drainage-user/index.vue')
      },
      {
        path: 'inspection-maintenance',
        name: 'InspectionMaintenance',
        meta: { title: '巡检养护' },
        component: () => import('@/views/inspection-maintenance/index.vue')
      },
      {
        path: 'maintenance-task',
        name: 'MaintenanceTask',
        meta: { title: '养护任务' },
        component: () => import('@/views/inspection-maintenance/maintenance-task.vue')
      },
      {
        path: 'warning-workorder',
        name: 'WarningWorkorder',
        meta: { title: '预警工单' },
        component: () => import('@/views/warning-workorder/index.vue')
      },
      {
        path: 'realtime-monitoring',
        name: 'RealtimeMonitoring',
        meta: { title: '实时监测' },
        component: () => import('@/views/realtime-monitoring/index.vue')
      },
      {
        path: 'engineering-management',
        name: 'EngineeringManagement',
        meta: { title: '工程管理' },
        component: () => import('@/views/engineering-management/index.vue')
      },
      {
        path: 'drainage-map',
        name: 'DrainageMap',
        meta: { title: '排水一张图' },
        component: () => import('@/views/drainage-map/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/jdpaishui/'),
  routes
})

export default router
