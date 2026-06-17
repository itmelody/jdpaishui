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
        <!-- 使用 router-view 显示子路由组件 -->
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 左侧菜单配置
const selectedMenu = ref<string[]>(['manhole-info'])
const openKeys = ref<string[]>(['basic-info']) // 默认展开管网基础信息管理
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

// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    if (newPath) {
      // 根据路径确定对应的菜单key
      let menuKey = 'manhole-info' // 默认值
      
      if (newPath.includes('/pipe-section-info')) {
        menuKey = 'pipe-section-info'
      } else if (newPath.includes('/network-map')) {
        menuKey = 'network-map'
      } else if (newPath.includes('/detection-result')) {
        menuKey = 'detection-result'
      } else if (newPath.includes('/hidden-danger')) {
        menuKey = 'hidden-danger'
      } else if (newPath.includes('/unit-basic')) {
        menuKey = 'unit-basic'
      } else if (newPath.includes('/unit-personnel')) {
        menuKey = 'unit-personnel'
      } else if (newPath.includes('/data-stats')) {
        menuKey = 'data-stats'
      } else if (newPath.includes('/progress-stats-detail')) {
        menuKey = 'progress-stats-detail'
      } else if (newPath.includes('/rectification-analysis')) {
        menuKey = 'rectification-analysis'
      }
      
      selectedMenu.value = [menuKey]
      
      // 根据菜单项设置对应的展开状态
      if (['manhole-info', 'pipe-section-info', 'network-map'].includes(menuKey)) {
        openKeys.value = ['basic-info']
      } else if (['detection-result', 'hidden-danger'].includes(menuKey)) {
        openKeys.value = ['detection-info']
      } else if (['unit-basic', 'unit-personnel'].includes(menuKey)) {
        openKeys.value = ['unit-info']
      } else if (['data-stats', 'progress-stats-detail', 'rectification-analysis'].includes(menuKey)) {
        openKeys.value = ['progress-stats']
      }
    }
  },
  { immediate: true }
)

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  const routeMap: Record<string, string> = {
    'manhole-info': '/drainage-network/manhole-info',
    'pipe-section-info': '/drainage-network/pipe-section-info',
    'network-map': '/drainage-network/network-map',
    'detection-result': '/drainage-network/detection-result',
    'hidden-danger': '/drainage-network/hidden-danger',
    'unit-basic': '/drainage-network/unit-basic',
    'unit-personnel': '/drainage-network/unit-personnel',
    'data-stats': '/drainage-network/data-stats',
    'progress-stats-detail': '/drainage-network/progress-stats-detail',
    'rectification-analysis': '/drainage-network/rectification-analysis'
  }
  
  if (routeMap[key]) {
    router.push(routeMap[key])
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
    padding: 16px;
    overflow-y: auto;
  }
}
</style>
