<template>
  <div class="drainage-network-page">
    <!-- 左侧菜单 -->
    <a-layout>
      <a-layout-sider width="200" :style="{ background: '#fff' }">
        <a-menu
          v-model:selectedKeys="selectedMenu"
          v-model:openKeys="openKeys"
          mode="inline"
          :items="menuItems"
          @click="handleMenuClick"
        />
      </a-layout-sider>
      
      <!-- 右侧内容区 -->
      <a-layout-content class="content-wrapper">
        <a-tabs v-model:activeKey="activeTab" class="main-tabs" @change="handleTabChange">
          <a-tab-pane key="basic-info" tab="管网基础信息管理">
            <component :is="currentChild" />
          </a-tab-pane>
          <a-tab-pane key="detection-info" tab="管网检测信息管理">
            <component :is="currentChild" />
          </a-tab-pane>
          <a-tab-pane key="pump-station" tab="泵站基础信息管理">
            <component :is="currentChild" />
          </a-tab-pane>
          <a-tab-pane key="unit-info" tab="检测单位信息管理">
            <component :is="currentChild" />
          </a-tab-pane>
          <a-tab-pane key="progress-stats" tab="排查工作进展统计">
            <component :is="currentChild" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import ManholeInfo from './manhole-info.vue'
import PipeSectionInfo from './pipe-section-info.vue'
import NetworkMap from './network-map.vue'
import DetectionResult from './detection-result.vue'
import HiddenDanger from './hidden-danger.vue'
import UnitBasic from './unit-basic.vue'
import UnitPersonnel from './unit-personnel.vue'
import DataStats from './data-stats.vue'
import ProgressStatsDetail from './progress-stats-detail.vue'
import RectificationAnalysis from './rectification-analysis.vue'
import PumpStationInfo from './pump-station-info.vue'
import PumpStationMonitor from './pump-station-monitor.vue'

// 左侧菜单配置
const selectedMenu = ref<string[]>(['manhole-info'])
const openKeys = ref<string[]>(['basic-info'])
const activeTab = ref('basic-info')

// 子菜单项 -> 父菜单 key 映射
const childToParent: Record<string, string> = {
  'manhole-info': 'basic-info',
  'pipe-section-info': 'basic-info',
  'network-map': 'basic-info',
  'detection-result': 'detection-info',
  'hidden-danger': 'detection-info',
  'unit-basic': 'unit-info',
  'unit-personnel': 'unit-info',
  'data-stats': 'progress-stats',
  'progress-stats-detail': 'progress-stats',
  'rectification-analysis': 'progress-stats',
  'pump-station-info': 'pump-station',
  'pump-station-monitor': 'pump-station'
}

// 子菜单项 -> 组件映射
const childComponentMap: Record<string, any> = {
  'manhole-info': ManholeInfo,
  'pipe-section-info': PipeSectionInfo,
  'network-map': NetworkMap,
  'detection-result': DetectionResult,
  'hidden-danger': HiddenDanger,
  'unit-basic': UnitBasic,
  'unit-personnel': UnitPersonnel,
  'data-stats': DataStats,
  'progress-stats-detail': ProgressStatsDetail,
  'rectification-analysis': RectificationAnalysis,
  'pump-station-info': PumpStationInfo,
  'pump-station-monitor': PumpStationMonitor
}

// 当前显示的子组件
const currentChild = computed(() => {
  const key = selectedMenu.value[0] || 'manhole-info'
  return childComponentMap[key] || ManholeInfo
})

const menuItems = [
  {
    key: 'basic-info',
    label: '管网基础信息管理',
    children: [
      { key: 'manhole-info', label: '井盖基础信息' },
      { key: 'pipe-section-info', label: '管段基础信息' },
      { key: 'network-map', label: '排水管网地图' }
    ]
  },
  {
    key: 'detection-info',
    label: '管网检测信息管理',
    children: [
      { key: 'detection-result', label: '检测结果信息' },
      { key: 'hidden-danger', label: '隐患数据信息' }
    ]
  },
  {
    key: 'pump-station',
    label: '泵站基础信息管理',
    children: [
      { key: 'pump-station-info', label: '泵站基本信息' },
      { key: 'pump-station-monitor', label: '泵站运行监测' }
    ]
  },
  {
    key: 'unit-info',
    label: '检测单位信息管理',
    children: [
      { key: 'unit-basic', label: '检测单位基础信息' },
      { key: 'unit-personnel', label: '检测单位人员信息' }
    ]
  },
  {
    key: 'progress-stats',
    label: '排查工作进展统计',
    children: [
      { key: 'data-stats', label: '排水管网数据统计' },
      { key: 'progress-stats-detail', label: '排查进度情况统计' },
      { key: 'rectification-analysis', label: '隐患整治结果分析' }
    ]
  }
]

// 父菜单 -> 第一个子菜单映射
const parentFirstChild: Record<string, string> = {
  'basic-info': 'manhole-info',
  'detection-info': 'detection-result',
  'unit-info': 'unit-basic',
  'progress-stats': 'data-stats',
  'pump-station': 'pump-station-info'
}

// 标签页切换时联动左侧菜单
const handleTabChange = (key: string) => {
  const firstChild = parentFirstChild[key]
  if (firstChild) {
    selectedMenu.value = [firstChild]
  }
  openKeys.value = [key]
}

// 菜单点击处理 - 同步更新菜单选中、展开状态和标签页
const handleMenuClick = ({ key }: { key: string }) => {
  selectedMenu.value = [key]

  // 切换到对应的父级页签
  const parentKey = childToParent[key]
  if (parentKey) {
    activeTab.value = parentKey
    openKeys.value = [parentKey]
  }
}
</script>

<style scoped lang="scss">
.drainage-network-page {
  display: flex;
  height: calc(100vh - 64px);
  background: #f0f2f5;

  :deep(.ant-layout-sider) {
    background: #fff;
    border-right: 1px solid #e8e8e8;
  }

  .content-wrapper {
    padding: 0 16px;
    overflow-y: auto;
  }

  .main-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 16px;
    }
  }
}
</style>
