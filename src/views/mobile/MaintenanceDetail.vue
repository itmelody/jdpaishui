<template>
  <div class="maintenance-detail">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">养护详情</div>
        <div class="header-placeholder"></div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="输入道路或小区名称搜索"
            class="search-input"
          />
          <button class="search-btn">搜索</button>
        </div>
      </div>

      <!-- 功能图标网格 -->
      <div class="function-grid">
        <div 
          v-for="(func, index) in functions" 
          :key="index"
          class="function-item"
          @click="handleFunctionClick(func)"
        >
          <div class="icon-circle" :style="{ background: func.color }">
            <component :is="func.icon" style="font-size: 28px; color: #fff;" />
          </div>
          <span class="function-name">{{ func.name }}</span>
        </div>
      </div>

      <!-- 进度条卡片 -->
      <div class="progress-card">
        <div class="card-header">
          <span class="label">雨水口</span>
          <span class="value">计划：{{ taskData.planCount }} | 实际：{{ taskData.actualCount }}</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(taskData.actualCount / taskData.planCount) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 任务详情列表 -->
      <div class="detail-list">
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #1890ff;">A</span>
            <span>位置</span>
          </div>
          <div class="item-value">{{ taskData.location }}</div>
        </div>
        
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #52c41a;"></span>
            <span>公司</span>
          </div>
          <div class="item-value">{{ taskData.company }}</div>
        </div>
        
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #722ed1;">📍</span>
            <span>片区</span>
          </div>
          <div class="item-value">{{ taskData.district }}</div>
        </div>
        
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #faad14;">⭐</span>
            <span>任务状态</span>
          </div>
          <div class="item-value">{{ taskData.taskStatus }}</div>
        </div>
        
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #f5222d;">⭐</span>
            <span>抽检状态</span>
          </div>
          <div class="item-value">{{ taskData.checkStatus }}</div>
        </div>
        
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #13c2c2;">🌿</span>
            <span>任务子类</span>
          </div>
          <div class="item-value">{{ taskData.taskSubtype }}</div>
        </div>
        
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #eb2f96;">🌿</span>
            <span>管网类型</span>
          </div>
          <div class="item-value">{{ taskData.pipeType }}</div>
        </div>
        
        <div class="detail-item">
          <div class="item-label">
            <span class="label-icon" style="background: #fa8c16;">🌿</span>
            <span>养护类型</span>
          </div>
          <div class="item-value">
            {{ taskData.maintenanceType }}
            <EditOutlined style="color: #999; margin-left: 8px; cursor: pointer;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LeftOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  DropboxOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
  EditOutlined,
  ToolOutlined,
  HomeFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 搜索关键词
const searchKeyword = ref('')

// 功能图标数据
const functions = [
  { name: '任务签到', icon: CalendarOutlined, color: '#b37feb' },
  { name: '添加井室', icon: PlusCircleOutlined, color: '#52c41a' },
  { name: '添加管道', icon: DropboxOutlined, color: '#faad14' },
  { name: '辅助作业', icon: DropboxOutlined, color: '#1890ff' },
  { name: '暂停任务', icon: ToolOutlined, color: '#fa8c16' },
  { name: '完成任务', icon: CheckCircleOutlined, color: '#f5222d' },
  { name: '事件上报', icon: QuestionCircleOutlined, color: '#fa8c16' },
  { name: '考核信息', icon: FileTextOutlined, color: '#52c41a' },
  { name: '日常抽检', icon: SearchOutlined, color: '#fa8c16' },
  { name: '养护记录', icon: EditOutlined, color: '#fa8c16' }
]

// 任务数据
const taskData = ref({
  location: '高潮路 (丰华路-武都路)',
  company: '安亭建筑',
  district: '江桥镇',
  taskStatus: '进行中',
  checkStatus: '待申请抽检',
  taskSubtype: '市政',
  pipeType: '雨水',
  maintenanceType: '常规养护',
  planCount: 97,
  actualCount: 102
})

// 处理功能点击
const handleFunctionClick = (func: any) => {
  console.log('点击功能:', func.name)
  // TODO: 实现具体功能
}

// 返回上一页
const goBack = () => {
  router.back()
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
.maintenance-detail {
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

      .header-placeholder {
        width: 40px;
      }
    }

    // 搜索栏
    .search-bar {
      background: #fff;
      padding: 12px 16px;
      border-bottom: 1px solid #e8e8e8;

      .search-input-wrapper {
        display: flex;
        align-items: center;
        background: #fff;
        border: 2px solid #ff4d4f;
        border-radius: 24px;
        overflow: hidden;

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 8px 16px;
          font-size: 14px;
          color: #333;

          &::placeholder {
            color: #999;
          }
        }

        .search-btn {
          padding: 8px 20px;
          background: #ff4d4f;
          color: #fff;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: #ff7875;
          }
        }
      }
    }

    // 功能图标网格
    .function-grid {
      background: #fff;
      padding: 24px 16px;
      margin: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;

      .function-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.05);
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .function-name {
          font-size: 13px;
          color: #333;
          text-align: center;
          line-height: 1.3;
        }
      }
    }

    // 进度条卡片
    .progress-card {
      background: #fff;
      padding: 20px;
      margin: 0 16px 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .label {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .value {
          font-size: 14px;
          color: #666;
        }
      }

      .progress-bar {
        width: 100%;
        height: 12px;
        background: linear-gradient(to right, #b37feb 0%, #1890ff 100%);
        border-radius: 6px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          transition: width 0.3s ease;
        }
      }
    }

    // 任务详情列表
    .detail-list {
      background: #fff;
      margin: 0 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      overflow: hidden;

      .detail-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .item-label {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;

          .label-icon {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
          }

          span:last-child {
            font-size: 14px;
            color: #666;
          }
        }

        .item-value {
          flex: 1;
          font-size: 14px;
          color: #1a1a1a;
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .maintenance-detail {
    .mobile-container {
      box-shadow: none;
    }
  }
}
</style>
