<template>
  <div class="sewage-treatment-page">
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
          <a-tab-pane key="basic-info" tab="基本信息">
            <component :is="currentChild" />
          </a-tab-pane>
          <a-tab-pane key="staff-management" tab="从业人员管理">
            <component :is="currentChild" />
          </a-tab-pane>
          <a-tab-pane key="safety-assessment" tab="安全评估管理">
            <component :is="currentChild" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PlantInfo from './plant-info.vue'
import OperationEnterprise from './operation-enterprise.vue'
import SludgeFacility from './sludge-facility.vue'
import StaffInfo from './staff-info.vue'
import StaffCertificate from './staff-certificate.vue'
import SafetyAssessmentRecord from './safety-assessment-record.vue'
import SafetyAssessmentDanger from './safety-assessment-danger.vue'
import SafetyAssessmentStats from './safety-assessment-stats.vue'

// 左侧菜单配置
const selectedMenu = ref<string[]>(['plant-info'])
const openKeys = ref<string[]>(['basic-info'])
const activeTab = ref('basic-info')

// 子菜单项 -> 父菜单 key 映射
const childToParent: Record<string, string> = {
  'plant-info': 'basic-info',
  'operation-enterprise': 'basic-info',
  'sludge-facility': 'basic-info',
  'staff-info': 'staff-management',
  'staff-certificate': 'staff-management',
  'safety-assessment-record': 'safety-assessment',
  'safety-assessment-danger': 'safety-assessment',
  'safety-assessment-stats': 'safety-assessment'
}

// 子菜单项 -> 组件映射
const childComponentMap: Record<string, any> = {
  'plant-info': PlantInfo,
  'operation-enterprise': OperationEnterprise,
  'sludge-facility': SludgeFacility,
  'staff-info': StaffInfo,
  'staff-certificate': StaffCertificate,
  'safety-assessment-record': SafetyAssessmentRecord,
  'safety-assessment-danger': SafetyAssessmentDanger,
  'safety-assessment-stats': SafetyAssessmentStats
}

// 当前显示的子组件
const currentChild = computed(() => {
  const key = selectedMenu.value[0] || 'plant-info'
  return childComponentMap[key] || PlantInfo
})

const menuItems = [
  {
    key: 'basic-info',
    label: '基本信息',
    children: [
      { key: 'plant-info', label: '污水处理厂' },
      { key: 'operation-enterprise', label: '运营企业' },
      { key: 'sludge-facility', label: '污泥处理处置设施' }
    ]
  },
  {
    key: 'staff-management',
    label: '从业人员管理',
    children: [
      { key: 'staff-info', label: '从业人员基本信息' },
      { key: 'staff-certificate', label: '从业人员证书管理' }
    ]
  },
  {
    key: 'safety-assessment',
    label: '安全评估管理',
    children: [
      { key: 'safety-assessment-record', label: '安全评估记录管理' },
      { key: 'safety-assessment-danger', label: '安全评估隐患管理' },
      { key: 'safety-assessment-stats', label: '安全评估统计' }
    ]
  }
]

// 父菜单 -> 第一个子菜单映射
const parentFirstChild: Record<string, string> = {
  'basic-info': 'plant-info',
  'staff-management': 'staff-info',
  'safety-assessment': 'safety-assessment-record'
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
.sewage-treatment-page {
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
