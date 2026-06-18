<template>
  <div class="im-dashboard">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">🏗️</span>
        <span class="logo-text">管网巡查养护</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        class="sidebar-menu"
        theme="dark"
      >
        <a-menu-item key="dashboard">
          <template #icon><DashboardOutlined /></template>
          <span>数据总览</span>
        </a-menu-item>
        <a-sub-menu key="plan">
          <template #icon><ScheduleOutlined /></template>
          <template #title>计划管理</template>
          <a-menu-item key="maintenance-plan">养护计划</a-menu-item>
          <a-menu-item key="inspect-plan">巡查计划</a-menu-item>
          <a-menu-item key="repair-plan">抢修计划</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="task">
          <template #icon><CarryOutOutlined /></template>
          <template #title>任务管理</template>
          <a-menu-item key="maintenance-task">养护任务</a-menu-item>
          <a-menu-item key="inspect-task">巡查任务</a-menu-item>
          <a-menu-item key="repair-task">抢修任务</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="decision">
          <template #icon><BulbOutlined /></template>
          <template #title>科学决策</template>
          <a-menu-item key="maintenance-list">养护清单</a-menu-item>
          <a-menu-item key="smart-maintenance">智慧养护</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="stats">
          <template #icon><BarChartOutlined /></template>
          <template #title>统计分析</template>
          <a-menu-item key="maintenance-stats">养护统计</a-menu-item>
          <a-menu-item key="inspect-stats">巡查统计</a-menu-item>
          <a-menu-item key="repair-stats">抢修统计</a-menu-item>
          <a-menu-item key="personnel-stats">人员统计</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="backend">
          <template #icon><MonitorOutlined /></template>
          <template #title>后台监管</template>
          <a-menu-item key="pipe-analysis">管网养护分析</a-menu-item>
          <a-menu-item key="well-analysis">井室养护分析</a-menu-item>
          <a-menu-item key="abnormal-analysis">异常数据分析</a-menu-item>
          <a-menu-item key="track-analysis">人员轨迹分析</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="onsite">
          <template #icon><EyeOutlined /></template>
          <template #title>现场监督</template>
          <a-menu-item key="assessment">监管考核</a-menu-item>
          <a-menu-item key="log">监管日志</a-menu-item>
          <a-menu-item key="well-work">下井作业</a-menu-item>
          <a-menu-item key="checkin">签到信息</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="special">
          <template #icon><FlagOutlined /></template>
          <template #title>专项行政</template>
          <a-menu-item key="construction">在建工地</a-menu-item>
          <a-menu-item key="outfall-check">排放口检查</a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div class="sidebar-bottom">
        <a-button type="text" class="back-btn" @click="goBack">
          <LogoutOutlined /> 退出系统
        </a-button>
      </div>
    </div>

    <!-- 右侧主内容区 -->
    <div class="main-area">
      <!-- 顶部标题栏 -->
      <div class="top-bar">
        <span class="page-title">{{ pageTitle }}</span>
        <div class="top-right">
          <span class="user-info">管理员</span>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <!-- 数据总览页面 -->
        <template v-if="selectedKeys[0] === 'dashboard' || !selectedKeys[0]">
        <!-- 待办事项 + 任务情况 -->
        <div class="top-section">
          <!-- 待办事项 -->
          <div class="section-block todo-block">
            <div class="section-header">
              <span class="section-title">待办事项</span>
            </div>
            <div class="metric-cards">
              <div class="metric-card" v-for="item in todoItems" :key="item.label">
                <div class="metric-icon" :style="{ background: item.iconBg }">
                  <component :is="item.icon" />
                </div>
                <div class="metric-label">{{ item.label }}</div>
                <div class="metric-value">{{ item.value }}</div>
                <div class="metric-progress">
                  <div class="progress-bar" :style="{ background: item.progressBg }">
                    <div class="progress-fill" :style="{ width: item.progress + '%', background: item.barColor }"></div>
                    <span class="progress-dot" :style="{ left: item.progress + '%', background: item.progress > 5 ? '#fff' : 'transparent', border: item.progress > 5 ? 'none' : '2px solid ' + item.barColor }"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 任务情况 -->
          <div class="section-block task-block">
            <div class="section-header">
              <span class="section-title">任务情况</span>
            </div>
            <div class="metric-cards">
              <div class="metric-card" v-for="item in taskItems" :key="item.label">
                <div class="metric-icon" :style="{ background: item.iconBg }">
                  <component :is="item.icon" />
                </div>
                <div class="metric-label">{{ item.label }}</div>
                <div class="metric-value">{{ item.value }}<span class="metric-unit">{{ item.unit }}</span></div>
                <div class="metric-progress">
                  <div class="progress-bar" :style="{ background: item.progressBg }">
                    <div class="progress-fill" :style="{ width: item.progress + '%', background: item.barColor }"></div>
                    <span class="progress-dot" :style="{ left: item.progress + '%', background: item.progress > 5 ? '#fff' : 'transparent', border: item.progress > 5 ? 'none' : '2px solid ' + item.barColor }"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="stats-section">
          <div class="card stats-card">
            <div class="card-header">
              <span class="card-title">养护情况</span>
              <div class="time-tabs">
                <span :class="{ active: statsTab === 'yesterday' }" @click="statsTab = 'yesterday'">昨日</span>
                <span :class="{ active: statsTab === 'week' }" @click="statsTab = 'week'">本周</span>
                <span :class="{ active: statsTab === 'quarter' }" @click="statsTab = 'quarter'">本季度</span>
                <span :class="{ active: statsTab === 'year' }" @click="statsTab = 'year'">本年</span>
              </div>
            </div>
            <div class="stats-content">
              <div class="stat-circle">
                <div class="circle-chart pipe-chart">
                  <span class="circle-value">3.36</span>
                  <span class="circle-unit">km</span>
                </div>
                <span class="stat-label">管网</span>
              </div>
              <div class="stat-circle">
                <div class="circle-chart well-chart">
                  <span class="circle-value">540</span>
                  <span class="circle-unit">个</span>
                </div>
                <span class="stat-label">井室</span>
              </div>
            </div>
          </div>
          <div class="card inspect-card">
            <div class="card-header">
              <span class="card-title">巡查情况</span>
              <div class="time-tabs">
                <span :class="{ active: activeTab === 'yesterday' }" @click="activeTab = 'yesterday'">昨日</span>
                <span :class="{ active: activeTab === 'week' }" @click="activeTab = 'week'">本周</span>
                <span :class="{ active: activeTab === 'quarter' }" @click="activeTab = 'quarter'">本季度</span>
                <span :class="{ active: activeTab === 'year' }" @click="activeTab = 'year'">本年</span>
              </div>
            </div>
            <div class="inspect-content">
              <div class="donut-chart">
                <svg viewBox="0 0 120 120" class="donut-svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" stroke-width="18" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#7c3aed" stroke-width="18"
                    stroke-dasharray="188.5 125.66" stroke-dashoffset="0" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" stroke-width="18"
                    stroke-dasharray="125.66 188.5" stroke-dashoffset="-188.5" transform="rotate(-90 60 60)" />
                </svg>
                <div class="donut-center">
                  <span class="donut-total">5</span>
                  <span class="donut-label">次</span>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-item">
                  <span class="legend-dot" style="background: #7c3aed"></span>
                  <span>工地巡查</span>
                  <b>3</b>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background: #f59e0b"></span>
                  <span>排口巡查</span>
                  <b>2</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部三列表格 -->
        <div class="bottom-section">
          <!-- 工地巡查 -->
          <div class="card table-card">
            <div class="card-header">
              <span class="card-title">工地巡查</span>
              <a href="#" class="more-link">更多 &gt;</a>
            </div>
            <a-table :columns="siteColumns" :data-source="siteData" :pagination="false" size="small" row-key="id" class="mini-table" />
          </div>
          <!-- 排口检查 -->
          <div class="card table-card">
            <div class="card-header">
              <span class="card-title">排口检查</span>
              <a href="#" class="more-link">更多 &gt;</a>
            </div>
            <a-table :columns="outfallColumns" :data-source="outfallData" :pagination="false" size="small" row-key="id" class="mini-table" />
          </div>
          <!-- 事件上报 -->
          <div class="card table-card">
            <div class="card-header">
              <span class="card-title">事件上报</span>
            </div>
            <div class="event-list">
              <div class="event-item" v-for="(item, index) in eventData" :key="index">
                <span class="event-badge" :style="{ background: item.color }">{{ index + 1 }}</span>
                <span class="event-label">{{ item.label }}</span>
                <span class="event-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
        </template>

        <!-- 养护任务页面 -->
        <MaintenanceTaskPage v-else-if="selectedKeys[0] === 'maintenance-task'" />
        <InspectionTaskPage v-else-if="selectedKeys[0] === 'inspect-task'" />

        <!-- 其他页面占位 -->
        <div v-else class="placeholder-page">
          <a-empty :description="pageTitle + ' - 开发中'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  DashboardOutlined, ScheduleOutlined, CarryOutOutlined, BulbOutlined,
  MonitorOutlined, EyeOutlined, FlagOutlined, LogoutOutlined,
  ToolOutlined, SearchOutlined, EnvironmentOutlined, AlertOutlined,
  ClockCircleOutlined, BarChartOutlined
} from '@ant-design/icons-vue'
import MaintenanceTaskPage from './maintenance-task-page.vue'
import InspectionTaskPage from './inspection-task-page.vue'

const router = useRouter()

const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>(['task', 'decision'])
const activeTab = ref('yesterday')
const statsTab = ref('yesterday')

// 页面标题映射
const pageTitleMap: Record<string, string> = {
  dashboard: '数据总览',
  'maintenance-task': '养护任务',
  'inspect-task': '巡查任务',
  'repair-task': '抢修任务',
  'maintenance-plan': '养护计划',
  'inspect-plan': '巡查计划',
  'repair-plan': '抢修计划'
}

const pageTitle = computed(() => pageTitleMap[selectedKeys.value[0]] || '数据总览')

// 监听菜单选择切换页面
watch(selectedKeys, (keys) => {
  if (keys.length > 0) {
    // 自动展开对应的父菜单
    const parentMap: Record<string, string> = {
      'maintenance-task': 'task',
      'inspect-task': 'task',
      'repair-task': 'task',
      'maintenance-plan': 'plan',
      'inspect-plan': 'plan',
      'repair-plan': 'plan'
    }
    const parentKey = parentMap[keys[0]]
    if (parentKey && !openKeys.value.includes(parentKey)) {
      openKeys.value.push(parentKey)
    }
  }
})

const goBack = () => {
  router.push('/login')
}

// 待办事项
const todoItems = [
  { label: '养护计划', value: 0, unit: '', iconBg: '#3b82f6', icon: markRaw(ScheduleOutlined), progress: 0, progressBg: '#ede9fe', barColor: '#8b5cf6' }
]

// 任务情况
const taskItems = [
  { label: '管网养护', value: 909, unit: '个', iconBg: '#14b8a6', icon: markRaw(ToolOutlined), progress: 70, progressBg: '#ccfbf1', barColor: '#14b8a6' },
  { label: '排口巡查', value: 329, unit: '次', iconBg: '#8b5cf6', icon: markRaw(SearchOutlined), progress: 35, progressBg: '#ede9fe', barColor: '#8b5cf6' },
  { label: '工地巡查', value: 196, unit: '个', iconBg: '#f97316', icon: markRaw(EnvironmentOutlined), progress: 20, progressBg: '#ffedd5', barColor: '#f97316' },
  { label: '事件上报', value: 9, unit: '个', iconBg: '#38bdf8', icon: markRaw(AlertOutlined), progress: 2, progressBg: '#e0f2fe', barColor: '#38bdf8' }
]

// 工地巡查表格
const siteColumns = [
  { title: '工地名称', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '片区', dataIndex: 'area', key: 'area', width: 80 },
  { title: '巡查时间', dataIndex: 'date', key: 'date', width: 110 }
]

const siteData = [
  { id: 1, name: '杭政储出[2022]63号地块项目', area: '之江片区', date: '2026-06-17' },
  { id: 2, name: '浙江科技大学数字化改造项目', area: '留下街道', date: '2026-06-16' },
  { id: 3, name: '杭政储出[2024]122号地块项目', area: '之江片区', date: '2026-06-16' },
  { id: 4, name: '工大青春宝总部用地项目', area: '留下街道', date: '2026-06-15' },
  { id: 5, name: '丽景路(珊瑚沙路-文一西路)', area: '之江片区', date: '2026-06-15' },
  { id: 6, name: '博览路（博美路-横街）', area: '之江片区', date: '2026-06-15' },
  { id: 7, name: '留漫巷（小和山站）', area: '留下街道', date: '2026-06-12' }
]

// 排口检查表格
const outfallColumns = [
  { title: '排口编码', dataIndex: 'code', key: 'code', width: 140 },
  { title: '巡查次数', dataIndex: 'count', key: 'count', width: 80, align: 'center' },
  { title: '最新巡查时间', dataIndex: 'date', key: 'date', width: 110 }
]

const outfallData = [
  { id: 1, code: 'E039H59', count: 4, date: '2026-06-17' },
  { id: 2, code: 'XHPS013YS091', count: 5, date: '2026-06-16' },
  { id: 3, code: '4F8069AC20B5BFFA', count: 40, date: '2026-06-15' },
  { id: 4, code: 'E039H50', count: 8, date: '2026-06-15' },
  { id: 5, code: 'E68H44', count: 9, date: '2026-06-15' },
  { id: 6, code: 'XHPS003YS379', count: 2, date: '2026-06-13' },
  { id: 7, code: 'XHPS003YS329', count: 1, date: '2026-06-13' }
]

// 事件上报
const eventData = [
  { label: '自行上报', value: 0, color: '#3b82f6' },
  { label: '工程上报', value: 0, color: '#10b981' },
  { label: '管网养护', value: 0, color: '#f59e0b' },
  { label: '管网巡查', value: 0, color: '#8b5cf6' }
]
</script>

<style scoped lang="scss">
.im-dashboard {
  height: 100vh;
  display: flex;
  background: #f0f2f5;
}

.sidebar {
  width: 220px;
  background: #001529;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-logo {
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo-icon {
      font-size: 22px;
      margin-right: 8px;
    }

    .logo-text {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
    }
  }

  .sidebar-menu {
    flex: 1;
    overflow-y: auto;
    border-right: none;

    :deep(.ant-menu-item-selected) {
      background: #1890ff !important;
    }
  }

  .sidebar-bottom {
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .back-btn {
      color: rgba(255, 255, 255, 0.65);
      font-size: 13px;
      width: 100%;
      text-align: left;

      &:hover {
        color: #fff;
      }
    }
  }
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .user-info {
    color: #666;
    font-size: 14px;
  }
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }

  .more-link {
    font-size: 12px;
    color: #1890ff;
    text-decoration: none;
  }
}

// 待办事项 + 任务情况
.top-section {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.todo-block {
  flex: 0 0 200px;
}

.task-block {
  flex: 1;
}

.section-header {
  margin-bottom: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    padding-left: 10px;
    border-left: 3px solid #3b82f6;
    display: inline-block;
  }
}

.metric-cards {
  display: flex;
  gap: 12px;
}

.metric-card {
  flex: 1;
  min-width: 0;
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .metric-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .metric-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #222;
    margin-bottom: 10px;

    .metric-unit {
      font-size: 12px;
      font-weight: 400;
      color: #999;
      margin-left: 2px;
    }
  }

  .metric-progress {
    width: 100%;

    .progress-bar {
      position: relative;
      height: 6px;
      border-radius: 3px;
      overflow: visible;

      .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .progress-dot {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

// 数据统计
.stats-section {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stats-card {
  flex: 1;

  .time-tabs {
    display: flex;
    gap: 4px;

    span {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: #10b981;
        color: #fff;
      }

      &:hover:not(.active) {
        background: #f0f0f0;
      }
    }
  }
}

.inspect-card {
  flex: 1;

  .time-tabs {
    display: flex;
    gap: 4px;

    span {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: #10b981;
        color: #fff;
      }

      &:hover:not(.active) {
        background: #f0f0f0;
      }
    }
  }
}

.stats-content {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 8px 0;
}

.stat-circle {
  display: flex;
  flex-direction: column;
  align-items: center;

  .circle-chart {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.pipe-chart {
      background: conic-gradient(#10b981 0% 75%, #e8f5e9 75% 100%);
    }

    &.well-chart {
      background: conic-gradient(#3b82f6 0% 65%, #e3f2fd 65% 100%);
    }

    .circle-value {
      font-size: 22px;
      font-weight: 700;
      color: #333;
      background: #fff;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .circle-unit {
      position: absolute;
      margin-top: 50px;
      font-size: 11px;
      color: #999;
    }
  }

  .stat-label {
    margin-top: 8px;
    font-size: 13px;
    color: #666;
  }
}

.inspect-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 8px 0;

  .donut-chart {
    margin: 0 auto;
  }

  .donut-legend {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 24px;
  }
}

.donut-chart {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;

  .donut-svg {
    width: 100%;
    height: 100%;
  }

  .donut-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .donut-total {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      display: block;
    }

    .donut-label {
      font-size: 12px;
      color: #999;
    }
  }
}

.donut-legend {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 24px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    b {
      color: #333;
      font-size: 16px;
      margin-left: auto;
    }
  }
}

// 底部表格
.bottom-section {
  display: flex;
  gap: 16px;
}

.table-card {
  flex: 1;
  min-width: 0;
}

.mini-table {
  :deep(.ant-table-thead > tr > th) {
    background: #f5f5f5;
    font-size: 12px;
    padding: 8px 6px;
    font-weight: 600;
  }

  :deep(.ant-table-tbody > tr > td) {
    font-size: 12px;
    padding: 6px;
  }
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .event-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: #fafafa;
    border-radius: 6px;

    .event-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .event-label {
      flex: 1;
      font-size: 13px;
      color: #333;
    }

    .event-value {
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }
  }
}
</style>
