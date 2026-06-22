<template>
  <div class="mobile-patrol">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">巡查</div>
        <div class="header-actions">
          <FilterOutlined class="action-icon" />
          <SearchOutlined class="action-icon" />
        </div>
      </div>

      <!-- 标签页 -->
      <div class="tab-bar">
        <div 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="task-list">
        <div 
          v-for="(task, index) in taskList" 
          :key="index" 
          class="task-card"
          @click="goToDetail(task)"
        >
          <div class="card-corner">
            <span class="corner-text">巡</span>
          </div>
          <div class="card-content">
            <h3 class="task-name">{{ task.name }}</h3>
            <div class="task-info">
              <ClockCircleOutlined class="info-icon" />
              <span>巡查时间：{{ task.date }}</span>
            </div>
          </div>
          <div class="card-tag">
            <span>管网巡查</span>
          </div>
        </div>
      </div>

      <!-- 底部导航栏 -->
      <div class="bottom-nav">
        <div class="nav-item" @click="navigateTo('home')">
          <HomeOutlined style="font-size: 24px;" />
          <span>首页</span>
        </div>
        <div class="nav-item" @click="navigateTo('maintenance')">
          <ToolOutlined style="font-size: 24px;" />
          <span>养护</span>
        </div>
        <div class="nav-item active" @click="navigateTo('patrol')">
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
  LeftOutlined,
  FilterOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 标签页数据
const tabs = [
  { label: '待开始', value: 'pending' as const },
  { label: '进行中', value: 'inProgress' as const },
  { label: '已完成', value: 'completed' as const }
]

// 当前激活的标签页
const activeTab = ref<'pending' | 'inProgress' | 'completed'>('pending')

// 任务列表数据
const taskList = ref([
  { name: '永靖路;清水路;红石路…', date: '2026-06-22' },
  { name: '封周路;合作路;洪德路…', date: '2026-06-22' },
  { name: '新侯路;丰庄路;清峪路…', date: '2026-06-22' },
  { name: '祁连山路;曹安路;曹安…', date: '2026-06-22' },
  { name: '星华公路;鹤霞路;肃北…', date: '2026-06-22' },
  { name: '博园路;金华路延伸段;…', date: '2026-06-22' }
])

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

// 跳转到详情页
const goToDetail = (task: any) => {
  console.log('点击任务:', task)
  // TODO: 传递任务ID等参数
  router.push({
    path: '/mobile-patrol-detail',
    query: {
      id: Date.now(), // 临时使用时间戳作为ID
      name: task.name,
      date: task.date
    }
  })
}
</script>

<style scoped lang="scss">
.mobile-patrol {
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

    // 顶部导航栏
    .top-header {
      height: 56px;
      background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 100;

      .header-back {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        :deep(.anticon) {
          font-size: 20px;
        }
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        flex: 1;
        text-align: center;
      }

      .header-actions {
        display: flex;
        gap: 16px;

        .action-icon {
          font-size: 20px;
          cursor: pointer;
          transition: opacity 0.3s;

          &:hover {
            opacity: 0.7;
          }
        }
      }
    }

    // 标签页
    .tab-bar {
      display: flex;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      position: sticky;
      top: 56px;
      z-index: 99;

      .tab-item {
        flex: 1;
        padding: 16px 0;
        text-align: center;
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
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 3px;
            background: #1890ff;
            border-radius: 2px;
          }
        }
      }
    }

    // 任务列表
    .task-list {
      padding: 16px;

      .task-card {
        background: #fff;
        border: 2px solid #b37feb;
        border-radius: 8px;
        margin-bottom: 12px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(179, 127, 235, 0.2);
        }

        .card-corner {
          position: absolute;
          top: 0;
          right: 0;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #b37feb 0%, #9254de 100%);
          clip-path: polygon(100% 0, 0 0, 100% 100%);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 8px;

          .corner-text {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            line-height: 1;
          }
        }

        .card-content {
          padding: 16px;
          padding-right: 80px;

          .task-name {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 12px 0;
            line-height: 1.4;
          }

          .task-info {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #666;

            .info-icon {
              color: #b37feb;
              margin-right: 8px;
              font-size: 16px;
            }
          }
        }

        .card-tag {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: #52c41a;
          color: #fff;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
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
  .mobile-patrol {
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
