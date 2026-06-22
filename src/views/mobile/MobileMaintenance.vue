<template>
  <div class="mobile-maintenance">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">养护</div>
        <div class="header-actions">
          <FilterOutlined class="action-icon" />
          <SearchOutlined class="action-icon" />
        </div>
      </div>

      <!-- 标签页 -->
      <div class="tabs-bar">
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
          v-for="(task, index) in filteredTasks" 
          :key="index"
          class="task-card"
          @click="handleTaskClick(task)"
        >
          <div class="card-corner">
            <span class="corner-text">养</span>
          </div>
          <div class="card-content">
            <h3 class="task-name">{{ task.name }}</h3>
            <div class="task-time">
              <ClockCircleOutlined style="color: #1890ff; margin-right: 8px;" />
              <span>计划完成时间：{{ task.planTime }}</span>
            </div>
          </div>
          <div class="card-tags">
            <span class="tag status">进行中</span>
            <span class="tag type">{{ task.type }}</span>
          </div>
        </div>
      </div>

      <!-- 底部导航栏 -->
      <div class="bottom-nav">
        <div class="nav-item" @click="navigateTo('home')">
          <HomeFilled style="font-size: 24px;" />
          <span>首页</span>
        </div>
        <div class="nav-item active" @click="navigateTo('maintenance')">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  LeftOutlined,
  FilterOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  HomeFilled,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 标签页数据
const tabs = [
  { label: '进行中', value: 'inProgress' as const },
  { label: '已完成', value: 'completed' as const },
  { label: '已确认', value: 'confirmed' as const },
  { label: '异常', value: 'abnormal' as const }
]

// 当前激活的标签页
const activeTab = ref<'inProgress' | 'completed' | 'confirmed' | 'abnormal'>('inProgress')

// 任务列表数据
const tasks = ref([
  { name: '武乡路 (唐家浜-大理港)', planTime: '2026-06-18', type: '雨水', status: 'inProgress' },
  { name: '临洮路 (靖远路-陇南路)', planTime: '2026-06-24', type: '污水', status: 'inProgress' },
  { name: '高潮路 (丰华路-武都路)', planTime: '2026-06-24', type: '雨水', status: 'inProgress' },
  { name: '汇善路 (城北路-嘉唐公路)', planTime: '2026-06-24', type: '雨水', status: 'inProgress' },
  { name: '乐惠路 (嘉绣路-嘉好路)', planTime: '2026-06-24', type: '雨水', status: 'inProgress' },
  { name: '惠裕路 (嘉绣路-翔江公路)', planTime: '2026-06-28', type: '雨水', status: 'inProgress' }
])

// 根据标签页过滤任务
const filteredTasks = computed(() => {
  return tasks.value.filter(task => task.status === activeTab.value)
})

// 处理任务点击
const handleTaskClick = (task: any) => {
  console.log('点击任务:', task.name)
  // 跳转到养护详情页
  router.push({
    path: '/maintenance-detail',
    query: {
      name: task.name,
      planTime: task.planTime,
      type: task.type
    }
  })
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
.mobile-maintenance {
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
    .tabs-bar {
      display: flex;
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      overflow-x: auto;

      .tab-item {
        flex: 1;
        min-width: 80px;
        padding: 16px 12px;
        text-align: center;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;

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

        &:hover {
          color: #1890ff;
        }
      }
    }

    // 任务列表
    .task-list {
      padding: 16px;
      min-height: calc(100vh - 56px - 60px - 56px);
      overflow-y: auto;

      .task-card {
        position: relative;
        background: #fff;
        border: 2px solid #1890ff;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
          transform: translateY(-2px);
        }

        .card-corner {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-top: 50px solid #1890ff;
          border-left: 50px solid transparent;
          border-radius: 0 8px 0 0;

          .corner-text {
            position: absolute;
            top: -42px;
            right: 6px;
            font-size: 20px;
            font-weight: bold;
            color: #fff;
          }
        }

        .card-content {
          margin-right: 120px;

          .task-name {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 12px 0;
          }

          .task-time {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #666;
          }
        }

        .card-tags {
          position: absolute;
          top: 50%;
          right: 35px;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 8px;

          .tag {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            color: #fff;

            &.status {
              background: #52c41a;
            }

            &.type {
              background: #52c41a;
            }
          }
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

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mobile-maintenance {
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
