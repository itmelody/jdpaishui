<template>
  <div class="realtime-monitoring">
    <a-layout>
      <!-- 左侧菜单 -->
      <a-layout-sider width="200" :style="{ background: '#fff' }">
        <a-menu v-model:selectedKeys="selectedMenu" mode="inline" :items="menuItems" />
      </a-layout-sider>

      <!-- 右侧内容区 -->
      <a-layout-content class="content-wrapper">
        <a-tabs v-model:activeKey="activeTab" :bordered="false">
          <a-tab-pane key="realtime" tab="实时监测">
            <!-- 地图区域 -->
            <a-card title="全域降雨热力分布图" :bordered="false" class="map-card">
              <template #extra>
                <a-space>
                  <a-button size="small"><template #icon><ExpandOutlined /></template>全屏查看</a-button>
                  <a-button size="small"><template #icon><AppstoreOutlined /></template>图层管理</a-button>
                </a-space>
              </template>
              <div class="map-placeholder">
                <div class="map-legend">
                  <span class="legend-item"><span class="dot" style="background:#52c41a"></span>小雨 &lt;10mm</span>
                  <span class="legend-item"><span class="dot" style="background:#fadb14"></span>中雨 10-30mm</span>
                  <span class="legend-item"><span class="dot" style="background:#fa8c16"></span>大雨 30-50mm</span>
                  <span class="legend-item"><span class="dot" style="background:#f5222d"></span>暴雨+ &gt;50mm</span>
                  <span class="legend-item"><span class="dot" style="background:#722ed1"></span>易涝点</span>
                </div>
                <div class="map-body">
                  <span style="color:#bbb;font-size:14px;">🗺️ 地图可视化区域（待接入GIS）</span>
                </div>
              </div>
            </a-card>

            <!-- 筛选条件 -->
            <a-card :bordered="false" class="filter-card">
              <a-form :model="searchForm" layout="inline">
                <a-row :gutter="[12, 12]" align="middle" style="width:100%">
                  <a-col :span="4">
                    <a-form-item label="所属片区:">
                      <a-select v-model:value="searchForm.area" placeholder="全部片区" allow-clear style="width:100%">
                        <a-select-option value="all">全部片区</a-select-option>
                        <a-select-option value="city">城区片区</a-select-option>
                        <a-select-option value="meicheng">梅城片区</a-select-option>
                        <a-select-option value="shouchang">寿昌片区</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">
                    <a-form-item label="降雨等级:">
                      <a-select v-model:value="searchForm.rainLevel" placeholder="全部等级" allow-clear style="width:100%">
                        <a-select-option value="all">全部等级</a-select-option>
                        <a-select-option value="light">小雨</a-select-option>
                        <a-select-option value="medium">中雨</a-select-option>
                        <a-select-option value="heavy">大雨</a-select-option>
                        <a-select-option value="storm">暴雨</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-form-item label="设备状态:">
                      <a-select v-model:value="searchForm.deviceStatus" placeholder="全部状态" allow-clear style="width:100%">
                        <a-select-option value="all">全部状态</a-select-option>
                        <a-select-option value="online">在线</a-select-option>
                        <a-select-option value="offline">离线</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-form-item label="时间维度:">
                      <a-select v-model:value="searchForm.timeDimension" style="width:100%">
                        <a-select-option value="realtime">实时数据</a-select-option>
                        <a-select-option value="hourly">小时数据</a-select-option>
                        <a-select-option value="daily">日数据</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-form-item label="预警状态:">
                      <a-select v-model:value="searchForm.warningStatus" placeholder="全部状态" allow-clear style="width:100%">
                        <a-select-option value="all">全部状态</a-select-option>
                        <a-select-option value="normal">正常</a-select-option>
                        <a-select-option value="yellow">黄色预警</a-select-option>
                        <a-select-option value="orange">橙色预警</a-select-option>
                        <a-select-option value="red">红色预警</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">
                    <a-form-item>
                      <a-input v-model:value="searchForm.keyword" placeholder="搜索站点名称/编号" allow-clear />
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-space>
                      <a-button @click="handleReset">重置</a-button>
                      <a-button type="primary" @click="handleSearch">查询</a-button>
                    </a-space>
                  </a-col>
                </a-row>
              </a-form>
            </a-card>

            <!-- 实时监测列表 -->
            <a-card title="雨量站实时监测列表" :bordered="false" class="table-card">
              <a-table
                :columns="columns"
                :data-source="dataSource"
                :pagination="pagination"
                row-key="id"
                :scroll="{ x: 1500 }"
                size="small"
                class="data-table"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'instantRain'">
                    <span :style="{ color: getRainColor(record.instantRain), fontWeight: 600 }">{{ record.instantRain }}</span>
                  </template>
                  <template v-if="column.key === 'hourRain'">
                    <span :style="{ color: getRainColor(record.hourRain), fontWeight: 600 }">{{ record.hourRain }}</span>
                  </template>
                  <template v-if="column.key === 'rainLevel'">
                    <a-tag :color="getLevelColor(record.rainLevel)">{{ record.rainLevel }}</a-tag>
                  </template>
                  <template v-if="column.key === 'warningStatus'">
                    <a-tag :color="getWarningColor(record.warningStatus)">{{ record.warningStatus }}</a-tag>
                  </template>
                  <template v-if="column.key === 'signal'">
                    <span>📶 {{ record.signal }}</span>
                  </template>
                  <template v-if="column.key === 'action'">
                    <a-space>
                      <a-button type="link" size="small"><template #icon><DownloadOutlined /></template></a-button>
                      <a-button type="link" size="small"><template #icon><ReloadOutlined /></template></a-button>
                      <a-button type="link" size="small"><template #icon><EditOutlined /></template></a-button>
                      <a-button type="link" size="small" danger><template #icon><DeleteOutlined /></template></a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
              <div class="table-footer">
                <a-space>
                  <a-button style="background:#4CAF50;color:#fff;border-color:#4CAF50;">批量导出</a-button>
                  <a-button style="background:#4CAF50;color:#fff;border-color:#4CAF50;">刷新数据</a-button>
                </a-space>
              </div>
            </a-card>

            <!-- 降雨过程趋势分析 -->
            <a-card :bordered="false" class="chart-card">
              <template #title>
                <a-space>
                  <span>降雨过程趋势分析</span>
                  <a-select :value="'JD-Y002'" style="width:200px" size="small">
                    <a-select-option value="JD-Y001">城区片区站 (JD-Y001)</a-select-option>
                    <a-select-option value="JD-Y002">城区片区站 (JD-Y002)</a-select-option>
                  </a-select>
                  <a-select :value="'minute'" style="width:100px" size="small">
                    <a-select-option value="minute">分钟级</a-select-option>
                    <a-select-option value="hour">小时级</a-select-option>
                  </a-select>
                  <a-button type="primary" size="small">查询</a-button>
                </a-space>
              </template>
              <div ref="chartRef" class="trend-chart"></div>
              <div class="stats-cards">
                <div class="stat-item">
                  <span class="stat-label">本次降雨峰值</span>
                  <span class="stat-value" style="color:#f5222d;">56.3 <small>mm/h</small></span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">峰值出现时间</span>
                  <span class="stat-value">13:25</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">降雨持续时长</span>
                  <span class="stat-value">4.5 <small>小时</small></span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">累计降雨量</span>
                  <span class="stat-value">92.1 <small>mm</small></span>
                </div>
              </div>
            </a-card>

            <!-- 历史降雨复盘报表 -->
            <a-card title="历史降雨复盘报表" :bordered="false" class="history-card">
              <template #extra>
                <a-space>
                  <a-date-picker v-model:value="historyDate" size="small" placeholder="统计日期" />
                  <a-select :value="'all'" style="width:120px" size="small">
                    <a-select-option value="all">全部片区</a-select-option>
                    <a-select-option value="city">城区片区</a-select-option>
                  </a-select>
                  <a-button size="small">导出 Excel</a-button>
                  <a-button size="small">导出 PDF</a-button>
                </a-space>
              </template>
              <a-table
                :columns="historyColumns"
                :data-source="historyData"
                :pagination="false"
                row-key="date"
                size="small"
                class="data-table"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'maxHourRain'">
                    <span :style="{ color: record.maxHourRain >= 50 ? '#f5222d' : record.maxHourRain >= 30 ? '#fa8c16' : '#333', fontWeight: 600 }">
                      {{ record.maxHourRain }}
                    </span>
                  </template>
                </template>
              </a-table>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="waterLevel" tab="水位监测">
            <a-empty description="水位监测功能开发中" />
          </a-tab-pane>
          <a-tab-pane key="flow" tab="流量监测">
            <a-empty description="流量监测功能开发中" />
          </a-tab-pane>
          <a-tab-pane key="waterQuality" tab="水质监测">
            <a-empty description="水质监测功能开发中" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ExpandOutlined, AppstoreOutlined, DownloadOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'

// 左侧菜单
const selectedMenu = ref<string[]>(['rainfall'])
const menuItems = [
  { key: 'rainfall', label: '雨情监测' },
  { key: 'waterLevel', label: '水位监测' },
  { key: 'flow', label: '流量监测' },
  { key: 'waterQuality', label: '水质监测' },
  { key: 'device', label: '设备管理' }
]

const activeTab = ref<string>('realtime')

// 筛选表单
const searchForm = reactive({
  area: 'all',
  rainLevel: 'all',
  deviceStatus: 'all',
  timeDimension: 'realtime',
  warningStatus: 'all',
  keyword: ''
})

// 表格列配置
const columns = [
  { title: '站点编号', dataIndex: 'stationId', key: 'stationId', width: 110 },
  { title: '站点名称', dataIndex: 'stationName', key: 'stationName', width: 140 },
  { title: '所属片区', dataIndex: 'area', key: 'area', width: 100 },
  { title: '实时瞬时雨量(MM/MIN)', dataIndex: 'instantRain', key: 'instantRain', width: 160, align: 'center' },
  { title: '小时累计雨量(MM)', dataIndex: 'hourRain', key: 'hourRain', width: 140, align: 'center' },
  { title: '24H累计雨量(MM)', dataIndex: 'dayRain', key: 'dayRain', width: 140, align: 'center' },
  { title: '降雨等级', dataIndex: 'rainLevel', key: 'rainLevel', width: 100, align: 'center' },
  { title: '预警状态', dataIndex: 'warningStatus', key: 'warningStatus', width: 100, align: 'center' },
  { title: '信号强度', dataIndex: 'signal', key: 'signal', width: 90, align: 'center' },
  { title: '最后更新', dataIndex: 'lastUpdate', key: 'lastUpdate', width: 160 },
  { title: '操作', key: 'action', fixed: 'right', width: 150 }
]

// 模拟数据
const dataSource = ref([
  { id: 1, stationId: 'JD-Y001', stationName: '新安江站', area: '城区片区', instantRain: 0.45, hourRain: 42.5, dayRain: 78.6, rainLevel: '暴雨', warningStatus: '橙色预警', signal: '强', lastUpdate: '2024-05-20 14:35:22' },
  { id: 2, stationId: 'JD-Y002', stationName: '洋溪站', area: '城区片区', instantRain: 0.82, hourRain: 56.3, dayRain: 92.1, rainLevel: '大暴雨', warningStatus: '红色预警', signal: '强', lastUpdate: '2024-05-20 14:35:18' },
  { id: 3, stationId: 'JD-Y005', stationName: '梅城站', area: '梅城片区', instantRain: 0.31, hourRain: 22.8, dayRain: 45.2, rainLevel: '大雨', warningStatus: '黄色预警', signal: '中', lastUpdate: '2024-05-20 14:34:55' },
  { id: 4, stationId: 'JD-Y008', stationName: '寿昌站', area: '寿昌片区', instantRain: 0.15, hourRain: 12.3, dayRain: 28.7, rainLevel: '中雨', warningStatus: '正常', signal: '强', lastUpdate: '2024-05-20 14:35:10' },
  { id: 5, stationId: 'JD-Y010', stationName: '大同站', area: '寿昌片区', instantRain: 0.08, hourRain: 5.6, dayRain: 15.3, rainLevel: '小雨', warningStatus: '正常', signal: '中', lastUpdate: '2024-05-20 14:34:42' },
  { id: 6, stationId: 'JD-Y012', stationName: '乾潭站', area: '梅城片区', instantRain: 0.00, hourRain: 0.0, dayRain: 0.0, rainLevel: '无雨', warningStatus: '正常', signal: '强', lastUpdate: '2024-05-20 14:35:05' }
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 52,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 历史报表
const historyDate = ref<any>(null)
const historyColumns = [
  { title: '统计日期', dataIndex: 'date', key: 'date', width: 120 },
  { title: '降雨天数', dataIndex: 'rainDays', key: 'rainDays', width: 90, align: 'center' },
  { title: '累计降雨量(MM)', dataIndex: 'totalRain', key: 'totalRain', width: 140, align: 'center' },
  { title: '最大小时雨强(MM/H)', dataIndex: 'maxHourRain', key: 'maxHourRain', width: 160, align: 'center' },
  { title: '蓝色预警次数', dataIndex: 'blueWarning', key: 'blueWarning', width: 110, align: 'center' },
  { title: '黄色预警次数', dataIndex: 'yellowWarning', key: 'yellowWarning', width: 110, align: 'center' },
  { title: '橙色预警次数', dataIndex: 'orangeWarning', key: 'orangeWarning', width: 110, align: 'center' },
  { title: '红色预警次数', dataIndex: 'redWarning', key: 'redWarning', width: 110, align: 'center' }
]

const historyData = ref([
  { date: '2024-05-20', rainDays: 1, totalRain: 2186.3, maxHourRain: 56.3, blueWarning: 5, yellowWarning: 3, orangeWarning: 2, redWarning: 1 },
  { date: '2024-05-19', rainDays: 1, totalRain: 872.5, maxHourRain: 24.8, blueWarning: 8, yellowWarning: 2, orangeWarning: 0, redWarning: 0 },
  { date: '2024-05-18', rainDays: 0, totalRain: 0.0, maxHourRain: 0.0, blueWarning: 0, yellowWarning: 0, orangeWarning: 0, redWarning: 0 }
])

// 颜色辅助函数
const getRainColor = (val: number) => {
  if (val >= 50) return '#f5222d'
  if (val >= 30) return '#fa8c16'
  if (val >= 10) return '#fadb14'
  if (val > 0) return '#52c41a'
  return '#999'
}
const getLevelColor = (level: string) => {
  const map: Record<string, string> = { '暴雨': 'red', '大暴雨': 'volcano', '大雨': 'orange', '中雨': 'gold', '小雨': 'green', '无雨': 'default' }
  return map[level] || 'default'
}
const getWarningColor = (status: string) => {
  const map: Record<string, string> = { '红色预警': 'red', '橙色预警': 'orange', '黄色预警': 'gold', '正常': 'green' }
  return map[status] || 'default'
}

// 搜索/重置
const handleSearch = () => { message.success('查询功能待实现') }
const handleReset = () => {
  searchForm.area = 'all'
  searchForm.rainLevel = 'all'
  searchForm.deviceStatus = 'all'
  searchForm.timeDimension = 'realtime'
  searchForm.warningStatus = 'all'
  searchForm.keyword = ''
  message.info('已重置搜索条件')
}

// ECharts 趋势图
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
  const data = [2, 3, 5, 8, 15, 28, 45, 56, 42, 30, 22, 18, 15, 12, 10, 8, 5, 4, 3, 2, 1, 1, 0, 0]
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: hours, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', name: '降雨量 [mm]', axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', data, itemStyle: { color: '#1890ff', borderRadius: [3, 3, 0, 0] }, barWidth: '60%' }],
    grid: { left: 60, right: 20, top: 30, bottom: 30 }
  })
}

const handleResize = () => { chartInstance?.resize() }

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.realtime-monitoring {
  height: 100%;

  .content-wrapper {
    padding: 0 16px;
    background: #f0f2f5;
    overflow-y: auto;
  }

  .map-card {
    margin-bottom: 12px;

    .map-placeholder {
      .map-legend {
        margin-bottom: 12px;
        display: flex;
        gap: 16px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;

          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
          }
        }
      }

      .map-body {
        height: 280px;
        background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #d9e8f7;
      }
    }
  }

  .filter-card {
    margin-bottom: 12px;

    :deep(.ant-form-item) {
      margin-bottom: 8px;
      width: 100%;
    }

    :deep(.ant-form-item-label) {
      font-size: 13px;
    }
  }

  .table-card {
    margin-bottom: 12px;

    .data-table {
      :deep(.ant-table-thead > tr > th) {
        background: #E3F2FD;
        font-weight: 600;
        font-size: 13px;
      }
    }

    .table-footer {
      margin-top: 12px;
      text-align: right;
    }
  }

  .chart-card {
    margin-bottom: 12px;

    .trend-chart {
      height: 300px;
      margin-bottom: 16px;
    }

    .stats-cards {
      display: flex;
      gap: 24px;
      justify-content: center;
      padding: 16px 0;
      border-top: 1px solid #f0f0f0;

      .stat-item {
        text-align: center;
        padding: 12px 24px;
        background: #fafafa;
        border-radius: 8px;
        min-width: 160px;

        .stat-label {
          display: block;
          font-size: 13px;
          color: #888;
          margin-bottom: 8px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;

          small {
            font-size: 13px;
            font-weight: 400;
            color: #666;
          }
        }
      }
    }
  }

  .history-card {
    margin-bottom: 16px;

    .data-table {
      :deep(.ant-table-thead > tr > th) {
        background: #E3F2FD;
        font-weight: 600;
        font-size: 13px;
      }
    }
  }
}
</style>
<template>
  <div class="realtime-monitoring">
    <a-card title="实时监测" :bordered="false">
      <div class="empty-state">
        <a-empty description="实时监测内容待开发" />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 实时监测页面
</script>

<style scoped lang="scss">
.realtime-monitoring {
  .empty-state {
    padding: 60px 0;
    text-align: center;
  }
}
</style>
