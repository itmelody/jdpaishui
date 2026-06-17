<template>
  <div class="login-page">
    <!-- 左侧背景区域 -->
    <div class="login-left">
      <div class="login-bg"></div>
      <div class="welcome-content">
        <h1 class="welcome-title">Hi，欢迎进入！</h1>
        <h2 class="welcome-subtitle">建德市城镇排水系统智慧平台</h2>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="login-right">
      <div class="login-container">
        <div class="login-header">
          <h3 class="platform-name">建德市城镇排水系统智慧平台</h3>
          <p class="login-tip">请使用您本人的账号密码登录</p>
        </div>

        <div class="login-buttons">
          <!-- 主管部门系统登录入口 -->
          <a-button 
            type="primary" 
            size="large" 
            class="login-btn main-btn"
            @click="handleDepartmentLogin"
          >
            主管部门系统登录入口 >
          </a-button>

          <!-- 排水管网登录入口 -->
          <a-button 
            type="primary" 
            size="large" 
            class="login-btn secondary-btn"
            @click="handleNetworkLogin"
          >
            <template #icon>
              <ApartmentOutlined />
            </template>
            排水管网登录入口 >
          </a-button>

          <!-- 巡查养护登录入口 -->
          <a-button 
            type="primary" 
            size="large" 
            class="login-btn secondary-btn"
            @click="handleInspectionLogin"
          >
            <template #icon>
              <ToolOutlined />
            </template>
            巡查养护登录入口 >
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ApartmentOutlined, ToolOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 主管部门系统登录 - 跳转到工作台
const handleDepartmentLogin = () => {
  // TODO: 这里可以添加登录验证逻辑
  // 暂时直接跳转到工作台
  router.push('/workbench')
}

// 排水管网登录入口
const handleNetworkLogin = () => {
  console.log('排水管网登录入口')
  // TODO: 后续实现排水管网相关功能
}

// 巡查养护登录入口
const handleInspectionLogin = () => {
  console.log('巡查养护登录入口')
  // TODO: 后续实现巡查养护相关功能
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

// 左侧背景区域
.login-left {
  flex: 1.2;
  position: relative;
  overflow: hidden;

  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #0a1628 0%, #1e3c72 50%, #2a5298 100%);
    background-image: url('@/assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  .welcome-content {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    z-index: 1;
    color: #fff;

    .welcome-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 20px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .welcome-subtitle {
      font-size: 36px;
      font-weight: 600;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
}

// 右侧登录区域
.login-right {
  flex: 1;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  .login-container {
    width: 100%;
    max-width: 480px;

    .login-header {
      margin-bottom: 60px;

      .platform-name {
        font-size: 28px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 16px;
      }

      .login-tip {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }

    .login-buttons {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .login-btn {
        height: 56px;
        font-size: 18px;
        border-radius: 4px;
        transition: all 0.3s ease;

        &.main-btn {
          background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

          &:hover {
            background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
            box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
            transform: translateY(-2px);
          }
        }

        &.secondary-btn {
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);

          &:hover {
            background: linear-gradient(135deg, #73d13d 0%, #52c41a 100%);
            box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
            transform: translateY(-2px);
          }

          :deep(.ant-btn-icon) {
            margin-right: 8px;
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .login-left {
    flex: 1;
  }

  .login-right {
    flex: 1;
  }

  .welcome-content {
    .welcome-title {
      font-size: 36px;
    }

    .welcome-subtitle {
      font-size: 28px;
    }
  }
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-left {
    flex: none;
    height: 300px;

    .welcome-content {
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      .welcome-title {
        font-size: 28px;
      }

      .welcome-subtitle {
        font-size: 22px;
      }
    }
  }

  .login-right {
    flex: 1;
    padding: 20px;

    .login-container {
      .login-header {
        margin-bottom: 40px;

        .platform-name {
          font-size: 22px;
        }
      }

      .login-buttons {
        gap: 16px;

        .login-btn {
          height: 48px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
