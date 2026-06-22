<template>
  <div class="mobile-check">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">排口检查清单</div>
        <div class="header-actions">
          <SearchOutlined class="action-icon" />
          <FilterOutlined class="action-icon" />
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="filter-bar">
        <div class="filter-item">
          <span>所属片区</span>
          <DownOutlined style="margin-left: 8px; font-size: 12px;" />
        </div>
        <div class="filter-item">
          <span>检查单位</span>
          <DownOutlined style="margin-left: 8px; font-size: 12px;" />
        </div>
      </div>

      <!-- 检查列表 -->
      <div class="check-list">
        <div 
          v-for="(item, index) in checkList" 
          :key="index"
          class="check-card"
          @click="handleCheckClick(item)"
        >
          <div class="card-header">
            <h3 class="check-code">{{ item.code }}</h3>
            <span class="check-tag">{{ item.tag }}</span>
          </div>
          <div class="card-body">
            <div class="check-image">
              <img :src="item.image" :alt="item.code" />
            </div>
            <div class="check-info">
              <div class="info-row">
                <span class="label">检查时间：</span>
                <span class="value">{{ item.checkTime }}</span>
              </div>
              <div class="info-row">
                <span class="label">所在河道：</span>
                <span class="value">{{ item.river }}</span>
              </div>
              <div class="info-row">
                <span class="label">检查地址：</span>
                <span class="value">{{ item.address }}</span>
              </div>
            </div>
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
        <div class="nav-item active" @click="navigateTo('inspection')">
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
  DownOutlined,
  CheckCircleOutlined,
  HomeFilled,
  ToolOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 检查列表数据
const checkList = ref([
  {
    code: 'JDYS067206',
    tag: '雨水井',
    image: new URL('@/assets/jiancha1.jpg', import.meta.url).href,
    checkTime: '06-20 08:52',
    river: '启宁路',
    address: '中国上海市嘉定区徐行镇启悦路233号'
  },
  {
    code: 'JDYS073449',
    tag: '雨水井',
    image: new URL('@/assets/jiancha2.jpg', import.meta.url).href,
    checkTime: '06-16 07:27',
    river: '新建一路',
    address: '中国上海市嘉定区徐行镇X178(新建一路)'
  },
  {
    code: 'JDYS045329',
    tag: '雨水井',
    image: new URL('@/assets/jiancha3.jpg', import.meta.url).href,
    checkTime: '05-22 14:58',
    river: '宝凤路',
    address: '中国上海市嘉定区徐行镇宝凤路518号'
  },
  {
    code: 'JDYS068604',
    tag: '雨水井',
    image: new URL('@/assets/jiancha4.jpg', import.meta.url).href,
    checkTime: '06-18 06:37',
    river: '永新路',
    address: '中国上海市嘉定区徐行镇武乡路205座'
  },
  {
    code: 'SHYF222YS002PK',
    tag: '雨水井',
    image: new URL('@/assets/jiancha5.jpg', import.meta.url).href,
    checkTime: '06-14 08:15',
    river: '新建二路',
    address: '中国上海市嘉定区徐行镇新建二路375'
  }
])

// 处理检查项点击
const handleCheckClick = (item: any) => {
  router.push({
    path: '/check-detail',
    query: {
      code: item.code,
      river: item.river,
      address: item.address
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
.mobile-check {
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

        &:hover {
          background: #e8e8e8;
        }
      }
    }

    // 检查列表
    .check-list {
      padding: 16px;
      min-height: calc(100vh - 56px - 52px - 60px);
      overflow-y: auto;

      .check-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;

          .check-code {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
          }

          .check-tag {
            padding: 4px 12px;
            background: #1890ff;
            color: #fff;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
          }
        }

        .card-body {
          display: flex;
          padding: 16px;
          gap: 16px;

          .check-image {
            width: 120px;
            height: 120px;
            border-radius: 4px;
            overflow: hidden;
            flex-shrink: 0;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .check-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .info-row {
              display: flex;
              font-size: 14px;
              line-height: 1.5;

              .label {
                color: #666;
                white-space: nowrap;
              }

              .value {
                color: #1a1a1a;
                flex: 1;
              }
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
  .mobile-check {
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
