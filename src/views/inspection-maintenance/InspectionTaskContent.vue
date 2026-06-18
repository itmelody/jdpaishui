<template>
  <div class="inspection-task-content">
    <!-- 顶部筛选区 -->
    <div class="filter-bar">
      <a-row :gutter="[8, 8]" align="middle">
        <a-col>
          <span class="filter-label">关键字</span>
          <a-input 
            v-model:value="searchForm.keyword" 
            placeholder="请输入道路或小区" 
            style="width: 180px" 
            allow-clear
          >
            <template #prefix><SearchOutlined style="color: #999" /></template>
          </a-input>
        </a-col>
        <a-col>
          <span class="filter-label">片区</span>
          <a-select 
            v-model:value="searchForm.area" 
            mode="multiple" 
            placeholder="全选" 
            style="width: 160px" 
            :max-tag-count="1"
            allow-clear
          >
            <a-select-option value="北门路泵站片区">北门路泵站片区</a-select-option>
            <a-select-option value="横长泾路泵站片区">横长泾路泵站片区</a-select-option>
            <a-select-option value="创业路泵站片区">创业路泵站片区</a-select-option>
            <a-select-option value="铁南污水厂自流区">铁南污水厂自流区</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <span class="filter-label">公司</span>
          <a-select 
            v-model:value="searchForm.company" 
            mode="multiple" 
            placeholder="全选" 
            style="width: 160px" 
            :max-tag-count="1"
            allow-clear
          >
            <a-select-option value="建德市政">建德市政</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <span class="filter-label">时间</span>
          <a-range-picker 
            v-model:value="searchForm.dateRange" 
            style="width: 240px" 
            :placeholder="['开始日期', '结束日期']"
          />
        </a-col>
        <a-col>
          <a-button type="primary">更多筛选</a-button>
        </a-col>
        <a-col>
          <a-button type="primary">查询</a-button>
        </a-col>
        <a-col>
          <a-button type="primary">操作</a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 任务列表表格 -->
    <div class="task-table-wrapper">
      <a-table
        :columns="taskColumns"
        :data-source="taskData"
        :pagination="false"
        :scroll="{ x: 1200 }"
        row-key="id"
        size="small"
        class="task-table"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :custom-row="customRow"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <span :style="{ color: record.status === '进行中' ? '#1890ff' : '#52c41a' }">{{ record.status }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="openPhotoModal(record)">查看照片</a-button>
            <a-button type="text" size="small" disabled>暂无问题</a-button>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 底部地图区域 -->
    <div class="map-section">
      <div id="inspection-task-amap" class="amap-wrapper"></div>
      <div class="map-expand-btn" @click="toggleMapExpand">展开</div>
    </div>
    <!-- 巡查照片弹窗 -->
    <a-modal
      v-model:open="photoModalVisible"
      title="巡查照片"
      :width="800"
      :footer="null"
      class="photo-modal"
    >
      <!-- 状态标签栏 -->
      <div class="status-tabs">
        <div class="status-tab" :class="{ active: photoStatusTab === 'completed' }" @click="photoStatusTab = 'completed'">已完成 ({{ photoStats.completed }})</div>
        <div class="status-tab" :class="{ active: photoStatusTab === 'ongoing' }" @click="photoStatusTab = 'ongoing'">进行中 ({{ photoStats.ongoing }})</div>
        <div class="status-tab" :class="{ active: photoStatusTab === 'pending' }" @click="photoStatusTab = 'pending'">未开始 ({{ photoStats.pending }})</div>
      </div>

      <div class="photo-content">
        <!-- 左侧道路列表 -->
        <div class="road-list">
          <div class="road-list-title">道路名称</div>
          <a-tree
            :tree-data="roadTreeData"
            :expanded-keys="expandedRoadKeys"
            :selected-keys="selectedPhotoKeys"
            @expand="onRoadExpand"
            @select="onPhotoSelect"
            class="road-tree"
          />
        </div>

        <!-- 右侧照片展示区 -->
        <div class="photo-preview" v-if="selectedPhoto">
          <div class="photo-image">
            <img :src="selectedPhoto.url" alt="巡查照片" />
          </div>
          <div class="photo-info">
            <div class="info-row"><span class="info-label">拍摄者：</span>{{ selectedPhoto.photographer }}</div>
            <div class="info-row"><span class="info-label">拍摄坐标：</span>{{ selectedPhoto.coordinates }}</div>
            <div class="info-row"><span class="info-label">拍摄地点：</span>{{ selectedPhoto.location }}</div>
            <div class="info-row"><span class="info-label">拍摄时间：</span>{{ selectedPhoto.time }}</div>
          </div>
        </div>
        <div class="photo-preview empty" v-else>
          <a-empty description="请选择一张照片" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import dayjs, { type Dayjs } from 'dayjs'
import xunchaImg from '@/assets/xuncha.jpg'

// 搜索表单
const searchForm = ref({
  keyword: '',
  area: [],
  company: [],
  dateRange: [dayjs('2026-06-11'), dayjs('2026-06-18')] as [Dayjs, Dayjs]
})

// 选中的行
const selectedRowKeys = ref<string[]>(['1'])

// 任务表格列
const taskColumns = [
  { title: '任务ID', dataIndex: 'taskId', key: 'taskId', width: 180, ellipsis: true },
  { title: '任务类型', dataIndex: 'taskType', key: 'taskType', width: 90 },
  { title: '片区', dataIndex: 'area', key: 'area', width: 130 },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 70 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '巡查里程(km)', dataIndex: 'mileage', key: 'mileage', width: 100, align: 'center' },
  { title: '计划执行时间', dataIndex: 'planTime', key: 'planTime', width: 110 },
  { title: '任务描述', dataIndex: 'description', key: 'description', width: 180, ellipsis: true },
  { title: '操作', key: 'action', width: 140 }
]

// 模拟数据 - 每条任务包含巡查路线坐标
const taskData = ref([
  { id: '1', taskId: '202606180645243...', taskType: '管网巡查', area: '横长泾路泵站片区', creator: '贾鹏', status: '进行中', mileage: '2.73', planTime: '2026-06-18', description: '茄子路;', route: [[119.342, 29.488], [119.345, 29.486], [119.348, 29.484], [119.351, 29.483], [119.354, 29.481]] },
  { id: '2', taskId: '202606180606220...', taskType: '管网巡查', area: '横长泾路泵站片区', creator: '贾鹏', status: '已完成', mileage: '1.35', planTime: '2026-06-18', description: '东方花园;', route: [[119.350, 29.480], [119.353, 29.478], [119.356, 29.477]] },
  { id: '3', taskId: '202606180845315...', taskType: '管网巡查', area: '北门路泵站片区', creator: '王旭', status: '已完成', mileage: '0.79', planTime: '2026-06-18', description: '北门路36弄;', route: [[119.338, 29.492], [119.340, 29.490], [119.342, 29.489]] },
  { id: '4', taskId: '202606180901324...', taskType: '管网巡查', area: '创业路泵站片区', creator: '卢康', status: '进行中', mileage: '0', planTime: '2026-06-18', description: '长江路;', route: [[119.360, 29.475], [119.363, 29.474]] },
  { id: '5', taskId: '202606180627232...', taskType: '管网巡查', area: '横长泾路泵站片区', creator: '贾鹏', status: '已完成', mileage: '2.84', planTime: '2026-06-18', description: '东方家园;', route: [[119.346, 29.485], [119.349, 29.483], [119.352, 29.482], [119.355, 29.480]] },
  { id: '6', taskId: '202606180801288...', taskType: '管网巡查', area: '北门路泵站片区', creator: '王旭', status: '已完成', mileage: '4.27', planTime: '2026-06-18', description: '海峰公寓;海峰园;教师新村;', route: [[119.335, 29.495], [119.338, 29.493], [119.341, 29.491], [119.344, 29.490], [119.347, 29.488]] },
  { id: '7', taskId: '202606171639599...', taskType: '管网巡查', area: '北门路泵站片区', creator: '王旭', status: '已完成', mileage: '0.98', planTime: '2026-06-17', description: '格兰新村;', route: [[119.336, 29.494], [119.339, 29.492]] },
  { id: '8', taskId: '202606170559215...', taskType: '管网巡查', area: '铁南污水厂自流区', creator: '卢康', status: '已完成', mileage: '0.59', planTime: '2026-06-17', description: '中华园路;小濮河路;', route: [[119.358, 29.470], [119.361, 29.469], [119.364, 29.468]] }
])

// 地图实例
let mapInstance: any = null
let amapLib: any = null
let currentPolylines: any[] = []
let currentMarkers: any[] = []

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const customRow = (record: any) => ({
  onClick: () => {
    selectedRowKeys.value = [record.id]
    drawRouteOnMap(record)
  },
  class: selectedRowKeys.value.includes(record.id) ? 'selected-row' : ''
})

const toggleMapExpand = () => {
  // TODO: 展开地图
}

// === 巡查照片弹窗 ===
const photoModalVisible = ref(false)
const photoStatusTab = ref('completed')
const photoStats = ref({ completed: 2, ongoing: 0, pending: 0 })
const expandedRoadKeys = ref<string[]>(['road-1'])
const selectedPhotoKeys = ref<string[]>(['photo-1'])
const selectedPhoto = ref<any>(null)

// 道路树形数据
const roadTreeData = ref([
  {
    title: '中华园路',
    key: 'road-1',
    children: [
      { title: '巡查照片', key: 'photo-1', isLeaf: true }
    ]
  },
  {
    title: '小漠河路',
    key: 'road-2',
    children: [
      { title: '巡查照片', key: 'photo-2', isLeaf: true }
    ]
  }
])

// 照片数据映射
const photoDataMap: Record<string, any> = {
  'photo-1': {
    url: xunchaImg,
    photographer: '卢康',
    coordinates: '120.94780, 31.36038',
    location: '中国江苏省苏州市昆山市玉山镇中华园路',
    time: '2026-06-17 06:19:35'
  },
  'photo-2': {
    url: xunchaImg,
    photographer: '卢康',
    coordinates: '120.95120, 31.35890',
    location: '中国江苏省苏州市昆山市玉山镇小漠河路',
    time: '2026-06-17 06:25:10'
  }
}

const onRoadExpand = (keys: string[]) => {
  expandedRoadKeys.value = keys
}

const onPhotoSelect = (keys: string[]) => {
  selectedPhotoKeys.value = keys
  if (keys.length > 0) {
    selectedPhoto.value = photoDataMap[keys[0]] || null
  }
}

// 打开照片弹窗
const openPhotoModal = (record?: any) => {
  photoModalVisible.value = true
  // 根据选中的记录更新照片数据
  if (record) {
    // TODO: 根据record加载对应的照片数据
    selectedPhoto.value = photoDataMap['photo-1']
  }
}

// 初始化高德地图
const initAMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: '11ff1e3bd0d19646144e5c8e116d486c',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Polyline', 'AMap.Marker']
    })

    amapLib = AMap

    mapInstance = new AMap.Map('inspection-task-amap', {
      zoom: 13,
      center: [119.35, 29.48],
      mapStyle: 'amap://styles/light',
      viewMode: '2D'
    })

    mapInstance.addControl(new AMap.Scale())
    mapInstance.addControl(new AMap.ToolBar({ position: 'RT' }))

    // 默认绘制第一条任务的路线
    if (taskData.value.length > 0) {
      drawRouteOnMap(taskData.value[0])
    }
  } catch (error) {
    console.error('高德地图加载失败:', error)
  }
}

// 在地图上绘制巡查路线
const drawRouteOnMap = (task: any) => {
  if (!mapInstance || !amapLib || !task.route) return

  // 清除旧路线
  currentPolylines.forEach(p => mapInstance.remove(p))
  currentMarkers.forEach(m => mapInstance.remove(m))
  currentPolylines = []
  currentMarkers = []

  // 绘制路线折线
  const color = task.status === '进行中' ? '#fa8c16' : '#1890ff'
  const polyline = new amapLib.Polyline({
    path: task.route,
    strokeColor: color,
    strokeWeight: 5,
    strokeOpacity: 0.85,
    lineJoin: 'round',
    lineCap: 'round',
    showDir: true
  })
  mapInstance.add(polyline)
  currentPolylines.push(polyline)

  // 起点标记（绿色）
  const startMarker = new amapLib.Marker({
    position: new amapLib.LngLat(task.route[0][0], task.route[0][1]),
    content: `<div style="width:14px;height:14px;border-radius:50%;background:#52c41a;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
    offset: new amapLib.Pixel(-7, -7),
    title: '起点'
  })
  mapInstance.add(startMarker)
  currentMarkers.push(startMarker)

  // 终点标记（红色）
  const endPos = task.route[task.route.length - 1]
  const endMarker = new amapLib.Marker({
    position: new amapLib.LngLat(endPos[0], endPos[1]),
    content: `<div style="width:14px;height:14px;border-radius:50%;background:#f5222d;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
    offset: new amapLib.Pixel(-7, -7),
    title: '终点'
  })
  mapInstance.add(endMarker)
  currentMarkers.push(endMarker)

  // 自适应视野
  mapInstance.setFitView([...currentPolylines, ...currentMarkers], false, [60, 60, 60, 60])
}

// 监听选中变化，更新地图
watch(selectedRowKeys, (keys) => {
  if (keys.length > 0) {
    const task = taskData.value.find(t => t.id === keys[0])
    if (task) {
      drawRouteOnMap(task)
    }
  }
})

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
.inspection-task-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}

.filter-bar {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;

  .filter-label {
    margin-right: 8px;
    font-size: 14px;
    color: #333;
  }
}

.task-table-wrapper {
  flex: 1;
  min-height: 200px;
  overflow: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .task-table {
    :deep(.ant-table-thead > tr > th) {
      background: #e6f7ff;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 8px;
      color: #333;
    }
    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
      font-size: 13px;
    }
    :deep(.ant-table-tbody > tr:nth-child(even) > td) {
      background: #fafafa;
    }
    :deep(.ant-table-tbody > tr.selected-row > td) {
      background: #e6f7ff !important;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f0f9ff;
    }
  }
}

.map-section {
  flex: 1;
  min-height: 250px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .amap-wrapper {
    width: 100%;
    height: 100%;
  }

  .map-expand-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #1890ff;
    color: #fff;
    padding: 4px 14px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

    &:hover {
      background: #40a9ff;
    }
  }
}

// === 巡查照片弹窗样式 ===
.photo-modal {
  :deep(.ant-modal-body) {
    padding: 0;
  }
}

.status-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;

  .status-tab {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;

    &:hover {
      color: #1890ff;
    }

    &.active {
      color: #1890ff;
      border-bottom-color: #1890ff;
      font-weight: 500;
    }
  }
}

.photo-content {
  display: flex;
  height: 420px;
}

.road-list {
  width: 200px;
  border-right: 1px solid #f0f0f0;
  padding: 12px;
  overflow-y: auto;

  .road-list-title {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    padding: 4px 0;
  }

  .road-tree {
    :deep(.ant-tree-node-content-wrapper) {
      font-size: 13px;
    }
    :deep(.ant-tree-node-selected) {
      background: #e6f4ff;
    }
  }
}

.photo-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
  overflow: hidden;

  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-image {
    flex: 1;
    overflow: hidden;
    border-radius: 4px;
    background: #f5f5f5;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .photo-info {
    margin-top: 12px;
    background: rgba(0, 0, 0, 0.65);
    border-radius: 4px;
    padding: 10px 14px;
    color: #fff;
    font-size: 13px;
    line-height: 1.8;

    .info-row {
      display: flex;
    }

    .info-label {
      color: rgba(255, 255, 255, 0.65);
      min-width: 70px;
    }
  }
}
</style>
