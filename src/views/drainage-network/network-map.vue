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
        <div class="legend-section">
          <div class="legend-section-title">管网图层</div>
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
        <div class="legend-section">
          <div class="legend-section-title">设施图层</div>
          <div class="legend-items">
            <div class="legend-item" @click="toggleLayer('plant')">
              <span class="legend-icon plant-icon" :class="{ active: layers.plant }"></span>
              <span class="legend-label">污水厂</span>
            </div>
            <div class="legend-item" @click="toggleLayer('pumpStation')">
              <span class="legend-icon pump-icon" :class="{ active: layers.pumpStation }"></span>
              <span class="legend-label">泵站</span>
            </div>
            <div class="legend-item" @click="toggleLayer('drainageUser')">
              <span class="legend-icon user-icon" :class="{ active: layers.drainageUser }"></span>
              <span class="legend-label">排水户</span>
            </div>
            <div class="legend-item" @click="toggleLayer('community')">
              <span class="legend-icon community-icon" :class="{ active: layers.community }"></span>
              <span class="legend-label">小区</span>
            </div>
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
  wellYellow: true,
  plant: true,
  pumpStation: true,
  drainageUser: true,
  community: true
})

// 地图模式
const mapMode = ref<'satellite' | 'standard'>('satellite')

// 地图实例
let mapInstance: any = null
let amapLib: any = null
let markerGroup: any[] = []
let layerMarkers: Record<string, any[]> = {
  pipe: [],
  plant: [],
  pumpStation: [],
  drainageUser: [],
  community: []
}

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

// 模拟污水厂数据
const plantMarkers = [
  { id: 'PL001', name: '建德污水处理有限公司', lng: 119.352, lat: 29.488, code: 'PL-001', capacity: '5万吨/日', status: '正常运行', address: '建德市新安江街道', contact: '0571-64712345' },
  { id: 'PL002', name: '大洋污水处理厂', lng: 119.420, lat: 29.430, code: 'PL-002', capacity: '2万吨/日', status: '正常运行', address: '建德市大洋镇', contact: '0571-64581234' },
  { id: 'PL003', name: '李家污水处理厂', lng: 119.280, lat: 29.510, code: 'PL-003', capacity: '1.5万吨/日', status: '正常运行', address: '建德市李家镇', contact: '0571-64591234' },
  { id: 'PL004', name: '寿昌污水处理厂', lng: 119.230, lat: 29.390, code: 'PL-004', capacity: '1万吨/日', status: '维护中', address: '建德市寿昌镇', contact: '0571-64561234' }
]

// 模拟泵站数据
const pumpStationMarkers = [
  { id: 'PS001', name: '桥北泵站', lng: 119.348, lat: 29.492, code: 'PS-001', pumpCount: 4, buildYear: '2021-11', status: '运行中', address: '新安江街道桥北路', flow: '320 m³/h' },
  { id: 'PS002', name: '溪头泵站', lng: 119.365, lat: 29.475, code: 'PS-002', pumpCount: 4, buildYear: '2022-05', status: '运行中', address: '梅城镇溪头路', flow: '185 m³/h' },
  { id: 'PS003', name: '桥南泵站', lng: 119.355, lat: 29.468, code: 'PS-003', pumpCount: 3, buildYear: '2009-03', status: '运行中', address: '寿昌镇桥南路', flow: '280 m³/h' },
  { id: 'PS004', name: '洋安泵站', lng: 119.338, lat: 29.498, code: 'PS-004', pumpCount: 3, buildYear: '2013-06', status: '报警', address: '更楼街道洋安路', flow: '150 m³/h' },
  { id: 'PS005', name: '洋溪泵站', lng: 119.372, lat: 29.485, code: 'PS-005', pumpCount: 3, buildYear: '2020-10', status: '运行中', address: '乾潭镇洋溪路', flow: '200 m³/h' },
  { id: 'PS006', name: '半岛泵站', lng: 119.342, lat: 29.478, code: 'PS-006', pumpCount: 3, buildYear: '2014-04', status: '预警', address: '大洋镇半岛路', flow: '165 m³/h' },
  { id: 'PS007', name: '电厂泵站', lng: 119.360, lat: 29.495, code: 'PS-007', pumpCount: 4, buildYear: '2014-06', status: '运行中', address: '三都镇电厂路', flow: '350 m³/h' },
  { id: 'PS008', name: '江村埠泵站', lng: 119.335, lat: 29.482, code: 'PS-008', pumpCount: 3, buildYear: '2009-03', status: '运行中', address: '新安江街道江村埠', flow: '120 m³/h' }
]

// 模拟排水户数据
const drainageUserMarkers = [
  { id: 'DU001', name: '建德市第一人民医院', lng: 119.350, lat: 29.483, code: 'DU-001', type: '医疗机构', discharge: '120 m³/d', permitNo: 'JP-2024-001', status: '正常' },
  { id: 'DU002', name: '建德中学', lng: 119.358, lat: 29.480, code: 'DU-002', type: '教育机构', discharge: '80 m³/d', permitNo: 'JP-2024-002', status: '正常' },
  { id: 'DU003', name: '新安江商业广场', lng: 119.345, lat: 29.476, code: 'DU-003', type: '商业综合体', discharge: '200 m³/d', permitNo: 'JP-2024-003', status: '预警' },
  { id: 'DU004', name: '建德市工业园区', lng: 119.368, lat: 29.488, code: 'DU-004', type: '工业企业', discharge: '500 m³/d', permitNo: 'JP-2024-004', status: '正常' },
  { id: 'DU005', name: '梅城古镇景区', lng: 119.375, lat: 29.470, code: 'DU-005', type: '旅游景区', discharge: '150 m³/d', permitNo: 'JP-2024-005', status: '正常' },
  { id: 'DU006', name: '建德市农贸市场', lng: 119.340, lat: 29.486, code: 'DU-006', type: '农贸市场', discharge: '60 m³/d', permitNo: 'JP-2024-006', status: '报警' }
]

// 模拟小区数据
const communityMarkers = [
  { id: 'CM001', name: '新安花园小区', lng: 119.353, lat: 29.486, code: 'CM-001', households: 856, buildYear: '2015', pipeType: '雨污分流', status: '正常' },
  { id: 'CM002', name: '明珠花园', lng: 119.347, lat: 29.479, code: 'CM-002', households: 620, buildYear: '2010', pipeType: '雨污分流', status: '正常' },
  { id: 'CM003', name: '府西小区', lng: 119.360, lat: 29.483, code: 'CM-003', households: 430, buildYear: '2008', pipeType: '合流制', status: '预警' },
  { id: 'CM004', name: '玫瑰园小区', lng: 119.342, lat: 29.490, code: 'CM-004', households: 1200, buildYear: '2018', pipeType: '雨污分流', status: '正常' },
  { id: 'CM005', name: '沧滩社区', lng: 119.365, lat: 29.476, code: 'CM-005', households: 380, buildYear: '2005', pipeType: '合流制', status: '正常' },
  { id: 'CM006', name: '岭后社区', lng: 119.338, lat: 29.484, code: 'CM-006', households: 520, buildYear: '2012', pipeType: '雨污分流', status: '正常' },
  { id: 'CM007', name: '金桥小区', lng: 119.355, lat: 29.472, code: 'CM-007', households: 760, buildYear: '2016', pipeType: '雨污分流', status: '报警' }
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
    zoom: 15,
    center: [119.35, 29.48],
    layers: [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()],
    viewMode: '2D'
  })

  mapInstance.addControl(new AMap.Scale())
  mapInstance.addControl(new AMap.ToolBar({ position: 'RT' }))

  // 添加管线折线
  addPipeLines(AMap)

  // 添加各类标记点
  addMarkers(AMap)
  addPlantMarkers(AMap)
  addPumpStationMarkers(AMap)
  addDrainageUserMarkers(AMap)
  addCommunityMarkers(AMap)
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
    case 'plant': return '#13c2c2'
    case 'pumpStation': return '#eb2f96'
    case 'drainageUser': return '#722ed1'
    case 'community': return '#fa8c16'
    default: return '#999'
  }
}

const getTypeName = (type: string) => {
  switch (type) {
    case 'pump': return '泵站'
    case 'well': return '检查井'
    case 'outfall': return '排放口'
    case 'plant': return '污水厂'
    case 'pumpStation': return '泵站'
    case 'drainageUser': return '排水户'
    case 'community': return '小区'
    default: return '未知'
  }
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  if (status.includes('正常') || status.includes('运行')) return '#52c41a'
  if (status.includes('预警') || status.includes('维护')) return '#faad14'
  if (status.includes('报警')) return '#ff4d4f'
  return '#999'
}

// 创建标记点通用函数
const createMarker = (AMap: any, data: any, layerKey: string, detailFields: { label: string; value: string }[]) => {
  const markerColor = getMarkerColor(layerKey)
  const markerContent = document.createElement('div')
  markerContent.style.cssText = `
    width: 32px; height: 32px; border-radius: 50%;
    background: ${markerColor}; border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; color: #fff; font-weight: 600;
  `
  const icons: Record<string, string> = { plant: '厂', pumpStation: '泵', drainageUser: '户', community: '区' }
  markerContent.textContent = icons[layerKey] || ''

  const label = document.createElement('div')
  label.style.cssText = `
    position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
    background: rgba(255,255,255,0.95); padding: 2px 6px; border-radius: 3px;
    font-size: 11px; color: #333; white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15); max-width: 120px; overflow: hidden; text-overflow: ellipsis;
  `
  label.textContent = data.name

  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'position: relative; display: inline-block;'
  wrapper.appendChild(markerContent)
  wrapper.appendChild(label)

  const m = new AMap.Marker({
    position: new AMap.LngLat(data.lng, data.lat),
    content: wrapper,
    offset: new AMap.Pixel(-16, -16),
    title: data.name
  })

  // 构建详情信息窗口
  let detailHtml = `<div style="padding: 10px; min-width: 240px;">
    <div style="font-weight: 600; font-size: 15px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #eee; color: ${markerColor};">${data.name}</div>`
  detailFields.forEach(f => {
    detailHtml += `<div style="font-size: 12px; color: #666; margin-bottom: 4px; display: flex; justify-content: space-between;">
      <span style="color: #999;">${f.label}：</span><span style="font-weight: 500; color: #333;">${f.value}</span>
    </div>`
  })
  detailHtml += `</div>`

  const infoWindow = new AMap.InfoWindow({
    content: detailHtml,
    offset: new AMap.Pixel(0, -35)
  })

  m.on('click', () => {
    infoWindow.open(mapInstance, m.getPosition())
  })

  mapInstance.add(m)
  layerMarkers[layerKey].push(m)
  markerGroup.push(m)
}

// 添加污水厂标记
const addPlantMarkers = (AMap: any) => {
  plantMarkers.forEach(data => {
    createMarker(AMap, data, 'plant', [
      { label: '编码', value: data.code },
      { label: '处理规模', value: data.capacity },
      { label: '运行状态', value: data.status },
      { label: '地址', value: data.address },
      { label: '联系电话', value: data.contact }
    ])
  })
}

// 添加泵站标记
const addPumpStationMarkers = (AMap: any) => {
  pumpStationMarkers.forEach(data => {
    createMarker(AMap, data, 'pumpStation', [
      { label: '编码', value: data.code },
      { label: '泵机数量', value: `${data.pumpCount} 台` },
      { label: '建成年份', value: data.buildYear },
      { label: '运行状态', value: data.status },
      { label: '瞬时流量', value: data.flow },
      { label: '地址', value: data.address }
    ])
  })
}

// 添加排水户标记
const addDrainageUserMarkers = (AMap: any) => {
  drainageUserMarkers.forEach(data => {
    createMarker(AMap, data, 'drainageUser', [
      { label: '编码', value: data.code },
      { label: '排水户类型', value: data.type },
      { label: '日排放量', value: data.discharge },
      { label: '许可证编号', value: data.permitNo },
      { label: '状态', value: data.status }
    ])
  })
}

// 添加小区标记
const addCommunityMarkers = (AMap: any) => {
  communityMarkers.forEach(data => {
    createMarker(AMap, data, 'community', [
      { label: '编码', value: data.code },
      { label: '住户数', value: `${data.households} 户` },
      { label: '建成年份', value: data.buildYear },
      { label: '管网类型', value: data.pipeType },
      { label: '状态', value: data.status }
    ])
  })
}

// 图层切换
const toggleLayer = (layerKey: keyof typeof layers) => {
  layers[layerKey] = !layers[layerKey]
  const visible = layers[layerKey]

  // 设施图层显隐
  if (layerKey in layerMarkers) {
    layerMarkers[layerKey].forEach((m: any) => {
      m.setVisible(visible)
    })
  }

  // 管网图层显隐
  if (layerKey === 'pipe') {
    // 管网折线显隐通过重新加载实现
  }
  if (layerKey === 'wellGreen' || layerKey === 'wellYellow') {
    markerGroup.forEach((m: any) => {
      // 井盖标记显隐
    })
  }
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
    min-width: 180px;
    z-index: 10;
    max-height: calc(100% - 80px);
    overflow-y: auto;

    .legend-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    .legend-section {
      margin-bottom: 12px;

      .legend-section-title {
        font-size: 11px;
        color: #999;
        margin-bottom: 6px;
        padding-left: 2px;
      }
    }

    .legend-items {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 3px 4px;
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

          &.plant-icon {
            background: #13c2c2;
            border-radius: 50%;
            &.active { border-color: #13c2c2; }
          }

          &.pump-icon {
            background: #eb2f96;
            border-radius: 50%;
            &.active { border-color: #eb2f96; }
          }

          &.user-icon {
            background: #722ed1;
            border-radius: 50%;
            &.active { border-color: #722ed1; }
          }

          &.community-icon {
            background: #fa8c16;
            border-radius: 50%;
            &.active { border-color: #fa8c16; }
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
