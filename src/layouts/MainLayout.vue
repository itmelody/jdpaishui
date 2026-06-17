<template>
  <a-layout class="layout">
    <!-- 顶部导航栏 -->
    <a-layout-header class="header">
      <div class="header-left">
        <div class="logo-wrapper">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <h1 class="logo">建德市城镇排水系统智慧运营平台</h1>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          theme="dark"
          @click="handleMenuClick"
          class="top-menu"
        >
          <a-menu-item key="workbench">
            <span>工作台</span>
          </a-menu-item>
          <a-menu-item key="drainage-network">
            <span>排水管网监管</span>
          </a-menu-item>
          <a-menu-item key="drainage-user">
            <span>排水户监管</span>
          </a-menu-item>
          <a-menu-item key="inspection-maintenance">
            <span>巡检养护</span>
          </a-menu-item>
          <a-menu-item key="warning-workorder">
            <span>预警工单</span>
          </a-menu-item>
          <a-menu-item key="realtime-monitoring">
            <span>实时监测</span>
          </a-menu-item>
          <a-menu-item key="engineering-management">
            <span>工程管理</span>
          </a-menu-item>
          <a-menu-item key="drainage-map">
            <span>排水一张图</span>
          </a-menu-item>
        </a-menu>
      </div>
      <div class="header-right">
        <span class="user-info">管理员</span>
        <a-button 
          type="text" 
          class="logout-btn"
          @click="handleLogout"
        >
          <template #icon>
            <LogoutOutlined />
          </template>
          退出
        </a-button>
      </div>
    </a-layout-header>

    <!-- 主内容区 -->
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LogoutOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const selectedKeys = ref<string[]>(['workbench'])

// 监听路由变化，更新选中菜单项
watch(
  () => route.path,
  (newPath) => {
    const path = newPath.substring(1) || 'workbench'
    selectedKeys.value = [path]
  },
  { immediate: true }
)

// 菜单点击事件
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(`/${key}`)
}

// 退出登录
const handleLogout = () => {
  // TODO: 这里可以清除用户信息、token等
  // 跳转到登录页
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #0052d9 0%, #0078ff 100%);
  padding: 0 24px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  height: auto;
  min-height: 64px;
  
  .header-left {
    display: flex;
    align-items: center;
    flex: 1;
    
    .logo-wrapper {
      display: flex;
      align-items: center;
      margin-right: 32px;
      
      .logo-icon {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        color: #fff;
        flex-shrink: 0;
      }
      
      .logo {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        letter-spacing: 1px;
        white-space: nowrap;
      }
    }
    
    .top-menu {
      flex: 1;
      background: transparent;
      border-bottom: none;
      line-height: 64px;
      
      :deep(.ant-menu-item) {
        color: rgba(255, 255, 255, 0.85);
        border-bottom: 2px solid transparent;
        transition: all 0.3s;
        
        &:hover {
          color: #fff;
          border-bottom-color: #fff;
        }
        
        &.ant-menu-item-selected {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          border-bottom-color: #fff;
        }
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .user-info {
      color: white;
      font-size: 14px;
      padding: 0 8px;
    }
    
    .logout-btn {
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 4px 12px;
      transition: all 0.3s;
      
      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
      }
      
      :deep(.anticon) {
        margin-right: 4px;
      }
    }
  }
}

.content {
  flex: 1;
  margin: 16px;
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px - 32px);
  border-radius: 4px;
  overflow-y: auto;
}
</style>
