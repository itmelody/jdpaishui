<template>
  <div class="network-map-page">
    <!-- 顶部筛选区 -->
    <div class="filter-bar">
      <div class="filter-left">
        <div class="filter-item">
          <label>行政区划</label>
          <a-select v-model:value="filterForm.district" placeholder="请选择" class="filter-select">
            <a-select-option value="建德市">建德市</a-select-option>
            <a-select-option value="杭州市">杭州市</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <label>管网类型</label>
          <a-select v-model:value="filterForm.pipeType" placeholder="请选择" class="filter-select">
            <a-select-option value="污水管网">污水管网</a-select-option>
            <a-select-option value="雨水管网">雨水管网</a-select-option>
            <a-select-option value="合流管网">合流管网</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <label>管网编码</label>
          <a-input v-model:value="filterForm.pipeCode" placeholder="请输入管网编码" class="filter-input" allow-clear />
        </div>
        <div class="filter-item">
          <label>出井编码</label>
          <a-input v-model:value="filterForm.wellCode" placeholder="请输入出井编码" class="filter-input" allow-clear />
        </div>
      </div>
      <div class="filter-right">
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
        <a-button type="primary" @click="handleAnnotation">
          <template #icon><EditOutlined /></template>
          管线标注
        </a-button>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="map-container">
      <div id="network-amap" class="amap-wrapper"></div>

      <!-- 地图模式切换 -->
      <div class="map-mode-switcher">
        <div
          class="mode-btn"
          :class="{ active: mapMode === 'satellite' }"
          @click="switchMapMode('satellite')"
        >
          <PictureOutlined />
          <span>卫星图</span>
        </div>
        <div
          class="mode-btn"
          :class="{ active: mapMode === 'standard' }"
          @click="switchMapMode('standard')"
        >
          <EnvironmentOutlined />
          <span>标准地图</span>
        </div>
      </div>

      <!-- 图例控制面板 -->
      <div class="legend-panel">
        <div class="legend-title">图例控制</div>
        <div class="legend-items">
          <div class="legend-item" @click="toggleLayer('original')">
            <span class="legend-icon original-icon" :class="{ active: layers.original }"></span>
            <span class="legend-label">原始图层</span>
          </div>
          <div class="legend-item" @click="toggleLayer('update')">
            <span class="legend-icon update-icon" :class="{ active: layers.update }"></span>
            <span class="legend-label">更新图层</span>
          </div>
          <div class="legend-item" @click="toggleLayer('pipe')">
            <span class="legend-icon pipe-icon" :class="{ active: layers.pipe }"></span>
            <span class="legend-label">显示管网</span>
          </div>
          <div class="legend-item" @click="toggleLayer('wellGreen')">
            <span class="legend-icon well-green-icon" :class="{ active: layers.wellGreen }"></span>
            <span class="legend-label">显示井盖（污水）</span>
          </div>
          <div class="legend-item" @click="toggleLayer('wellYellow')">
            <span class="legend-icon well-yellow-icon" :class="{ active: layers.wellYellow }"></span>
            <span class="legend-label">显示井盖（雨水）</span>
          </div>
        </div>
      </div>

      <!-- 地图水印 -->
      <div class="map-watermark">电子地图</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { EditOutlined, PictureOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'
import AMapLoader from '@amap/amap-jsapi-loader'

// 筛选表单
const filterForm = reactive({
  district: '建德市',
  pipeType: '污水管网',
  pipeCode: '',
  wellCode: ''
})

// 图层状态
const layers = reactive({
  original: true,
  update: false,
  pipe: true,
  wellGreen: true,
  wellYellow: true
})

// 地图模式
const mapMode = ref<'satellite' | 'standard'>('satellite')

// 地图实例
let mapInstance: any = null
let amapLib: any = null
let markerGroup: any[] = []

// 模拟管网数据
const pipeMarkers = [
  { id: 'P001', name: '污水泵站A', lng: 119.345, lat: 29.485, type: 'pump', code: 'G4012' },
  { id: 'P002', name: '污水泵站B', lng: 119.362, lat: 29.478, type: 'pump', code: 'G6003' },
  { id: 'P003', name: '检查井-001', lng: 119.350, lat: 29.480, type: 'well', code: 'J001' },
  { id: 'P004', name: '检查井-002', lng: 119.355, lat: 29.482, type: 'well', code: 'J002' },
  { id: 'P005', name: '检查井-003', lng: 119.348, lat: 29.476, type: 'well', code: 'J003' },
  { id: 'P006', name: '检查井-004', lng: 119.358, lat: 29.490, type: 'well', code: 'J004' },
  { id: 'P007', name: '排放口-001', lng: 119.340, lat: 29.488, type: 'outfall', code: 'E001' },
  { id: 'P008', name: '排放口-002', lng: 119.365, lat: 29.472, type: 'outfall', code: 'E002' },
  { id: 'P009', name: '污水泵站C', lng: 119.338, lat: 29.492, type: 'pump', code: 'G8010' },
  { id: 'P010', name: '检查井-005', lng: 119.370, lat: 29.485, type: 'well', code: 'J005' }
]

// 模拟管线数据（用于绘制折线）
const pipeLines = [
  { path: [[119.345, 29.485], [119.350, 29.480], [119.355, 29.482]], color: '#1890ff' },
  { path: [[119.355, 29.482], [119.362, 29.478]], color: '#1890ff' },
  { path: [[119.350, 29.480], [119.348, 29.476]], color: '#1890ff' },
  { path: [[119.345, 29.485], [119.340, 29.488]], color: '#1890ff' },
  { path: [[119.362, 29.478], [119.365, 29.472]], color: '#1890ff' },
  { path: [[119.338, 29.492], [119.340, 29.488], [119.345, 29.485]], color: '#1890ff' },
  { path: [[119.355, 29.482], [119.358, 29.490], [119.370, 29.485]], color: '#1890ff' }
]

// 初始化高德地图
const initAMap = async () => {
  const AMap = await AMapLoader.load({
    key: '11ff1e3bd0d19646144e5c8e116d486c',
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Marker', 'AMap.Polyline', 'AMap.InfoWindow']
  })
  
  amapLib = AMap

  mapInstance = new AMap.Map('network-amap', {
    zoom: 13,
    center: [119.35, 29.48],
    layers: [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()],
    viewMode: '2D'
  })

  mapInstance.addControl(new AMap.Scale())
  mapInstance.addControl(new AMap.ToolBar({ position: 'RT' }))

  // 添加管线折线
  addPipeLines(AMap)

  // 添加标记点
  addMarkers(AMap)
}

// 添加管线
const addPipeLines = (AMap: any) => {
  pipeLines.forEach(line => {
    const polyline = new AMap.Polyline({
      path: line.path,
      strokeColor: line.color,
      strokeWeight: 4,
      strokeOpacity: 0.8,
      lineJoin: 'round',
      lineCap: 'round'
    })
    mapInstance.add(polyline)
  })
}

// 添加标记点
const addMarkers = (AMap: any) => {
  pipeMarkers.forEach(marker => {
    const markerColor = getMarkerColor(marker.type)
    const markerContent = document.createElement('div')
    markerContent.style.cssText = `
      width: 28px; height: 28px; border-radius: 50%;
      background: ${markerColor}; border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
    `

    const label = document.createElement('div')
    label.style.cssText = `
      position: absolute; top: -24px; left: 50%; transform: translateX(-50%);
      background: rgba(255,255,255,0.95); padding: 2px 6px; border-radius: 3px;
      font-size: 11px; color: #333; white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    `
    label.textContent = marker.code

    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'position: relative; display: inline-block;'
    wrapper.appendChild(markerContent)
    wrapper.appendChild(label)

    const m = new AMap.Marker({
      position: new AMap.LngLat(marker.lng, marker.lat),
      content: wrapper,
      offset: new AMap.Pixel(-14, -14),
      title: marker.name
    })

    // 信息窗口
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div style="padding: 8px; min-width: 180px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">${marker.name}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">编码：${marker.code}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">类型：${getTypeName(marker.type)}</div>
          <div style="font-size: 12px; color: #666;">坐标：${marker.lng}, ${marker.lat}</div>
        </div>
      `,
      offset: new AMap.Pixel(0, -30)
    })

    m.on('click', () => {
      infoWindow.open(mapInstance, m.getPosition())
    })

    mapInstance.add(m)
    markerGroup.push(m)
  })
}

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'pump': return '#1890ff'
    case 'well': return '#52c41a'
    case 'outfall': return '#faad14'
    default: return '#999'
  }
}

const getTypeName = (type: string) => {
  switch (type) {
    case 'pump': return '泵站'
    case 'well': return '检查井'
    case 'outfall': return '排放口'
    default: return '未知'
  }
}

// 图层切换
const toggleLayer = (layerKey: keyof typeof layers) => {
  layers[layerKey] = !layers[layerKey]
  // TODO: 实际图层显隐逻辑
}

// 切换地图模式
const switchMapMode = (mode: 'satellite' | 'standard') => {
  if (!mapInstance || !amapLib) return
  mapMode.value = mode
  
  if (mode === 'satellite') {
    mapInstance.setLayers([new amapLib.TileLayer.Satellite(), new amapLib.TileLayer.RoadNet()])
  } else {
    mapInstance.setLayers([new amapLib.TileLayer()])
  }
}

// 搜索
const handleSearch = () => {
  // TODO: 根据筛选条件请求接口并更新地图
  console.log('搜索条件:', { ...filterForm })
}

// 重置
const handleReset = () => {
  filterForm.district = '建德市'
  filterForm.pipeType = '污水管网'
  filterForm.pipeCode = ''
  filterForm.wellCode = ''
}

// 管线标注
const handleAnnotation = () => {
  // TODO: 进入管线标注模式
}

onMounted(() => {
  initAMap()
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.destroy()
  }
})
</script>

<style scoped lang="scss">
.network-map-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px - 32px);
  gap: 12px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;

  .filter-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .filter-item {
      display: flex;
      align-items: center;
      gap: 6px;

      label {
        font-size: 13px;
        color: #333;
        white-space: nowrap;
      }

      .filter-select {
        width: 130px;
      }

      .filter-input {
        width: 160px;
      }
    }
  }

  .filter-right {
    display: flex;
    gap: 8px;
  }
}

.map-container {
  flex: 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .amap-wrapper {
    width: 100%;
    height: 100%;
  }

  .legend-panel {
    position: absolute;
    right: 16px;
    bottom: 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 160px;
    z-index: 10;

    .legend-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    .legend-items {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 4px;
        transition: background 0.2s;

        &:hover {
          background: #f5f5f5;
        }

        .legend-icon {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          flex-shrink: 0;
          border: 2px solid transparent;

          &.original-icon {
            background: #1890ff;
            border-radius: 2px;
            &.active { border-color: #1890ff; }
          }

          &.update-icon {
            background: #fa8c16;
            border-radius: 50%;
            &.active { border-color: #fa8c16; }
          }

          &.pipe-icon {
            background: #2f54eb;
            border-radius: 50%;
            &.active { border-color: #2f54eb; }
          }

          &.well-green-icon {
            background: #52c41a;
            border-radius: 50%;
            &.active { border-color: #52c41a; }
          }

          &.well-yellow-icon {
            background: #faad14;
            border-radius: 50%;
            &.active { border-color: #faad14; }
          }
        }

        .legend-label {
          font-size: 12px;
          color: #555;
        }
      }
    }
  }

  .map-watermark {
    position: absolute;
    left: 16px;
    bottom: 16px;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.25);
    z-index: 5;
  }

  .map-mode-switcher {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 10;

    .mode-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
      border-right: 1px solid #eee;

      &:last-child {
        border-right: none;
      }

      &:hover {
        background: #f5f5f5;
      }

      &.active {
        background: #1890ff;
        color: #fff;

        &:hover {
          background: #40a9ff;
        }
      }
    }
  }
}
</style>
