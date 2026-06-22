<template>
  <div class="drainage-map-fullscreen">
    <div class="image-wrapper">
      <img :src="currentImage" alt="建德市排水系统图" class="map-image" />
      
      <!-- 养护地图按钮热区 -->
      <div class="hotspot hotspot-yh-map" @click="switchView('yhdt')" title="养护地图"></div>
      <!-- 管网地图按钮热区 -->
      <div class="hotspot hotspot-gw-map" @click="switchView('gwdt')" title="管网地图"></div>

      <a-button class="back-btn" @click="goBack" type="primary">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        返回系统
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import jscGwdt from '@/assets/jsc-gwdt.jpg'
import jscYhdt from '@/assets/jsc-yhdt.jpg'

const router = useRouter()
const currentView = ref<'gwdt' | 'yhdt'>('gwdt')

const currentImage = computed(() => {
  return currentView.value === 'gwdt' ? jscGwdt : jscYhdt
})

const switchView = (view: 'gwdt' | 'yhdt') => {
  currentView.value = view
}

const goBack = () => {
  router.push('/workbench')
}
</script>

<style scoped lang="scss">
.drainage-map-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
}

.image-wrapper {
  position: relative;
  width: 100%;
  // 图片比例 3456:1640 ≈ 2.1:1
  aspect-ratio: 3456 / 1640;
}

.map-image {
  width: 100%;
  height: 100%;
  display: block;
}

.hotspot {
  position: absolute;
  cursor: pointer;
  z-index: 5;
  border-radius: 4px;
  transition: background 0.2s;

  // 调试用：取消注释可查看热区位置
  // border: 2px solid rgba(255, 0, 0, 0.5);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    background: rgba(255, 255, 255, 0.25);
  }
}

// 养护地图 - 在顶部导航栏，"管网地图"右侧
.hotspot-yh-map {
  top: 1.5%;
  left: 27%;
  width: 5.5%;
  height: 4.5%;
}

// 管网地图 - 在顶部导航栏最左侧
.hotspot-gw-map {
  top: 1.5%;
  left: 20%;
  width: 5.5%;
  height: 4.5%;
}

.back-btn {
  position: absolute;
  top: 2%;
  right: 1.5%;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(24, 144, 255, 0.8);
  }
}
</style>
