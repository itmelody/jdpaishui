<template>
  <div class="digital-management">
    <!-- 移动端容器 -->
    <div class="mobile-container">
      <!-- 背景网格 -->
      <div class="bg-grid"></div>
      
      <!-- 主要内容 -->
      <div class="main-content">
      <!-- 返回按钮 -->
      <div class="back-button" @click="goBack">
        <LeftOutlined style="font-size: 24px;" />
      </div>
      
      <!-- Logo和标题 -->
      <div class="header-section">
        <div class="logo-container">
          <div class="logo-icon">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <circle cx="50" cy="50" r="45" fill="url(#gradient1)" opacity="0.8"/>
              <path d="M30 50 Q50 20 70 50 T30 50" fill="none" stroke="#fff" stroke-width="3"/>
              <text x="50" y="60" text-anchor="middle" fill="#fff" font-size="24" font-weight="bold">水</text>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#0099ff;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <h1 class="main-title">数字管养智慧运营</h1>
        <p class="sub-title">HANG-ZHOU-JIAN-DE</p>
      </div>

      <!-- 功能模块 -->
      <div class="modules-container">
        <div 
          v-for="(module, index) in modules" 
          :key="index"
          class="module-item"
          :class="'position-' + (index + 1)"
          @click="handleModuleClick(module)"
        >
          <div class="module-circle">
            <div class="circle-glow"></div>
            <component :is="module.icon" :style="{ fontSize: '40px', color: '#00d4ff' }" />
          </div>
          <span class="module-label">{{ module.label }}</span>
        </div>
      </div>

        <!-- 底部版权信息 -->
        <div class="footer-info">
          <p class="organization">建德水务</p>
          <p class="support">技术支持：浙江省公众信息产业有限公司</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ThunderboltOutlined,
  GlobalOutlined,
  ToolOutlined,
  SearchOutlined,
  SettingOutlined,
  DatabaseOutlined,
  LeftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 功能模块数据
const modules = [
  { name: 'monitor', label: '监测预警', icon: ThunderboltOutlined },
  { name: 'map', label: '地图应用', icon: GlobalOutlined },
  { name: 'hardware', label: '硬件运维', icon: ToolOutlined },
  { name: 'inspection', label: '巡检养护', icon: SearchOutlined },
  { name: 'settings', label: '系统设置', icon: SettingOutlined },
  { name: 'survey', label: '混接普查', icon: DatabaseOutlined }
]

// 处理模块点击
const handleModuleClick = (module: any) => {
  console.log('点击模块:', module.label)
  
  // 如果是巡检养护，跳转到已开发的mobile-inspection页面
  if (module.name === 'inspection') {
    router.push('/mobile-inspection')
  } else if (module.name === 'map') {
    // 如果是地图应用，跳转到地图详情页
    router.push('/map-application')
  } else {
    // 其他模块显示开发中提示
    alert(`${module.label}功能正在开发中...`)
  }
}

// 返回登录页
const goBack = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.digital-management {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  overflow: hidden;
  display: flex;
  justify-content: center;

  // 移动端容器
  .mobile-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    margin: 0 auto;
    background: linear-gradient(135deg, #0a1e3c 0%, #1e3c72 50%, #2a5298 100%);
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 212, 255, 0.1);
    border-left: 1px solid rgba(0, 212, 255, 0.3);
    border-right: 1px solid rgba(0, 212, 255, 0.3);
    overflow: hidden;

    // 背景网格
    .bg-grid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
      background-size: 40px 40px;
      transform: perspective(500px) rotateX(60deg);
      transform-origin: center top;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 0 40px;
      }
    }

    // 主要内容
    .main-content {
      position: relative;
      z-index: 1;
      width: 100%;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;

      // 返回按钮
      .back-button {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #fff;
        z-index: 10;

        &:hover {
          background: rgba(0, 212, 255, 0.2);
          border-color: rgba(0, 212, 255, 0.6);
          transform: scale(1.1);
        }
      }

      // Logo和标题区域
      .header-section {
        text-align: center;
        margin-bottom: 60px;
        margin-top: 40px;

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;

          .logo-icon {
            width: 100px;
            height: 100px;
            position: relative;
            animation: float 3s ease-in-out infinite;

            .logo-svg {
              width: 100%;
              height: 100%;
              filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.5));
            }
          }
        }

        .main-title {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 16px 0;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
          letter-spacing: 4px;
        }

        .sub-title {
          font-size: 18px;
          color: #00d4ff;
          margin: 0;
          letter-spacing: 2px;
          font-weight: 500;
        }
      }

      // 功能模块容器
      .modules-container {
        position: relative;
        width: 100%;
        height: 400px;
        margin-bottom: 60px;

        .module-item {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.1);

            .module-circle {
              box-shadow: 0 0 30px rgba(0, 212, 255, 0.8);
            }
          }

          // 位置布局 - 六边形分布
          &.position-1 {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          &.position-2 {
            top: 60px;
            right: 30px;
          }

          &.position-3 {
            bottom: 60px;
            right: 30px;
          }

          &.position-4 {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          &.position-5 {
            bottom: 60px;
            left: 30px;
          }

          &.position-6 {
            top: 60px;
            left: 30px;
          }

          .module-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, rgba(0, 153, 255, 0.1) 100%);
            border: 2px solid rgba(0, 212, 255, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin-bottom: 12px;
            transition: all 0.3s ease;

            .circle-glow {
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
              animation: pulse 2s ease-in-out infinite;
            }

            :deep(.anticon) {
              position: relative;
              z-index: 1;
            }
          }

          .module-label {
            font-size: 16px;
            color: #fff;
            font-weight: 500;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
          }
        }
      }

      // 底部版权信息
      .footer-info {
        text-align: center;
        margin-top: auto;
        padding-bottom: 20px;

        .organization {
          font-size: 16px;
          color: #fff;
          margin: 0 0 8px 0;
          font-weight: 500;
        }

        .support {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
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

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

// 响应式适配
@media (max-width: 480px) {
  .digital-management {
    background: linear-gradient(135deg, #0a1e3c 0%, #1e3c72 50%, #2a5298 100%);
    
    .mobile-container {
      max-width: 100%;
      box-shadow: none;
      background: transparent;
      border: none;

      .main-content {
        .header-section {
          .main-title {
            font-size: 28px;
          }

          .sub-title {
            font-size: 14px;
          }
        }

        .modules-container {
          height: 350px;

          .module-item {
            .module-circle {
              width: 80px;
              height: 80px;
            }

            .module-label {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
