<template>
  <div class="mobile-patrol-detail">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">巡查详情</div>
        <div class="header-actions">
          <FilterOutlined class="action-icon" />
          <SearchOutlined class="action-icon" />
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="输入道路或小区名称搜索"
          class="search-input"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>

      <!-- 功能菜单 -->
      <div class="function-menu">
        <div class="menu-item" @click="handleFunctionClick('signin')">
          <div class="menu-icon blue">
            <CalendarOutlined style="font-size: 32px; color: #fff;" />
          </div>
          <span class="menu-label">签到信息</span>
        </div>
        <div class="menu-item" @click="handleFunctionClick('event')">
          <div class="menu-icon orange">
            <FileTextOutlined style="font-size: 32px; color: #fff;" />
          </div>
          <span class="menu-label">事件清单</span>
        </div>
        <div class="menu-item" @click="handleFunctionClick('record')">
          <div class="menu-icon orange-light">
            <HistoryOutlined style="font-size: 32px; color: #fff;" />
          </div>
          <span class="menu-label">巡查记录</span>
        </div>
        <div class="menu-item" @click="handleFunctionClick('assessment')">
          <div class="menu-icon yellow">
            <AppstoreOutlined style="font-size: 32px; color: #fff;" />
          </div>
          <span class="menu-label">考核信息</span>
        </div>
      </div>

      <!-- 巡查街道 -->
      <div class="street-section">
        <h3 class="section-title">巡查街道</h3>
        <div class="street-grid">
          <div 
            v-for="street in streets" 
            :key="street"
            class="street-btn"
            @click="selectStreet(street)"
          >
            {{ street }}
          </div>
        </div>
      </div>

      <!-- 任务描述 -->
      <div class="task-info-card">
        <div class="info-row">
          <div class="info-label">
            <EditOutlined style="color: #1890ff; margin-right: 8px;" />
            <span>任务描述:</span>
          </div>
          <div class="info-content task-desc">
            {{ taskInfo.description }}
          </div>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <div class="info-label">
            <BuildOutlined style="color: #1890ff; margin-right: 8px;" />
            <span>公司:</span>
          </div>
          <div class="info-content">{{ taskInfo.company }}</div>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <div class="info-label">
            <EnvironmentOutlined style="color: #722ed1; margin-right: 8px;" />
            <span>片区:</span>
          </div>
          <div class="info-content">{{ taskInfo.district }}</div>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <div class="info-label">
            <FlagOutlined style="color: #722ed1; margin-right: 8px;" />
            <span>任务状态:</span>
          </div>
          <div class="info-content">{{ taskInfo.status }}</div>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <div class="info-label">
            <ClusterOutlined style="color: #52c41a; margin-right: 8px;" />
            <span>任务类型:</span>
          </div>
          <div class="info-content">{{ taskInfo.type }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LeftOutlined,
  FilterOutlined,
  SearchOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HistoryOutlined,
  AppstoreOutlined,
  EditOutlined,
  BuildOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  ClusterOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 搜索关键词
const searchKeyword = ref('')

// 巡查街道列表
const streets = ref([
  '民丰路', '安诚路', '洛浦路', '塔山路',
  '安德路', '静普路', '米泉路', '昌吉路',
  '安驰路', '墨玉路', '泽普路', '安勇路',
  '博园路', '昌吉路', '安礼路', '墨玉南路',
  '阜康路', '出镇管', '宝安公路', '于田路',
  '于塘南路', '安智路', '和静路'
])

// 任务信息
const taskInfo = ref({
  description: '墨玉南路;于塘南路;于田路;民丰路;米泉路;昌吉路;阜康路;泽普路;和静路;洛浦路;塔山路;静普路;墨玉路;安礼路;安勇路;安城路;安智路;安德路;出镇管;博园路;昌吉路;安驰路;宝安公路;',
  company: '城建公司三分区',
  district: '区属',
  status: '已完成',
  type: '管网巡查'
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 搜索处理
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
  // TODO: 实现搜索功能
}

// 功能菜单点击
const handleFunctionClick = (type: string) => {
  console.log('点击功能:', type)
  // TODO: 跳转到对应功能页面
}

// 选择街道
const selectStreet = (street: string) => {
  console.log('选择街道:', street)
  // TODO: 实现街道选择功能
}

onMounted(() => {
  // 可以从路由参数获取任务ID等信息
  const taskId = route.query.id
  if (taskId) {
    console.log('任务ID:', taskId)
    // TODO: 根据任务ID加载详细信息
  }
})
</script>

<style scoped lang="scss">
.mobile-patrol-detail {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;

  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    background: #f5f7fa;
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

    // 搜索栏
    .search-bar {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: #fff;
      margin-bottom: 12px;

      .search-input {
        flex: 1;
        height: 40px;
        padding: 0 16px;
        border: 2px solid #ff4d4f;
        border-radius: 20px;
        font-size: 14px;
        outline: none;
        transition: all 0.3s;

        &::placeholder {
          color: #999;
        }

        &:focus {
          border-color: #ff7875;
        }
      }

      .search-btn {
        padding: 0 24px;
        height: 40px;
        background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
        color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: linear-gradient(135deg, #ff7875 0%, #ffa39e 100%);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }

    // 功能菜单
    .function-menu {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding: 16px;
      background: #fff;
      margin-bottom: 12px;
      border-radius: 8px;

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
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

          &.blue {
            background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
          }

          &.orange {
            background: linear-gradient(135deg, #fa541c 0%, #ff7a45 100%);
          }

          &.orange-light {
            background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
          }

          &.yellow {
            background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
          }
        }

        .menu-label {
          font-size: 12px;
          color: #333;
          text-align: center;
        }
      }
    }

    // 巡查街道
    .street-section {
      padding: 16px;
      background: #fff;
      margin-bottom: 12px;
      border-radius: 8px;

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 16px 0;
      }

      .street-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;

        .street-btn {
          padding: 10px 8px;
          background: linear-gradient(135deg, #91d5ff 0%, #69c0ff 100%);
          color: #fff;
          border: none;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          box-shadow: 0 2px 4px rgba(105, 192, 255, 0.3);

          &:hover {
            background: linear-gradient(135deg, #69c0ff 0%, #40a9ff 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(105, 192, 255, 0.4);
          }

          &:active {
            transform: scale(0.95);
          }
        }
      }
    }

    // 任务信息卡片
    .task-info-card {
      background: #fff;
      padding: 16px;
      border-radius: 8px;

      .info-row {
        display: flex;
        align-items: flex-start;
        padding: 12px 0;

        .info-label {
          display: flex;
          align-items: center;
          font-size: 15px;
          font-weight: 600;
          color: #333;
          min-width: 100px;
          flex-shrink: 0;

          :deep(.anticon) {
            font-size: 18px;
          }
        }

        .info-content {
          flex: 1;
          font-size: 14px;
          color: #666;
          line-height: 1.6;

          &.task-desc {
            color: #333;
            font-weight: 500;
          }
        }
      }

      .divider {
        height: 1px;
        background: #f0f0f0;
        margin: 0;
      }
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .mobile-patrol-detail {
    .mobile-container {
      box-shadow: none;
    }
  }
}
</style>
