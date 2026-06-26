<template>
  <div class="pump-monitor-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">📊 泵站运行监测数据列表</h2>
    </div>

    <!-- 查询区 -->
    <a-card :bordered="false" class="search-card">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">归属地区:</label>
          <a-select v-model:value="searchForm.region" placeholder="全部" style="width: 160px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="新安江街道">新安江街道</a-select-option>
            <a-select-option value="梅城镇">梅城镇</a-select-option>
            <a-select-option value="寿昌镇">寿昌镇</a-select-option>
            <a-select-option value="更楼街道">更楼街道</a-select-option>
            <a-select-option value="乾潭镇">乾潭镇</a-select-option>
            <a-select-option value="大洋镇">大洋镇</a-select-option>
            <a-select-option value="三都镇">三都镇</a-select-option>
          </a-select>
        </div>
        <div class="search-item">
          <label class="search-label">泵站名称:</label>
          <a-input v-model:value="searchForm.stationName" placeholder="请输入泵站名称" style="width: 180px" allow-clear />
        </div>
        <div class="search-item">
          <label class="search-label">监测时间(起):</label>
          <a-date-picker v-model:value="searchForm.dateStart" value-format="YYYY-MM-DD" style="width: 150px" />
        </div>
        <div class="search-item">
          <label class="search-label">监测时间(止):</label>
          <a-date-picker v-model:value="searchForm.dateEnd" value-format="YYYY-MM-DD" style="width: 150px" />
        </div>
        <div class="search-item">
          <label class="search-label">状态筛选:</label>
          <a-select v-model:value="searchForm.statusFilter" placeholder="全部" style="width: 120px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="normal">正常</a-select-option>
            <a-select-option value="warning">预警</a-select-option>
            <a-select-option value="alarm">报警</a-select-option>
            <a-select-option value="offline">离线</a-select-option>
          </a-select>
        </div>
        <div class="search-item">
          <label class="search-label">异常筛选:</label>
          <a-select v-model:value="searchForm.abnormalFilter" placeholder="全部" style="width: 160px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="abnormal">仅显示异常</a-select-option>
            <a-select-option value="alarm-only">仅显示报警</a-select-option>
          </a-select>
        </div>
        <div class="search-item" v-if="activeTab === 'hydro'">
          <label class="search-label">水质异常:</label>
          <a-select v-model:value="searchForm.waterQualityFilter" placeholder="全部" style="width: 140px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="cod">COD超标</a-select-option>
            <a-select-option value="nh3">氨氮超标</a-select-option>
            <a-select-option value="tn">总氮超标</a-select-option>
            <a-select-option value="tp">总磷超标</a-select-option>
            <a-select-option value="ph">pH异常</a-select-option>
          </a-select>
        </div>
        <div class="search-item">
          <label class="search-label">刷新间隔:</label>
          <a-select v-model:value="searchForm.refreshInterval" style="width: 100px">
            <a-select-option :value="5">5秒</a-select-option>
            <a-select-option :value="10">10秒</a-select-option>
            <a-select-option :value="30">30秒</a-select-option>
            <a-select-option :value="60">60秒</a-select-option>
            <a-select-option :value="0">手动</a-select-option>
          </a-select>
        </div>
        <div class="search-item search-buttons">
          <a-button type="primary" @click="handleSearch"><SearchOutlined /> 查询</a-button>
          <a-button @click="handleReset"><ReloadOutlined /> 重置</a-button>
          <a-button @click="handleExport"><DownloadOutlined /> 导出Excel</a-button>
          <span class="refresh-countdown" v-if="searchForm.refreshInterval > 0">
            距下次刷新：{{ countdown }}s
          </span>
        </div>
      </div>
    </a-card>

    <!-- 标签导航 -->
    <div class="tab-nav">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        :style="activeTab === tab.key ? { background: tab.lightBg, color: tab.color, borderColor: tab.color } : {}"
        @click="activeTab = tab.key"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
        <a-badge v-if="tab.badge > 0" :count="tab.badge" :number-style="{ backgroundColor: '#FF4D4F' }" class="tab-badge" />
      </div>
    </div>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <!-- 水文工艺 -->
      <a-table
        v-if="activeTab === 'hydro'"
        :columns="hydroColumns"
        :data-source="hydroData"
        :pagination="pagination"
        :scroll="{ x: 2200 }"
        row-key="id"
        size="small"
        :row-class-name="getRowClassName"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'stationName'">
            <a class="station-link" @click="handleStationDetail(record)">{{ record.stationName }}</a>
          </template>
          <template v-else-if="isValueColumn(column.key)">
            <span class="value-cell">
              <span class="value-num">{{ formatValue(record[column.dataIndex]) }}</span>
              <span class="status-dot" :class="'status-' + getStatus(record[column.dataIndex], column.key)"></span>
            </span>
          </template>
        </template>
      </a-table>

      <!-- 设备状态 -->
      <a-table
        v-if="activeTab === 'device'"
        :columns="deviceColumns"
        :data-source="deviceData"
        :pagination="pagination"
        :scroll="{ x: 2000 }"
        row-key="id"
        size="small"
        :row-class-name="getRowClassName"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'stationName'">
            <a class="station-link" @click="handleStationDetail(record)">{{ record.stationName }}</a>
          </template>
          <template v-else-if="isPumpStatus(column.key)">
            <span class="pump-status" :class="'pump-' + record[column.dataIndex]">
              {{ getPumpStatusIcon(record[column.dataIndex]) }} {{ getPumpStatusText(record[column.dataIndex]) }}
            </span>
          </template>
          <template v-else-if="isValueColumn(column.key)">
            <span class="value-cell">
              <span class="value-num">{{ formatValue(record[column.dataIndex]) }}</span>
              <span class="status-dot" :class="'status-' + getStatus(record[column.dataIndex], column.key)"></span>
            </span>
          </template>
        </template>
      </a-table>

      <!-- 电气参数 -->
      <a-table
        v-if="activeTab === 'electric'"
        :columns="electricColumns"
        :data-source="electricData"
        :pagination="pagination"
        :scroll="{ x: 1800 }"
        row-key="id"
        size="small"
        :row-class-name="getRowClassName"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'stationName'">
            <a class="station-link" @click="handleStationDetail(record)">{{ record.stationName }}</a>
          </template>
          <template v-else-if="isValueColumn(column.key)">
            <span class="value-cell">
              <span class="value-num">{{ formatValue(record[column.dataIndex]) }}</span>
              <span class="status-dot" :class="'status-' + getStatus(record[column.dataIndex], column.key)"></span>
            </span>
          </template>
        </template>
      </a-table>

      <!-- 环境安防 -->
      <a-table
        v-if="activeTab === 'security'"
        :columns="securityColumns"
        :data-source="securityData"
        :pagination="pagination"
        :scroll="{ x: 1800 }"
        row-key="id"
        size="small"
        :row-class-name="getRowClassName"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'stationName'">
            <a class="station-link" @click="handleStationDetail(record)">{{ record.stationName }}</a>
          </template>
          <template v-else-if="column.key === 'videoLink'">
            <a-button type="link" size="small" @click="handleVideoView(record)">📹 查看</a-button>
          </template>
          <template v-else-if="isValueColumn(column.key)">
            <span class="value-cell">
              <span class="value-num">{{ formatValue(record[column.dataIndex]) }}</span>
              <span class="status-dot" :class="'status-' + getStatus(record[column.dataIndex], column.key)"></span>
            </span>
          </template>
          <template v-else-if="column.key === 'coverStatus' || column.key === 'waterStatus'">
            <span class="status-text" :class="'text-' + (record[column.dataIndex] === '正常' ? 'normal' : 'alarm')">
              {{ record[column.dataIndex] }}
              <span class="status-dot" :class="'status-' + (record[column.dataIndex] === '正常' ? 'normal' : 'alarm')"></span>
            </span>
          </template>
        </template>
      </a-table>

      <!-- 综合总览 -->
      <a-table
        v-if="activeTab === 'overview'"
        :columns="overviewColumns"
        :data-source="overviewData"
        :pagination="pagination"
        :scroll="{ x: 1800 }"
        row-key="id"
        size="small"
        :row-class-name="getRowClassName"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'stationName'">
            <a class="station-link" @click="handleStationDetail(record)">{{ record.stationName }}</a>
          </template>
          <template v-else-if="column.key === 'overallStatus'">
            <span class="overall-status" :class="'status-' + record.overallStatusLevel">
              {{ record.overallStatus }}
            </span>
          </template>
          <template v-else-if="column.key === 'detail'">
            <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="drawerTitle"
      width="600"
      placement="right"
    >
      <div class="drawer-content">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="泵站名称">{{ drawerData.stationName }}</a-descriptions-item>
          <a-descriptions-item label="归属地区">{{ drawerData.region }}</a-descriptions-item>
          <a-descriptions-item label="监测时间">{{ drawerData.monitorTime }}</a-descriptions-item>
        </a-descriptions>
        <a-divider>24小时趋势</a-divider>
        <div class="trend-placeholder">
          <a-result status="info" title="趋势图表区域" sub-title="此处将展示24小时监测数据趋势曲线" />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'

// ==================== 标签配置 ====================
const tabs = ref([
  { key: 'overview', label: '综合总览', icon: '📋', color: '#1677FF', lightBg: '#E6F4FF', badge: 0 },
  { key: 'hydro', label: '水文工艺', icon: '🌊', color: '#1890FF', lightBg: '#E6F7FF', badge: 2 },
  { key: 'device', label: '设备状态', icon: '⚙️', color: '#FA8C16', lightBg: '#FFF7E6', badge: 1 },
  { key: 'electric', label: '电气参数', icon: '⚡', color: '#722ED1', lightBg: '#F9F0FF', badge: 0 },
  { key: 'security', label: '环境安防', icon: '🛡️', color: '#52C41A', lightBg: '#F6FFED', badge: 3 }
])
const activeTab = ref('overview')

// ==================== 查询表单 ====================
const searchForm = reactive({
  region: '',
  stationName: '',
  dateStart: '2026-06-19',
  dateEnd: '2026-06-26',
  statusFilter: '',
  abnormalFilter: '',
  waterQualityFilter: '',
  refreshInterval: 30
})

// ==================== 刷新倒计时 ====================
const countdown = ref(30)
let refreshTimer: any = null
let countdownTimer: any = null

const startRefreshTimer = () => {
  stopRefreshTimer()
  if (searchForm.refreshInterval <= 0) return
  countdown.value = searchForm.refreshInterval
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = searchForm.refreshInterval
      handleSearch()
    }
  }, 1000)
}

const stopRefreshTimer = () => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (refreshTimer) clearInterval(refreshTimer)
}

watch(() => searchForm.refreshInterval, () => {
  startRefreshTimer()
})

// ==================== 分页 ====================
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 50,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// ==================== 状态判断 ====================
const thresholds: Record<string, { warnMin?: number; warnMax?: number; alarmMin?: number; alarmMax?: number }> = {
  liquidLevel: { warnMin: 0.3, warnMax: 3.2, alarmMin: 0.2, alarmMax: 3.5 },
  pressure: { warnMax: 0.65, alarmMax: 0.7 },
  flow: { warnMin: 150, alarmMin: 100 },
  cod: { warnMax: 30, alarmMax: 40 },
  nh3: { warnMax: 2.0, alarmMax: 3.0 },
  tn: { warnMax: 10, alarmMax: 15 },
  tp: { warnMax: 0.5, alarmMax: 0.8 },
  ss: { warnMax: 20, alarmMax: 30 },
  ph: { warnMin: 6.5, warnMax: 8.5, alarmMin: 6.0, alarmMax: 9.0 },
  pumpTemp: { warnMax: 75, alarmMax: 85 },
  pumpVibration: { warnMax: 4.5, alarmMax: 6.0 },
  voltage: { warnMin: 9.5, warnMax: 10.8, alarmMin: 9.0, alarmMax: 11.0 },
  powerFactor: { warnMin: 0.85, alarmMin: 0.75 },
  h2s: { warnMax: 10, alarmMax: 15 },
  ch4: { warnMax: 20, alarmMax: 30 },
  temperature: { warnMax: 40, alarmMax: 45 }
}

const getStatus = (value: any, key: string): string => {
  if (value === null || value === undefined || value === '') return 'offline'
  const num = parseFloat(value)
  if (isNaN(num)) return 'normal'
  const t = thresholds[key]
  if (!t) return 'normal'
  if (t.alarmMax !== undefined && num > t.alarmMax) return 'alarm'
  if (t.alarmMin !== undefined && num < t.alarmMin) return 'alarm'
  if (t.warnMax !== undefined && num > t.warnMax) return 'warning'
  if (t.warnMin !== undefined && num < t.warnMin) return 'warning'
  return 'normal'
}

const getRowClassName = (record: any): string => {
  if (record.rowStatus === 'alarm') return 'row-alarm'
  if (record.rowStatus === 'warning') return 'row-warning'
  if (record.rowStatus === 'offline') return 'row-offline'
  return ''
}

// ==================== 工具函数 ====================
const formatValue = (val: any): string => {
  if (val === null || val === undefined || val === '') return '-'
  if (typeof val === 'number') {
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  }
  return String(val)
}

const valueColumns = new Set([
  'yesterdayWater', 'instantFlow', 'liquidLevel', 'pressure',
  'cod', 'nh3', 'tn', 'tp', 'ss', 'ph',
  'pump1Temp', 'pump1Vibration', 'pump2Temp', 'pump2Vibration',
  'voltage', 'totalCurrent', 'activePower', 'powerFactor', 'unit1Current', 'dailyEnergy', 'energyRatio',
  'h2s', 'ch4', 'roomTemp', 'roomHumidity'
])

const isValueColumn = (key: string) => valueColumns.has(key)

const pumpStatusKeys = new Set(['pump1Status', 'pump2Status'])
const isPumpStatus = (key: string) => pumpStatusKeys.has(key)

const getPumpStatusIcon = (status: string) => {
  const map: Record<string, string> = { running: '🟢', standby: '🟡', fault: '', stopped: '⚪' }
  return map[status] || '⚪'
}

const getPumpStatusText = (status: string) => {
  const map: Record<string, string> = { running: '运行', standby: '待机', fault: '故障', stopped: '停止' }
  return map[status] || '未知'
}

// ==================== 水文工艺列 ====================
const hydroColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const, fixed: 'left' as const },
  { title: '泵站名称', key: 'stationName', dataIndex: 'stationName', width: 120, fixed: 'left' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 110, fixed: 'left' as const },
  { title: '监测时间', dataIndex: 'monitorTime', key: 'monitorTime', width: 170, fixed: 'left' as const },
  { title: '昨日输送水量 (m³/d)', dataIndex: 'yesterdayWater', key: 'yesterdayWater', width: 150, sorter: true },
  { title: '瞬时流量 (m³/h)', dataIndex: 'instantFlow', key: 'instantFlow', width: 140, sorter: true },
  { title: '进水池液位 (m)', dataIndex: 'liquidLevel', key: 'liquidLevel', width: 130, sorter: true },
  { title: '管道压力 (MPa)', dataIndex: 'pressure', key: 'pressure', width: 130, sorter: true },
  { title: 'COD (mg/L)', dataIndex: 'cod', key: 'cod', width: 120, sorter: true },
  { title: '氨氮 (mg/L)', dataIndex: 'nh3', key: 'nh3', width: 120, sorter: true },
  { title: '总氮 (mg/L)', dataIndex: 'tn', key: 'tn', width: 120, sorter: true },
  { title: '总磷 (mg/L)', dataIndex: 'tp', key: 'tp', width: 120, sorter: true },
  { title: '悬浮物 (mg/L)', dataIndex: 'ss', key: 'ss', width: 130, sorter: true },
  { title: 'pH', dataIndex: 'ph', key: 'ph', width: 80, sorter: true }
]

const hydroData = ref([
  { id: 1, index: 1, stationName: '桥北泵站', region: '新安江街道', monitorTime: '2026-06-26 14:30:00', yesterdayWater: 12500, instantFlow: 320.5, liquidLevel: 2.85, pressure: 0.45, cod: 18.5, nh3: 1.20, tn: 6.5, tp: 0.35, ss: 12, ph: 7.12, rowStatus: 'normal' },
  { id: 2, index: 2, stationName: '溪头泵站', region: '梅城镇', monitorTime: '2026-06-26 14:28:00', yesterdayWater: 8200, instantFlow: 185.0, liquidLevel: 3.20, pressure: 0.62, cod: 45.2, nh3: 3.50, tn: 9.8, tp: 0.82, ss: 28, ph: 8.35, rowStatus: 'warning' },
  { id: 3, index: 3, stationName: '桥南泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:25:00', yesterdayWater: 9800, instantFlow: 280.0, liquidLevel: 2.50, pressure: 0.50, cod: 22.0, nh3: 1.80, tn: 8.2, tp: 0.42, ss: 15, ph: 7.35, rowStatus: 'normal' },
  { id: 4, index: 4, stationName: '洋安泵站', region: '更楼街道', monitorTime: '2026-06-26 14:22:00', yesterdayWater: 6500, instantFlow: 150.0, liquidLevel: 3.60, pressure: 0.72, cod: 38.0, nh3: 2.80, tn: 12.5, tp: 0.65, ss: 22, ph: 7.80, rowStatus: 'alarm' },
  { id: 5, index: 5, stationName: '洋溪泵站', region: '乾潭镇', monitorTime: '2026-06-26 14:20:00', yesterdayWater: 7200, instantFlow: 200.0, liquidLevel: 2.10, pressure: 0.42, cod: 15.0, nh3: 0.95, tn: 5.8, tp: 0.28, ss: 10, ph: 7.05, rowStatus: 'normal' },
  { id: 6, index: 6, stationName: '半岛泵站', region: '大洋镇', monitorTime: '2026-06-26 14:18:00', yesterdayWater: 5800, instantFlow: 165.0, liquidLevel: 2.95, pressure: 0.55, cod: 25.0, nh3: 1.50, tn: 7.2, tp: 0.38, ss: 18, ph: 7.22, rowStatus: 'normal' },
  { id: 7, index: 7, stationName: '电厂泵站', region: '三都镇', monitorTime: '2026-06-26 14:15:00', yesterdayWater: 11000, instantFlow: 350.0, liquidLevel: 2.60, pressure: 0.48, cod: 20.0, nh3: 1.10, tn: 6.0, tp: 0.30, ss: 14, ph: 7.18, rowStatus: 'normal' },
  { id: 8, index: 8, stationName: '江村埠泵站', region: '新安江街道', monitorTime: '2026-06-26 14:12:00', yesterdayWater: 4500, instantFlow: 120.0, liquidLevel: 1.80, pressure: 0.38, cod: 28.0, nh3: 2.20, tn: 11.0, tp: 0.55, ss: 25, ph: 6.80, rowStatus: 'warning' },
  { id: 9, index: 9, stationName: '假日酒店泵站', region: '梅城镇', monitorTime: '2026-06-26 14:10:00', yesterdayWater: 3200, instantFlow: 95.0, liquidLevel: 3.80, pressure: 0.75, cod: 52.0, nh3: 4.20, tn: 16.5, tp: 0.95, ss: 35, ph: 5.80, rowStatus: 'alarm' },
  { id: 10, index: 10, stationName: '兽王泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:08:00', yesterdayWater: 6800, instantFlow: 190.0, liquidLevel: 2.40, pressure: 0.46, cod: 19.0, nh3: 1.30, tn: 7.0, tp: 0.36, ss: 16, ph: 7.25, rowStatus: 'normal' }
])

// ==================== 设备状态列 ====================
const deviceColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const, fixed: 'left' as const },
  { title: '泵站名称', key: 'stationName', dataIndex: 'stationName', width: 120, fixed: 'left' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 110, fixed: 'left' as const },
  { title: '监测时间', dataIndex: 'monitorTime', key: 'monitorTime', width: 170, fixed: 'left' as const },
  { title: '1#泵状态', dataIndex: 'pump1Status', key: 'pump1Status', width: 110 },
  { title: '1#泵轴温 (℃)', dataIndex: 'pump1Temp', key: 'pump1Temp', width: 130, sorter: true },
  { title: '1#泵振动 (mm/s)', dataIndex: 'pump1Vibration', key: 'pump1Vibration', width: 150, sorter: true },
  { title: '2#泵状态', dataIndex: 'pump2Status', key: 'pump2Status', width: 110 },
  { title: '2#泵轴温 (℃)', dataIndex: 'pump2Temp', key: 'pump2Temp', width: 130, sorter: true },
  { title: '2#泵振动 (mm/s)', dataIndex: 'pump2Vibration', key: 'pump2Vibration', width: 150, sorter: true },
  { title: '格栅机', dataIndex: 'grille', key: 'grille', width: 100 },
  { title: '排风机', dataIndex: 'fan', key: 'fan', width: 100 }
]

const deviceData = ref([
  { id: 1, index: 1, stationName: '桥北泵站', region: '新安江街道', monitorTime: '2026-06-26 14:30:00', pump1Status: 'running', pump1Temp: 68.2, pump1Vibration: 2.1, pump2Status: 'running', pump2Temp: 65.5, pump2Vibration: 1.8, grille: 'running', fan: 'running', rowStatus: 'normal' },
  { id: 2, index: 2, stationName: '溪头泵站', region: '梅城镇', monitorTime: '2026-06-26 14:28:00', pump1Status: 'running', pump1Temp: 79.8, pump1Vibration: 3.5, pump2Status: 'running', pump2Temp: 82.3, pump2Vibration: 4.2, grille: 'running', fan: 'stopped', rowStatus: 'warning' },
  { id: 3, index: 3, stationName: '桥南泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:25:00', pump1Status: 'running', pump1Temp: 70.5, pump1Vibration: 2.5, pump2Status: 'standby', pump2Temp: 45.0, pump2Vibration: 0.5, grille: 'running', fan: 'running', rowStatus: 'normal' },
  { id: 4, index: 4, stationName: '洋安泵站', region: '更楼街道', monitorTime: '2026-06-26 14:22:00', pump1Status: 'fault', pump1Temp: 92.0, pump1Vibration: 7.2, pump2Status: 'running', pump2Temp: 78.0, pump2Vibration: 5.0, grille: 'running', fan: 'running', rowStatus: 'alarm' },
  { id: 5, index: 5, stationName: '洋溪泵站', region: '乾潭镇', monitorTime: '2026-06-26 14:20:00', pump1Status: 'running', pump1Temp: 66.0, pump1Vibration: 1.9, pump2Status: 'running', pump2Temp: 67.5, pump2Vibration: 2.0, grille: 'running', fan: 'running', rowStatus: 'normal' },
  { id: 6, index: 6, stationName: '半岛泵站', region: '大洋镇', monitorTime: '2026-06-26 14:18:00', pump1Status: 'running', pump1Temp: 72.0, pump1Vibration: 2.8, pump2Status: 'running', pump2Temp: 71.0, pump2Vibration: 2.5, grille: 'standby', fan: 'running', rowStatus: 'normal' },
  { id: 7, index: 7, stationName: '电厂泵站', region: '三都镇', monitorTime: '2026-06-26 14:15:00', pump1Status: 'running', pump1Temp: 69.0, pump1Vibration: 2.2, pump2Status: 'running', pump2Temp: 68.0, pump2Vibration: 2.0, grille: 'running', fan: 'running', rowStatus: 'normal' },
  { id: 8, index: 8, stationName: '江村埠泵站', region: '新安江街道', monitorTime: '2026-06-26 14:12:00', pump1Status: 'stopped', pump1Temp: 35.0, pump1Vibration: 0.2, pump2Status: 'running', pump2Temp: 74.0, pump2Vibration: 3.8, grille: 'running', fan: 'stopped', rowStatus: 'normal' },
  { id: 9, index: 9, stationName: '假日酒店泵站', region: '梅城镇', monitorTime: '2026-06-26 14:10:00', pump1Status: 'fault', pump1Temp: 95.0, pump1Vibration: 8.5, pump2Status: 'fault', pump2Temp: 90.0, pump2Vibration: 7.8, grille: 'fault', fan: 'stopped', rowStatus: 'alarm' },
  { id: 10, index: 10, stationName: '兽王泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:08:00', pump1Status: 'running', pump1Temp: 67.0, pump1Vibration: 2.0, pump2Status: 'running', pump2Temp: 66.0, pump2Vibration: 1.9, grille: 'running', fan: 'running', rowStatus: 'normal' }
])

// ==================== 电气参数列 ====================
const electricColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const, fixed: 'left' as const },
  { title: '泵站名称', key: 'stationName', dataIndex: 'stationName', width: 120, fixed: 'left' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 110, fixed: 'left' as const },
  { title: '监测时间', dataIndex: 'monitorTime', key: 'monitorTime', width: 170, fixed: 'left' as const },
  { title: '进线电压 (kV)', dataIndex: 'voltage', key: 'voltage', width: 140, sorter: true },
  { title: '总电流 (A)', dataIndex: 'totalCurrent', key: 'totalCurrent', width: 120, sorter: true },
  { title: '有功功率 (kW)', dataIndex: 'activePower', key: 'activePower', width: 140, sorter: true },
  { title: '功率因数', dataIndex: 'powerFactor', key: 'powerFactor', width: 100, sorter: true },
  { title: '1#机组电流 (A)', dataIndex: 'unit1Current', key: 'unit1Current', width: 140, sorter: true },
  { title: '日用电量 (kWh)', dataIndex: 'dailyEnergy', key: 'dailyEnergy', width: 130, sorter: true },
  { title: '能效比 (kWh/万m³)', dataIndex: 'energyRatio', key: 'energyRatio', width: 160, sorter: true }
]

const electricData = ref([
  { id: 1, index: 1, stationName: '桥北泵站', region: '新安江街道', monitorTime: '2026-06-26 14:30:00', voltage: 10.25, totalCurrent: 185.0, activePower: 3200, powerFactor: 0.92, unit1Current: 185.0, dailyEnergy: 4250, energyRatio: 3.40, rowStatus: 'normal' },
  { id: 2, index: 2, stationName: '溪头泵站', region: '梅城镇', monitorTime: '2026-06-26 14:28:00', voltage: 9.85, totalCurrent: 165.0, activePower: 2800, powerFactor: 0.88, unit1Current: 165.0, dailyEnergy: 3800, energyRatio: 4.63, rowStatus: 'normal' },
  { id: 3, index: 3, stationName: '桥南泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:25:00', voltage: 10.10, totalCurrent: 175.0, activePower: 3000, powerFactor: 0.90, unit1Current: 175.0, dailyEnergy: 4000, energyRatio: 4.08, rowStatus: 'normal' },
  { id: 4, index: 4, stationName: '洋安泵站', region: '更楼街道', monitorTime: '2026-06-26 14:22:00', voltage: 9.40, totalCurrent: 195.0, activePower: 3500, powerFactor: 0.82, unit1Current: 195.0, dailyEnergy: 4600, energyRatio: 7.08, rowStatus: 'warning' },
  { id: 5, index: 5, stationName: '洋溪泵站', region: '乾潭镇', monitorTime: '2026-06-26 14:20:00', voltage: 10.30, totalCurrent: 170.0, activePower: 2900, powerFactor: 0.91, unit1Current: 170.0, dailyEnergy: 3900, energyRatio: 5.42, rowStatus: 'normal' },
  { id: 6, index: 6, stationName: '半岛泵站', region: '大洋镇', monitorTime: '2026-06-26 14:18:00', voltage: 10.15, totalCurrent: 180.0, activePower: 3100, powerFactor: 0.89, unit1Current: 180.0, dailyEnergy: 4100, energyRatio: 7.07, rowStatus: 'normal' },
  { id: 7, index: 7, stationName: '电厂泵站', region: '三都镇', monitorTime: '2026-06-26 14:15:00', voltage: 10.20, totalCurrent: 190.0, activePower: 3300, powerFactor: 0.93, unit1Current: 190.0, dailyEnergy: 4400, energyRatio: 4.00, rowStatus: 'normal' },
  { id: 8, index: 8, stationName: '江村埠泵站', region: '新安江街道', monitorTime: '2026-06-26 14:12:00', voltage: 8.90, totalCurrent: 155.0, activePower: 2600, powerFactor: 0.72, unit1Current: 155.0, dailyEnergy: 3500, energyRatio: 7.78, rowStatus: 'alarm' },
  { id: 9, index: 9, stationName: '假日酒店泵站', region: '梅城镇', monitorTime: '2026-06-26 14:10:00', voltage: 10.05, totalCurrent: 160.0, activePower: 2700, powerFactor: 0.87, unit1Current: 160.0, dailyEnergy: 3600, energyRatio: 11.25, rowStatus: 'normal' },
  { id: 10, index: 10, stationName: '兽王泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:08:00', voltage: 10.18, totalCurrent: 172.0, activePower: 2950, powerFactor: 0.90, unit1Current: 172.0, dailyEnergy: 3950, energyRatio: 5.81, rowStatus: 'normal' }
])

// ==================== 环境安防列 ====================
const securityColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const, fixed: 'left' as const },
  { title: '泵站名称', key: 'stationName', dataIndex: 'stationName', width: 120, fixed: 'left' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 110, fixed: 'left' as const },
  { title: '监测时间', dataIndex: 'monitorTime', key: 'monitorTime', width: 170, fixed: 'left' as const },
  { title: 'H₂S浓度 (ppm)', dataIndex: 'h2s', key: 'h2s', width: 140, sorter: true },
  { title: 'CH₄浓度 (%LEL)', dataIndex: 'ch4', key: 'ch4', width: 150, sorter: true },
  { title: '室内温度 (℃)', dataIndex: 'roomTemp', key: 'roomTemp', width: 130, sorter: true },
  { title: '室内湿度 (%RH)', dataIndex: 'roomHumidity', key: 'roomHumidity', width: 140, sorter: true },
  { title: '井盖状态', dataIndex: 'coverStatus', key: 'coverStatus', width: 100 },
  { title: '积水状态', dataIndex: 'waterStatus', key: 'waterStatus', width: 100 },
  { title: '视频联动', key: 'videoLink', width: 100 }
]

const securityData = ref([
  { id: 1, index: 1, stationName: '桥北泵站', region: '新安江街道', monitorTime: '2026-06-26 14:30:00', h2s: 0.5, ch4: 0.2, roomTemp: 28.3, roomHumidity: 65.0, coverStatus: '正常', waterStatus: '正常', rowStatus: 'normal' },
  { id: 2, index: 2, stationName: '溪头泵站', region: '梅城镇', monitorTime: '2026-06-26 14:28:00', h2s: 12.5, ch4: 0.8, roomTemp: 35.0, roomHumidity: 75.0, coverStatus: '异常', waterStatus: '正常', rowStatus: 'alarm' },
  { id: 3, index: 3, stationName: '桥南泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:25:00', h2s: 1.2, ch4: 0.3, roomTemp: 30.0, roomHumidity: 68.0, coverStatus: '正常', waterStatus: '正常', rowStatus: 'normal' },
  { id: 4, index: 4, stationName: '洋安泵站', region: '更楼街道', monitorTime: '2026-06-26 14:22:00', h2s: 16.0, ch4: 1.5, roomTemp: 42.0, roomHumidity: 80.0, coverStatus: '异常', waterStatus: '异常', rowStatus: 'alarm' },
  { id: 5, index: 5, stationName: '洋溪泵站', region: '乾潭镇', monitorTime: '2026-06-26 14:20:00', h2s: 0.8, ch4: 0.1, roomTemp: 27.5, roomHumidity: 62.0, coverStatus: '正常', waterStatus: '正常', rowStatus: 'normal' },
  { id: 6, index: 6, stationName: '半岛泵站', region: '大洋镇', monitorTime: '2026-06-26 14:18:00', h2s: 2.0, ch4: 0.5, roomTemp: 31.0, roomHumidity: 70.0, coverStatus: '正常', waterStatus: '正常', rowStatus: 'normal' },
  { id: 7, index: 7, stationName: '电厂泵站', region: '三都镇', monitorTime: '2026-06-26 14:15:00', h2s: 0.6, ch4: 0.2, roomTemp: 29.0, roomHumidity: 66.0, coverStatus: '正常', waterStatus: '正常', rowStatus: 'normal' },
  { id: 8, index: 8, stationName: '江村埠泵站', region: '新安江街道', monitorTime: '2026-06-26 14:12:00', h2s: 11.0, ch4: 0.6, roomTemp: 33.0, roomHumidity: 72.0, coverStatus: '正常', waterStatus: '正常', rowStatus: 'warning' },
  { id: 9, index: 9, stationName: '假日酒店泵站', region: '梅城镇', monitorTime: '2026-06-26 14:10:00', h2s: 18.0, ch4: 2.0, roomTemp: 46.0, roomHumidity: 85.0, coverStatus: '异常', waterStatus: '异常', rowStatus: 'alarm' },
  { id: 10, index: 10, stationName: '兽王泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:08:00', h2s: 0.9, ch4: 0.3, roomTemp: 28.0, roomHumidity: 64.0, coverStatus: '正常', waterStatus: '正常', rowStatus: 'normal' }
])

// ==================== 综合总览列 ====================
const overviewColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const, fixed: 'left' as const },
  { title: '泵站名称', key: 'stationName', dataIndex: 'stationName', width: 120, fixed: 'left' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 110, fixed: 'left' as const },
  { title: '监测时间', dataIndex: 'monitorTime', key: 'monitorTime', width: 170, fixed: 'left' as const },
  { title: '整体状态', key: 'overallStatus', width: 100 },
  { title: '异常总数', dataIndex: 'abnormalCount', key: 'abnormalCount', width: 90, align: 'center' as const },
  { title: '🌊水文工艺', dataIndex: 'hydroStatus', key: 'hydroStatus', width: 100 },
  { title: '⚙️设备状态', dataIndex: 'deviceStatus', key: 'deviceStatus', width: 100 },
  { title: '⚡电气参数', dataIndex: 'electricStatus', key: 'electricStatus', width: 100 },
  { title: '🛡️环境安防', dataIndex: 'securityStatus', key: 'securityStatus', width: 100 },
  { title: '异常明细', dataIndex: 'abnormalDetail', key: 'abnormalDetail', width: 250 },
  { title: '操作', key: 'detail', width: 80 }
]

const overviewData = ref([
  { id: 1, index: 1, stationName: '桥北泵站', region: '新安江街道', monitorTime: '2026-06-26 14:30:00', overallStatus: '🟢 正常', overallStatusLevel: 'normal', abnormalCount: 0, hydroStatus: '✅', deviceStatus: '✅', electricStatus: '✅', securityStatus: '✅', abnormalDetail: '无', rowStatus: 'normal' },
  { id: 2, index: 2, stationName: '溪头泵站', region: '梅城镇', monitorTime: '2026-06-26 14:28:00', overallStatus: '🟡 预警', overallStatusLevel: 'warning', abnormalCount: 3, hydroStatus: '⚠️液位', deviceStatus: '✅', electricStatus: '✅', securityStatus: '❌H₂S, 井盖', abnormalDetail: '液位3.20m预警; H₂S 12.5ppm预警; 井盖异常', rowStatus: 'warning' },
  { id: 3, index: 3, stationName: '桥南泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:25:00', overallStatus: '🟢 正常', overallStatusLevel: 'normal', abnormalCount: 0, hydroStatus: '✅', deviceStatus: '✅', electricStatus: '✅', securityStatus: '✅', abnormalDetail: '无', rowStatus: 'normal' },
  { id: 4, index: 4, stationName: '洋安泵站', region: '更楼街道', monitorTime: '2026-06-26 14:22:00', overallStatus: '🔴 报警', overallStatusLevel: 'alarm', abnormalCount: 6, hydroStatus: '❌液位, ❌压力', deviceStatus: '1#泵故障', electricStatus: '️电压', securityStatus: 'H₂S, ❌井盖, ❌积水', abnormalDetail: '液位3.60m报警; 压力0.72MPa报警; 1#泵故障; 电压9.40kV预警; H₂S 16ppm报警; 井盖/积水异常', rowStatus: 'alarm' },
  { id: 5, index: 5, stationName: '洋溪泵站', region: '乾潭镇', monitorTime: '2026-06-26 14:20:00', overallStatus: ' 正常', overallStatusLevel: 'normal', abnormalCount: 0, hydroStatus: '✅', deviceStatus: '✅', electricStatus: '✅', securityStatus: '✅', abnormalDetail: '无', rowStatus: 'normal' },
  { id: 6, index: 6, stationName: '半岛泵站', region: '大洋镇', monitorTime: '2026-06-26 14:18:00', overallStatus: '🟢 正常', overallStatusLevel: 'normal', abnormalCount: 0, hydroStatus: '✅', deviceStatus: '✅', electricStatus: '✅', securityStatus: '✅', abnormalDetail: '无', rowStatus: 'normal' },
  { id: 7, index: 7, stationName: '电厂泵站', region: '三都镇', monitorTime: '2026-06-26 14:15:00', overallStatus: '🟢 正常', overallStatusLevel: 'normal', abnormalCount: 0, hydroStatus: '✅', deviceStatus: '✅', electricStatus: '✅', securityStatus: '✅', abnormalDetail: '无', rowStatus: 'normal' },
  { id: 8, index: 8, stationName: '江村埠泵站', region: '新安江街道', monitorTime: '2026-06-26 14:12:00', overallStatus: ' 预警', overallStatusLevel: 'warning', abnormalCount: 2, hydroStatus: '⚠️氨氮', deviceStatus: '✅', electricStatus: '❌电压, ❌功率因数', securityStatus: '⚠️H₂S', abnormalDetail: '氨氮2.20mg/L预警; 电压8.90kV报警; 功率因数0.72报警; H₂S 11ppm预警', rowStatus: 'alarm' },
  { id: 9, index: 9, stationName: '假日酒店泵站', region: '梅城镇', monitorTime: '2026-06-26 14:10:00', overallStatus: '🔴 报警', overallStatusLevel: 'alarm', abnormalCount: 8, hydroStatus: '❌流量, ❌液位, ❌压力', deviceStatus: '❌双泵故障', electricStatus: '✅', securityStatus: 'H₂S, ❌温度, ❌井盖', abnormalDetail: '流量95m³/h报警; 液位3.80m报警; 压力0.75MPa报警; 双泵故障; H₂S 18ppm报警; 温度46℃报警; 井盖/积水异常', rowStatus: 'alarm' },
  { id: 10, index: 10, stationName: '兽王泵站', region: '寿昌镇', monitorTime: '2026-06-26 14:08:00', overallStatus: '🟢 正常', overallStatusLevel: 'normal', abnormalCount: 0, hydroStatus: '✅', deviceStatus: '✅', electricStatus: '✅', securityStatus: '✅', abnormalDetail: '无', rowStatus: 'normal' }
])

// ==================== 抽屉 ====================
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerData = ref<any>({})

// ==================== 事件处理 ====================
const handleSearch = () => {
  message.success('查询成功')
  startRefreshTimer()
}

const handleReset = () => {
  searchForm.region = ''
  searchForm.stationName = ''
  searchForm.dateStart = '2026-06-19'
  searchForm.dateEnd = '2026-06-26'
  searchForm.statusFilter = ''
  searchForm.abnormalFilter = ''
  searchForm.waterQualityFilter = ''
  searchForm.refreshInterval = 30
  message.info('已重置查询条件')
}

const handleExport = () => {
  message.info('导出Excel功能待实现')
}

const handleStationDetail = (record: any) => {
  drawerTitle.value = `${record.stationName} - 泵站详情`
  drawerData.value = record
  drawerVisible.value = true
}

const handleDetail = (record: any) => {
  drawerTitle.value = `${record.stationName} - 综合详情`
  drawerData.value = record
  drawerVisible.value = true
}

const handleVideoView = (record: any) => {
  message.info(`查看 ${record.stationName} 实时监控画面`)
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

// ==================== 生命周期 ====================
onMounted(() => {
  startRefreshTimer()
})

onUnmounted(() => {
  stopRefreshTimer()
})
</script>

<style scoped lang="scss">
.pump-monitor-page {
  .page-header {
    margin-bottom: 16px;
    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  .search-card {
    margin-bottom: 12px;

    .search-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: flex-end;
    }

    .search-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .search-label {
      font-size: 14px;
      color: #666;
      white-space: nowrap;
    }

    .search-buttons {
      margin-left: auto;
      gap: 8px;
    }

    .refresh-countdown {
      font-size: 13px;
      color: #1890FF;
      margin-left: 8px;
    }
  }

  .tab-nav {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    padding: 8px 0;

    .tab-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      background: #fff;

      &:hover {
        opacity: 0.8;
      }

      &.active {
        border-width: 2px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      }

      .tab-icon {
        font-size: 16px;
      }

      .tab-badge {
        margin-left: 4px;
      }
    }
  }

  .table-card {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
        font-size: 13px;
        color: #262626;
      }

      .ant-table-tbody > tr > td {
        font-size: 13px;
        color: #595959;
        padding: 10px 8px;
      }

      .row-alarm {
        background-color: #FFF1F0 !important;
      }

      .row-warning {
        background-color: #FFFBE6 !important;
      }

      .row-offline {
        background-color: #FAFAFA !important;
      }
    }

    .station-link {
      color: #1890FF;
      cursor: pointer;
      &:hover { color: #40a9ff; }
    }

    .value-cell {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: monospace;
      font-size: 13px;
    }

    .status-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      &.status-normal { background: #52C41A; }
      &.status-warning { background: #FAAD14; }
      &.status-alarm { background: #FF4D4F; }
      &.status-offline { background: #D9D9D9; }
    }

    .pump-status {
      font-size: 13px;
      &.pump-running { color: #52C41A; }
      &.pump-standby { color: #FAAD14; }
      &.pump-fault { color: #FF4D4F; }
      &.pump-stopped { color: #999; }
    }

    .status-text {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      &.text-normal { color: #52C41A; }
      &.text-alarm { color: #FF4D4F; }
    }

    .overall-status {
      font-weight: 600;
      &.status-normal { color: #52C41A; }
      &.status-warning { color: #FAAD14; }
      &.status-alarm { color: #FF4D4F; }
    }
  }

  .drawer-content {
    .trend-placeholder {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
