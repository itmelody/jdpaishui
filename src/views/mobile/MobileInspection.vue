<template>
  <div class="mobile-inspection">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="mobile-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">巡查养护</div>
        <div class="header-placeholder"></div>
      </div>

      <!-- 开发中内容 -->
      <div class="development-content">
        <div class="dev-icon">
          <ToolOutlined style="font-size: 80px; color: #52c41a;" />
        </div>
        <h2 class="dev-title">开发中</h2>
        <p class="dev-desc">巡查养护手机端功能正在开发中，敬请期待...</p>
        <a-button type="primary" size="large" @click="goBack" class="back-btn">
          返回登录页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LeftOutlined, ToolOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goBack = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.mobile-inspection {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;

  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    background: #fff;
    position: relative;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

    // 顶部导航栏
    .mobile-header {
      height: 56px;
      background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
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

    // 开发中内容区域
    .development-content {
      padding: 60px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 56px);

      .dev-icon {
        margin-bottom: 30px;
        animation: float 3s ease-in-out infinite;
      }

      .dev-title {
        font-size: 28px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 16px;
      }

      .dev-desc {
        font-size: 14px;
        color: #666;
        text-align: center;
        line-height: 1.6;
        margin-bottom: 40px;
      }

      .back-btn {
        width: 100%;
        max-width: 300px;
        height: 48px;
        font-size: 16px;
        border-radius: 24px;
      }
    }
  }
}

// 浮动动画
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
  .mobile-inspection {
    .mobile-container {
      box-shadow: none;
    }
  }
}
</style>
