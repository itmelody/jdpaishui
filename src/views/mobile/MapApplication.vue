<template>
  <div class="map-application">
    <div class="mobile-container">
      <!-- 顶部搜索栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="search-wrapper">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索地点、要素编码"
            class="search-input"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
      </div>

      <!-- 地图容器 -->
      <div id="mapContainer" class="map-container"></div>

      <!-- 左侧工具按钮 -->
      <div class="left-tools">
        <div class="tool-btn" @click="handleMeasure" title="测量">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h2v4h2V8h2v4h2V8h2v4h2V8h2v4h2V8h2v8z"/>
          </svg>
        </div>
        <div class="tool-btn" @click="handleLayerSwitch" title="图层切换">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
          </svg>
        </div>
        <div class="tool-btn" @click="handleLocate" title="定位">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        </div>
      </div>

      <!-- 右侧工具按钮 -->
      <div class="right-tools">
        <div class="tool-btn" @click="handleLayers" title="图层">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
          </svg>
          <span class="tool-label">图层</span>
        </div>
        <div class="tool-btn" @click="handleSketch" title="草图">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          <span class="tool-label">草图</span>
        </div>
        <div class="tool-btn" @click="handleSettings" title="设置">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          <span class="tool-label">设置</span>
        </div>
      </div>

      <!-- 比例尺 -->
      <div class="scale-bar">
        <div class="scale-line"></div>
        <span class="scale-text">20 m</span>
      </div>

      <!-- 底部查询结果面板 -->
      <div class="bottom-panel" :class="{ 'expanded': panelExpanded }">
        <div class="panel-header" @click="togglePanel">
          <div class="panel-title">
            <span class="title-text">查询结果</span>
            <span class="result-count">/{{ resultCount }}个</span>
          </div>
          <div class="close-btn" @click.stop="closePanel">
            <CloseCircleOutlined />
          </div>
        </div>
        
        <div class="panel-content" v-if="panelExpanded">
          <!-- 结果列表 -->
          <div class="result-list">
            <div 
              v-for="(result, index) in searchResults" 
              :key="index"
              class="result-item"
              @click="selectResult(result)"
              :class="{ 'selected': selectedResult === result }"
            >
              <div class="result-number">{{ index + 1 }}</div>
              <div class="result-info">
                <div class="result-name">{{ result.name }}</div>
              </div>
            </div>
          </div>

          <!-- Tab切换 -->
          <div class="tab-buttons">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'attribute' }"
              @click="activeTab = 'attribute'"
            >
              属性信息
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'inspection' }"
              @click="activeTab = 'inspection'"
            >
              检查信息
            </button>
          </div>

          <!-- 详细信息 -->
          <div class="detail-info" v-if="selectedResult">
            <div class="info-row">
              <span class="label">要素编码</span>
              <span class="value">{{ selectedResult.code }}</span>
            </div>
            <div class="info-row">
              <span class="label">起点编码</span>
              <span class="value">{{ selectedResult.startCode }}</span>
            </div>
            <div class="info-row">
              <span class="label">终点编码</span>
              <span class="value">{{ selectedResult.endCode }}</span>
            </div>
            <div class="info-row">
              <span class="label">归属</span>
              <span class="value">{{ selectedResult.affiliation }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import AMapLoader from '@amap/amap-jsapi-loader'

// 声明全局AMap类型
declare global {
  interface Window {
    AMap: any
  }
}

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 面板状态
const panelExpanded = ref(true)
const resultCount = ref(1)

// Tab状态
const activeTab = ref<'attribute' | 'inspection'>('attribute')

// 搜索结果
const searchResults = ref([
  {
    name: '污水管',
    code: 'JDWS015024-JDWS015023',
    startCode: 'JDWS015024',
    endCode: 'JDWS015023',
    affiliation: '市政',
    lat: 30.123456,
    lng: 120.123456
  }
])

// 选中的结果
const selectedResult = ref(searchResults.value[0])

// 地图实例
let map: any = null

// 初始化高德地图
const initMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: '11ff1e3bd0d19646144e5c8e116d486c', // 需要替换为实际的高德地图Key
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar']
    })

    // 创建地图实例
    map = new AMap.Map('mapContainer', {
      zoom: 15,
      center: [120.123456, 30.123456], // 建德市大致坐标
      viewMode: '2D',
      mapStyle: 'amap://styles/normal'
    })

    // 添加比例尺控件
    map.addControl(new AMap.Scale())

    // 添加工具条控件
    map.addControl(new AMap.ToolBar())

    // 绘制管网线路（示例）
    drawPipeNetwork(map)

  } catch (error) {
    console.error('地图加载失败:', error)
    alert('地图加载失败，请检查网络连接或稍后重试')
  }
}

// 绘制管网线路（示例数据）
const drawPipeNetwork = (mapInstance: any) => {
  const AMap = window.AMap
  
  // 示例：绘制蓝色管线
  const blueLine = new AMap.Polyline({
    path: [
      [120.123456, 30.123456],
      [120.124456, 30.124456],
      [120.125456, 30.125456]
    ],
    strokeColor: '#1890ff',
    strokeWeight: 4,
    strokeOpacity: 0.8,
    showDir: true
  })
  
  // 示例：绘制橙色管线
  const orangeLine = new AMap.Polyline({
    path: [
      [120.122456, 30.122456],
      [120.123456, 30.123456],
      [120.124456, 30.124456]
    ],
    strokeColor: '#fa8c16',
    strokeWeight: 4,
    strokeOpacity: 0.8,
    showDir: true
  })
  
  // 示例：绘制红色高亮管线
  const redLine = new AMap.Polyline({
    path: [
      [120.123456, 30.123456],
      [120.124456, 30.124456]
    ],
    strokeColor: '#ff4d4f',
    strokeWeight: 6,
    strokeOpacity: 1,
    showDir: true
  })
  
  // 添加到地图
  mapInstance.add([blueLine, orangeLine, redLine])
  
  // 绘制节点标记
  const markers = [
    [120.123456, 30.123456],
    [120.124456, 30.124456],
    [120.125456, 30.125456]
  ]
  
  markers.forEach(([lng, lat]) => {
    const marker = new AMap.Marker({
      position: [lng, lat],
      icon: new AMap.Icon({
        size: new AMap.Size(20, 20),
        image: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="#fff" stroke="#1890ff" stroke-width="2"/>
            <circle cx="10" cy="10" r="4" fill="#1890ff"/>
          </svg>
        `),
        imageSize: new AMap.Size(20, 20)
      })
    })
    mapInstance.add(marker)
  })
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
  if (!searchKeyword.value.trim()) {
    alert('请输入搜索内容')
    return
  }
  
  // TODO: 实现实际的搜索逻辑
  // 这里模拟搜索结果
  panelExpanded.value = true
}

// 切换面板展开/收起
const togglePanel = () => {
  panelExpanded.value = !panelExpanded.value
}

// 关闭面板
const closePanel = () => {
  panelExpanded.value = false
}

// 选择结果
const selectResult = (result: any) => {
  selectedResult.value = result
  console.log('选中结果:', result)
  
  // 在地图上高亮显示选中的管线
  if (map && result.lat && result.lng) {
    map.setCenter([result.lng, result.lat])
    map.setZoom(16)
  }
}

// 左侧工具按钮事件
const handleMeasure = () => {
  console.log('测量工具')
  alert('测量功能开发中...')
}

const handleLayerSwitch = () => {
  console.log('图层切换')
  alert('图层切换功能开发中...')
}

const handleLocate = () => {
  console.log('定位')
  if (map) {
    map.setZoomAndCenter(15, [120.123456, 30.123456])
  }
}

// 右侧工具按钮事件
const handleLayers = () => {
  console.log('图层管理')
  alert('图层管理功能开发中...')
}

const handleSketch = () => {
  console.log('草图')
  alert('草图功能开发中...')
}

const handleSettings = () => {
  console.log('设置')
  alert('设置功能开发中...')
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.destroy()
  }
})
</script>

<style scoped lang="scss">
.map-application {
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
    overflow: hidden;

    // 顶部搜索栏
    .top-header {
      height: 56px;
      background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
      display: flex;
      align-items: center;
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
        margin-right: 12px;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        :deep(.anticon) {
          font-size: 20px;
        }
      }

      .search-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        background: #fff;
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
          background: #1890ff;
          color: #fff;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: #40a9ff;
          }
        }
      }
    }

    // 地图容器
    .map-container {
      position: absolute;
      top: 56px;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    // 左侧工具按钮
    .left-tools {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .tool-btn {
        width: 48px;
        height: 48px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #f0f0f0;
          transform: scale(1.05);
        }

        svg {
          width: 24px;
          height: 24px;
        }
      }
    }

    // 右侧工具按钮
    .right-tools {
      position: absolute;
      right: 16px;
      top: 80px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .tool-btn {
        width: 48px;
        height: 48px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        padding: 4px;

        &:hover {
          background: #f0f0f0;
          transform: scale(1.05);
        }

        svg {
          width: 24px;
          height: 24px;
          margin-bottom: 2px;
        }

        .tool-label {
          font-size: 10px;
          color: #333;
        }
      }
    }

    // 比例尺
    .scale-bar {
      position: absolute;
      left: 16px;
      bottom: 200px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;

      .scale-line {
        width: 60px;
        height: 2px;
        background: #333;
        position: relative;

        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 8px;
          background: #333;
          top: -3px;
        }

        &::before {
          left: 0;
        }

        &::after {
          right: 0;
        }
      }

      .scale-text {
        font-size: 14px;
        color: #333;
        font-weight: 600;
        margin-top: 4px;
      }
    }

    // 底部查询结果面板
    .bottom-panel {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
      z-index: 20;
      transition: transform 0.3s ease;

      &.expanded {
        transform: translateY(0);
      }

      .panel-header {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;

        .panel-title {
          display: flex;
          align-items: baseline;
          gap: 4px;

          .title-text {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
          }

          .result-count {
            font-size: 14px;
            color: #999;
          }
        }

        .close-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          transition: background 0.3s;

          &:hover {
            background: #f5f5f5;
          }

          :deep(.anticon) {
            font-size: 20px;
            color: #999;
          }
        }
      }

      .panel-content {
        max-height: 400px;
        overflow-y: auto;

        // 结果列表
        .result-list {
          padding: 16px;

          .result-item {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #f5f7fa;
            border-radius: 8px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s;

            &.selected {
              background: #e6f7ff;
              border: 2px solid #1890ff;
            }

            &:hover {
              background: #e6f7ff;
            }

            .result-number {
              width: 32px;
              height: 32px;
              background: #ff4d4f;
              color: #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: 600;
              margin-right: 12px;
            }

            .result-info {
              flex: 1;

              .result-name {
                font-size: 16px;
                color: #1a1a1a;
                font-weight: 500;
              }
            }
          }
        }

        // Tab按钮
        .tab-buttons {
          display: flex;
          padding: 0 16px;
          gap: 12px;

          .tab-btn {
            flex: 1;
            padding: 12px;
            background: #f5f7fa;
            border: 2px solid transparent;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
            cursor: pointer;
            transition: all 0.3s;

            &.active {
              background: #e6f7ff;
              border-color: #1890ff;
              color: #1890ff;
              font-weight: 600;
            }

            &:hover:not(.active) {
              background: #e8e8e8;
            }
          }
        }

        // 详细信息
        .detail-info {
          padding: 16px;

          .info-row {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px dashed #e8e8e8;

            &:last-child {
              border-bottom: none;
            }

            .label {
              width: 100px;
              font-size: 14px;
              color: #666;
            }

            .value {
              flex: 1;
              font-size: 14px;
              color: #1a1a1a;
              text-align: right;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .map-application {
    .mobile-container {
      box-shadow: none;
    }
  }
}
</style>
