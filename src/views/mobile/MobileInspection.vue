<template>
  <div class="mobile-inspection">
    <div class="mobile-container">
      <!-- 顶部背景图 -->
      <div class="top-bg">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">巡检养护</div>
      </div>

      <!-- 通知公告 -->
      <div class="notice-card">
        <div class="notice-header">
          <SoundOutlined class="notice-icon" />
          <span class="notice-title">通知公告</span>
        </div>
        <div class="notice-content">
          同一个井室或管段养护后只能上传一次；3、井...
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-section">
        <h3 class="section-title">功能菜单</h3>
        <div class="menu-grid">
          <div v-for="item in menuItems" :key="item.name" class="menu-item" @click="handleMenuClick(item)">
            <div class="menu-icon" :style="{ background: item.color }">
              <component :is="item.icon" style="font-size: 32px; color: #fff;" />
            </div>
            <span class="menu-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- 待办任务 / 区域任务 -->
      <div class="task-section">
        <div class="task-tabs">
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'pending' }"
            @click="activeTab = 'pending'"
          >
            待办任务
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'area' }"
            @click="activeTab = 'area'"
          >
            区域任务
          </div>
        </div>

        <!-- 待办任务列表 -->
        <div v-if="activeTab === 'pending'" class="task-list">
          <div class="task-card">
            <div class="task-header">
              <h4 class="task-name">环城路 (清河路-嘉罗路)</h4>
              <span class="task-tag">养护</span>
            </div>
            <div class="task-info">
              <div class="info-item">
                <FlagOutlined style="color: #722ed1; margin-right: 8px;" />
                <span>待办：待片区确认</span>
              </div>
              <div class="info-item">
                <ClockCircleOutlined style="color: #1890ff; margin-right: 8px;" />
                <span>实际完成时间：2026-06-20 05:53:00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 区域任务列表 -->
        <div v-if="activeTab === 'area'" class="task-list">
          <div class="empty-state">
            <p>暂无区域任务</p>
          </div>
        </div>
      </div>

      <!-- 底部导航栏 -->
      <div class="bottom-nav">
        <div class="nav-item active" @click="navigateTo('home')">
          <HomeFilled style="font-size: 24px;" />
          <span>首页</span>
        </div>
        <div class="nav-item" @click="navigateTo('maintenance')">
          <ToolOutlined style="font-size: 24px;" />
          <span>养护</span>
        </div>
        <div class="nav-item" @click="navigateTo('patrol')">
          <SearchOutlined style="font-size: 24px;" />
          <span>巡查</span>
        </div>
        <div class="nav-item" @click="navigateTo('inspection')">
          <CheckCircleOutlined style="font-size: 24px;" />
          <span>检查</span>
        </div>
        <div class="nav-item" @click="navigateTo('repair')">
          <ExclamationCircleOutlined style="font-size: 24px;" />
          <span>抢修</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  SoundOutlined,
  ToolOutlined,
  FlagOutlined,
  ClockCircleOutlined,
  HomeFilled,
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  MessageOutlined,
  PieChartOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LineChartOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  CarOutlined,
  FormOutlined,
  BarChartOutlined,
  IdcardOutlined,
  ProjectOutlined,
  LeftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 功能菜单数据
const menuItems = [
  { name: 'patrol', label: '巡查开单', icon: UserOutlined, color: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' },
  { name: 'repair', label: '抢修开单', icon: ToolOutlined, color: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)' },
  { name: 'event', label: '事件上报', icon: MessageOutlined, color: 'linear-gradient(135deg, #f5222d 0%, #ff7875 100%)' },
  { name: 'stats', label: '养护统计', icon: PieChartOutlined, color: 'linear-gradient(135deg, #13c2c2 0%, #5cdbd3 100%)' },
  { name: 'signin', label: '签到信息', icon: CalendarOutlined, color: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' },
  { name: 'log', label: '日志信息', icon: FileTextOutlined, color: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' },
  { name: 'supervise-log', label: '监管日志', icon: LineChartOutlined, color: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)' },
  { name: 'assessment', label: '监管考核', icon: AppstoreOutlined, color: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)' },
  { name: 'inspection', label: '日常抽检', icon: SafetyOutlined, color: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)' },
  { name: 'sludge', label: '污泥转运', icon: CarOutlined, color: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)' },
  { name: 'seal', label: '管道封拆', icon: FormOutlined, color: 'linear-gradient(135deg, #f5222d 0%, #ff7875 100%)' },
  { name: 'data-change', label: '数据变更', icon: BarChartOutlined, color: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' },
  { name: 'hotline', label: '热线工单', icon: IdcardOutlined, color: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)' },
  { name: 'key-area', label: '重点区域', icon: ProjectOutlined, color: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)' }
]

// 当前激活的标签页
const activeTab = ref<'pending' | 'area'>('pending')

// 处理菜单点击
const handleMenuClick = (item: any) => {
  console.log('点击菜单:', item.label)
  // TODO: 跳转到对应功能页面
}

// 返回数字管养页
const goBack = () => {
  router.push('/digital-management')
}

// 底部导航跳转
const navigateTo = (page: string) => {
  const routes: Record<string, string> = {
    home: '/mobile-inspection',
    maintenance: '/mobile-maintenance',
    patrol: '/mobile-patrol',
    inspection: '/mobile-check',
    repair: '/mobile-repair'
  }
  if (routes[page]) {
    router.push(routes[page])
  }
}
</script>

<style scoped lang="scss">
.mobile-inspection {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;

  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    background: #fff;
    position: relative;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding-bottom: 60px; // 为底部导航栏留出空间

    // 顶部背景图
    .top-bg {
      height: 120px;
      background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('@/assets/bg.jpg');
        background-size: cover;
        background-position: center;
        opacity: 0.3;
      }

      .header-back {
        position: absolute;
        top: 16px;
        left: 16px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.3s;
        z-index: 10;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        :deep(.anticon) {
          font-size: 20px;
          color: #fff;
        }
      }

      .header-title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-weight: 600;
        color: #fff;
        z-index: 1;
      }
    }

    // 通知公告卡片
    .notice-card {
      margin: -40px 16px 16px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 16px;
      position: relative;
      z-index: 10;

      .notice-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px dashed #e8e8e8;

        .notice-icon {
          font-size: 20px;
          color: #f5222d;
          margin-right: 8px;
        }

        .notice-title {
          font-size: 16px;
          font-weight: 600;
          color: #1890ff;
        }
      }

      .notice-content {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
    }

    // 功能菜单区域
    .menu-section {
      padding: 16px;

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 16px;
        position: relative;
        padding-left: 12px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 18px;
          background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
          border-radius: 2px;
        }
      }

      .menu-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;

        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;

          &:active {
            transform: scale(0.95);
          }

          .menu-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .menu-label {
            font-size: 12px;
            color: #333;
            text-align: center;
            line-height: 1.4;
          }
        }
      }
    }

    // 待办任务区域
    .task-section {
      padding: 16px;
      padding-bottom: 0;

      .task-tabs {
        display: flex;
        gap: 32px;
        margin-bottom: 16px;
        border-bottom: 2px solid #f0f0f0;

        .tab-item {
          padding: 12px 0;
          font-size: 16px;
          color: #999;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;

          &.active {
            color: #1890ff;
            font-weight: 600;

            &::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              right: 0;
              height: 2px;
              background: #1890ff;
            }
          }
        }
      }

      .task-list {
        .task-card {
          background: #fff;
          border: 2px solid #1890ff;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;

          .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .task-name {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a1a;
              margin: 0;
            }

            .task-tag {
              background: #1890ff;
              color: #fff;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
          }

          .task-info {
            .info-item {
              display: flex;
              align-items: center;
              font-size: 14px;
              color: #666;
              margin-bottom: 8px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
      }
    }

    // 底部导航栏
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 480px;
      height: 60px;
      background: #fff;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 100;

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
        cursor: pointer;
        transition: all 0.3s;

        :deep(.anticon) {
          font-size: 24px;
          color: #999;
          margin-bottom: 4px;
        }

        span {
          font-size: 12px;
          color: #999;
        }

        &.active {
          :deep(.anticon) {
            color: #1890ff;
          }

          span {
            color: #1890ff;
            font-weight: 600;
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mobile-inspection {
    .mobile-container {
      box-shadow: none;

      .bottom-nav {
        left: 0;
        transform: none;
      }
    }
  }
}
</style>
