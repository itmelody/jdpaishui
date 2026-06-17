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
    path: '/detection-management',
    name: 'DetectionManagement',
    meta: { title: '检测管理' },
    component: () => import('@/views/detection-management/index.vue')
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
        redirect: '/drainage-network/manhole-info',
        component: () => import('@/views/drainage-network/index.vue'),
        children: [
          {
            path: 'manhole-info',
            name: 'ManholeInfo',
            meta: { title: '井盖基础信息' },
            component: () => import('@/views/drainage-network/manhole-info.vue')
          },
          {
            path: 'pipe-section-info',
            name: 'PipeSectionInfo',
            meta: { title: '管段基础信息' },
            component: () => import('@/views/drainage-network/pipe-section-info.vue')
          },
          {
            path: 'network-map',
            name: 'NetworkMap',
            meta: { title: '排水管网地图' },
            component: () => import('@/views/drainage-network/index.vue')
          },
          {
            path: 'detection-result',
            name: 'DetectionResult',
            meta: { title: '检测结果信息' },
            component: () => import('@/views/drainage-network/detection-result.vue')
          },
          {
            path: 'hidden-danger',
            name: 'HiddenDanger',
            meta: { title: '隐患数据信息' },
            component: () => import('@/views/drainage-network/hidden-danger.vue')
          },
          {
            path: 'unit-basic',
            name: 'UnitBasic',
            meta: { title: '检测单位基础信息' },
            component: () => import('@/views/drainage-network/unit-basic.vue')
          },
          {
            path: 'unit-personnel',
            name: 'UnitPersonnel',
            meta: { title: '检测单位人员信息' },
            component: () => import('@/views/drainage-network/unit-personnel.vue')
          },
          {
            path: 'data-stats',
            name: 'DataStats',
            meta: { title: '排水管网数据统计' },
            component: () => import('@/views/drainage-network/data-stats.vue')
          },
          {
            path: 'progress-stats-detail',
            name: 'ProgressStatsDetail',
            meta: { title: '排查进度情况统计' },
            component: () => import('@/views/drainage-network/progress-stats-detail.vue')
          },
          {
            path: 'rectification-analysis',
            name: 'RectificationAnalysis',
            meta: { title: '隐患整治结果分析' },
            component: () => import('@/views/drainage-network/rectification-analysis.vue')
          }
        ]
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
        path: 'warning-workorder/rule-config',
        name: 'WarningRuleConfig',
        meta: { title: '预警规则配置' },
        component: () => import('@/views/warning-workorder/rule-config.vue')
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
