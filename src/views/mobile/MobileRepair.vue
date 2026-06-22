<template>
  <div class="mobile-repair">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">抢修</div>
        <div class="header-actions">
          <FilterOutlined class="action-icon" />
          <SearchOutlined class="action-icon" />
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="filter-bar">
        <div class="filter-item active">
          <span>抢修</span>
          <DownOutlined style="margin-left: 8px; font-size: 12px;" />
        </div>
        <div class="filter-item">
          <span>复核</span>
          <DownOutlined style="margin-left: 8px; font-size: 12px;" />
        </div>
      </div>

      <!-- 抢修列表 -->
      <div class="repair-list">
        <div 
          v-for="(item, index) in repairList" 
          :key="index"
          class="repair-card"
          @click="handleRepairClick(item)"
        >
          <div class="card-corner">
            <span class="corner-text">修</span>
          </div>
          <div class="card-content">
            <h3 class="repair-name">{{ item.name }}</h3>
            <div class="repair-time">
              <ClockCircleOutlined style="color: #ff4d4f; margin-right: 8px;" />
              <span>{{ item.timeLabel }}：{{ item.time }}</span>
            </div>
          </div>
          <div class="card-tag">
            <span>{{ item.status }}</span>
          </div>
        </div>
      </div>

      <!-- 底部导航栏 -->
      <div class="bottom-nav">
        <div class="nav-item" @click="navigateTo('home')">
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
        <div class="nav-item active" @click="navigateTo('repair')">
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
  DownOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HomeFilled,
  ToolOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 抢修列表数据
const repairList = ref([
  {
    name: '胜竹东路',
    timeLabel: '计划开始时间',
    time: '2025-03-13 10:39',
    status: '已接收'
  },
  {
    name: '赵塔路春塔里交叉口…',
    timeLabel: '实际完成时间',
    time: '2025-03-17 16:34',
    status: '维修结束'
  },
  {
    name: '赵塔路春海路交叉口…',
    timeLabel: '实际完成时间',
    time: '2025-03-17 16:32',
    status: '维修结束'
  },
  {
    name: '赵塔路春塔路口交叉…',
    timeLabel: '实际完成时间',
    time: '2025-03-17 16:24',
    status: '维修结束'
  },
  {
    name: '春意路淞阳路往西6米',
    timeLabel: '实际完成时间',
    time: '2025-03-17 16:26',
    status: '维修结束'
  }
])

// 处理抢修项点击
const handleRepairClick = (item: any) => {
  router.push({
    path: '/repair-detail',
    query: {
      name: item.name,
      time: item.time
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
.mobile-repair {
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

    // 筛选器
    .filter-bar {
      background: #fff;
      padding: 12px 16px;
      display: flex;
      gap: 12px;
      border-bottom: 1px solid #e8e8e8;

      .filter-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        background: #f5f7fa;
        border-radius: 4px;
        font-size: 14px;
        color: #666;
        cursor: pointer;
        transition: all 0.3s;

        &.active {
          background: #e6f7ff;
          color: #1890ff;
          font-weight: 600;
        }

        &:hover {
          background: #e8e8e8;
        }
      }
    }

    // 抢修列表
    .repair-list {
      padding: 16px;
      min-height: calc(100vh - 56px - 52px - 60px);
      overflow-y: auto;

      .repair-card {
        position: relative;
        background: #fff;
        border: 2px solid #ff4d4f;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);
          transform: translateY(-2px);
        }

        .card-corner {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-top: 50px solid #ff4d4f;
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

          .repair-name {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 12px 0;
          }

          .repair-time {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #666;
          }
        }

        .card-tag {
          position: absolute;
          top: 50%;
          right: 35px;
          transform: translateY(-50%);

          span {
            padding: 4px 12px;
            background: #52c41a;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
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
  .mobile-repair {
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
