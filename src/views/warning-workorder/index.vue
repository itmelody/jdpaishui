<template>
  <div class="warning-workorder">
    <a-layout>
      <!-- 左侧菜单 -->
      <a-layout-sider width="200" :style="{ background: '#fff' }">
        <a-menu
          v-model:selectedKeys="selectedMenu"
          mode="inline"
          :items="menuItems"
          @click="handleMenuClick"
        />
      </a-layout-sider>

      <!-- 右侧内容区 -->
      <a-layout-content class="content-wrapper">
        <a-tabs v-model:activeKey="activeTab" :bordered="false" @change="handleTabChange">
          <!-- 预警管理 -->
          <a-tab-pane key="warning-management" tab="预警管理">
            <!-- 顶部统计卡片区域 -->
            <div class="stats-cards">
              <a-card :bordered="false" class="stat-card total-card">
                <div class="card-header"><span class="card-title">预警总数</span><bell-outlined class="card-icon" /></div>
                <div class="card-content"><div class="card-number">86</div><div class="card-subtitle">今日累计</div></div>
                <div class="ring-chart" ref="totalChartRef"></div>
              </a-card>
              <a-card :bordered="false" class="stat-card red-card">
                <div class="card-header"><span class="card-title">红色预警 (特急)</span><exclamation-circle-outlined class="card-icon" /></div>
                <div class="card-content"><div class="card-number red">5</div><div class="card-subtitle red">未处置</div></div>
                <div class="ring-chart" ref="redChartRef"></div>
              </a-card>
              <a-card :bordered="false" class="stat-card orange-card">
                <div class="card-header"><span class="card-title">橙色预警 (紧急)</span><warning-outlined class="card-icon" /></div>
                <div class="card-content"><div class="card-number orange">12</div><div class="card-subtitle orange">未办结</div></div>
                <div class="ring-chart" ref="orangeChartRef"></div>
              </a-card>
              <a-card :bordered="false" class="stat-card yellow-card">
                <div class="card-header"><span class="card-title">黄色预警 (一般紧急)</span><info-circle-outlined class="card-icon" /></div>
                <div class="card-content"><div class="card-number yellow">28</div><div class="card-subtitle yellow">未办结</div></div>
                <div class="ring-chart" ref="yellowChartRef"></div>
              </a-card>
              <a-card :bordered="false" class="stat-card blue-card">
                <div class="card-header"><span class="card-title">蓝色预警 (提示)</span><bell-outlined class="card-icon" /></div>
                <div class="card-content"><div class="card-number blue">41</div><div class="card-subtitle blue">未办结</div></div>
                <div class="ring-chart" ref="blueChartRef"></div>
              </a-card>
              <a-card :bordered="false" class="stat-card rate-card">
                <div class="card-header"><span class="card-title">预警办结率</span><line-chart-outlined class="card-icon" /></div>
                <div class="card-content"><div class="card-number rate">68.6%</div><div class="card-subtitle rate">逾期: 3条</div></div>
                <div class="ring-chart" ref="rateChartRef"></div>
              </a-card>
            </div>

            <!-- 视图切换 -->
            <div class="view-switch">
              <a-button-group>
                <a-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
                  <table-outlined /> 列表视图
                </a-button>
                <a-button :type="viewMode === 'map' ? 'primary' : 'default'" @click="viewMode = 'map'">
                  <environment-outlined /> 地图视图
                </a-button>
              </a-button-group>
            </div>

            <!-- 搜索表单 -->
            <a-card :bordered="false" class="search-card">
              <a-form :model="searchForm" layout="inline" class="search-form">
                <a-row :gutter="[16, 16]">
                  <a-col :span="6"><a-form-item label="时间范围"><a-select v-model:value="searchForm.timeRange" style="width: 100%"><a-select-option value="today">今日</a-select-option><a-select-option value="week">本周</a-select-option><a-select-option value="month">本月</a-select-option></a-select></a-form-item></a-col>
                  <a-col :span="6"><a-form-item label="预警等级"><a-select v-model:value="searchForm.level" style="width: 100%"><a-select-option value="all">全部</a-select-option><a-select-option value="red">红色</a-select-option><a-select-option value="orange">橙色</a-select-option><a-select-option value="yellow">黄色</a-select-option><a-select-option value="blue">蓝色</a-select-option></a-select></a-form-item></a-col>
                  <a-col :span="6"><a-form-item label="预警类型"><a-select v-model:value="searchForm.type" style="width: 100%"><a-select-option value="all">全部类型</a-select-option><a-select-option value="road">道路积水</a-select-option><a-select-option value="water">管网水位超限</a-select-option><a-select-option value="rain">雨量超标</a-select-option><a-select-option value="equipment">泵站设备故障</a-select-option><a-select-option value="sewage">污水溢流</a-select-option><a-select-option value="manhole">井盖缺失/移位</a-select-option><a-select-option value="quality">水质超标</a-select-option></a-select></a-form-item></a-col>
                  <a-col :span="6"><a-form-item label="所属片区"><a-select v-model:value="searchForm.area" style="width: 100%"><a-select-option value="all">全部片区</a-select-option><a-select-option value="main">主城区</a-select-option><a-select-option value="xinan">新安江街道</a-select-option><a-select-option value="yangxi">洋溪街道</a-select-option><a-select-option value="genglou">更楼街道</a-select-option></a-select></a-form-item></a-col>
                  <a-col :span="6"><a-form-item label="预警状态"><a-select v-model:value="searchForm.status" style="width: 100%"><a-select-option value="all">全部状态</a-select-option><a-select-option value="pending">未派发</a-select-option><a-select-option value="processing">处置中</a-select-option><a-select-option value="overdue">逾期未处置</a-select-option><a-select-option value="dispatched">已派发</a-select-option></a-select></a-form-item></a-col>
                  <a-col :span="12"><a-form-item label="搜索"><a-input v-model:value="searchForm.keyword" placeholder="点位名称/设备编号" style="width: 100%"><template #prefix><search-outlined /></template></a-input></a-form-item></a-col>
                  <a-col :span="6" style="text-align: right;"><a-space><a-button @click="handleReset"><reload-outlined /> 重置</a-button><a-button type="primary" @click="handleSearch"><search-outlined /> 查询</a-button></a-space></a-col>
                </a-row>
              </a-form>
            </a-card>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <a-space>
                <a-button type="primary" style="background-color: #52c41a; border-color: #52c41a;"><check-circle-outlined /> 批量接单</a-button>
                <a-button type="primary"><user-add-outlined /> 批量派单</a-button>
                <a-button type="primary" style="background-color: #722ed1; border-color: #722ed1;"><download-outlined /> 导出数据</a-button>
              </a-space>
              <div class="total-records">共 <strong>86</strong> 条记录</div>
            </div>

            <!-- 数据表格 -->
            <a-card :bordered="false" class="table-card">
              <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :row-selection="rowSelection" bordered>
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'level'">
                    <a-tag v-if="record.level === 'red'" color="red">红色</a-tag>
                    <a-tag v-else-if="record.level === 'orange'" color="orange">橙色</a-tag>
                    <a-tag v-else-if="record.level === 'yellow'" color="gold">黄色</a-tag>
                    <a-tag v-else-if="record.level === 'blue'" color="blue">蓝色</a-tag>
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag v-if="record.status === 'processing'" color="processing">处置中</a-tag>
                    <a-tag v-else-if="record.status === 'pending'" color="default">未派发</a-tag>
                    <a-tag v-else-if="record.status === 'overdue'" color="error">逾期未处置</a-tag>
                    <a-tag v-else-if="record.status === 'dispatched'" color="warning">已派发</a-tag>
                  </template>
                  <template v-else-if="column.key === 'remainingTime'">
                    <span :class="{'overtime': record.remainingTime.startsWith('-')}">{{ record.remainingTime }}</span>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a-space>
                      <a-button type="link" size="small"><eye-outlined /> 详情</a-button>
                      <a-button type="link" size="small" style="color: #52c41a;"><environment-outlined /> 定位</a-button>
                      <a-button type="link" size="small" style="color: #fa8c16;"><user-outlined /> 派单</a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </a-card>
          </a-tab-pane>

          <!-- 预警规则配置 -->
          <a-tab-pane key="rule-config" tab="预警规则配置">
            <RuleConfig />
          </a-tab-pane>

          <!-- 工单全流程跟踪 -->
          <a-tab-pane key="workflow-tracking" tab="工单全流程跟踪">
            <DevelopmentPlaceholder />
          </a-tab-pane>

          <!-- 逾期督办 -->
          <a-tab-pane key="overdue-supervision" tab="逾期督办">
            <DevelopmentPlaceholder />
          </a-tab-pane>

          <!-- 工单统计复盘 -->
          <a-tab-pane key="statistics-review" tab="工单统计复盘">
            <DevelopmentPlaceholder />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  BellOutlined, ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined,
  LineChartOutlined, TableOutlined, EnvironmentOutlined, SearchOutlined, ReloadOutlined,
  CheckCircleOutlined, UserAddOutlined, DownloadOutlined, EyeOutlined, UserOutlined
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import RuleConfig from './rule-config.vue'
import DevelopmentPlaceholder from '../inspection-maintenance/DevelopmentPlaceholder.vue'

// 左侧菜单配置
const selectedMenu = ref<string[]>(['warning-management'])
const menuItems = [
  { key: 'warning-management', label: '预警管理' },
  { key: 'rule-config', label: '预警规则配置' },
  { key: 'workflow-tracking', label: '工单全流程跟踪' },
  { key: 'overdue-supervision', label: '逾期督办' },
  { key: 'statistics-review', label: '工单统计复盘' }
]

// 当前激活的标签页
const activeTab = ref<string>('warning-management')

// 菜单点击处理 —— 双向联动
const handleMenuClick = ({ key }: { key: string }) => {
  selectedMenu.value = [key]
  activeTab.value = key
}

// 标签页切换联动菜单
const handleTabChange = (key: string) => {
  selectedMenu.value = [key]
}

// 视图模式
const viewMode = ref<'list' | 'map'>('list')

// 搜索表单
const searchForm = reactive({ timeRange: 'today', level: 'all', type: 'all', area: 'all', status: 'all', keyword: '' })

// 表格列配置
const columns = [
  { title: '', dataIndex: 'selection', key: 'selection', width: 50 },
  { title: '预警编号', dataIndex: 'id', key: 'id', width: 150 },
  { title: '预警等级', dataIndex: 'level', key: 'level', width: 100 },
  { title: '预警类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '点位地址', dataIndex: 'address', key: 'address', ellipsis: true },
  { title: '关联设备', dataIndex: 'device', key: 'device', width: 120 },
  { title: '预警触发值', dataIndex: 'triggerValue', key: 'triggerValue', width: 100 },
  { title: '阈值标准', dataIndex: 'threshold', key: 'threshold', width: 100 },
  { title: '触发时间', dataIndex: 'triggerTime', key: 'triggerTime', width: 160 },
  { title: '当前状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '责任人', dataIndex: 'responsible', key: 'responsible', width: 140 },
  { title: '剩余时长', dataIndex: 'remainingTime', key: 'remainingTime', width: 100 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' }
]

// 表格数据
const dataSource = ref([
  { id: 'YJ20240615000001', level: 'red', type: '道路积水', address: '建德市主城区 新安江路 与 世纪大道交叉口', device: 'JC-2001, CAM-89', triggerValue: '45cm', threshold: '≤30cm', triggerTime: '2024-06-15 08:23:15', status: 'processing', responsible: '张师傅 13857612345', remainingTime: '01:25:33' },
  { id: 'YJ20240615000002', level: 'red', type: '管网水位超限', address: '新安江街道 环城西路 排水管网段', device: 'WT-1028', triggerValue: '4.2m', threshold: '≤3.5m', triggerTime: '2024-06-15 07:45:08', status: 'pending', responsible: '-', remainingTime: '03:12:15' },
  { id: 'YJ20240615000003', level: 'yellow', type: '雨量超标', address: '洋溪街道 雨水量监测站 3号点', device: 'Y-005', triggerValue: '55mm/h', threshold: '≤40mm/h', triggerTime: '2024-06-15 09:10:22', status: 'processing', responsible: '李师傅 13587654321', remainingTime: '04:30:12' },
  { id: 'YJ20240615000004', level: 'red', type: '泵站设备故障', address: '更楼街道 第一泵站 1号机组', device: 'P-001', triggerValue: '电流异常 15A', threshold: '≤10A', triggerTime: '2024-06-15 06:30:45', status: 'dispatched', responsible: '王师傅 13957612345', remainingTime: '12:15:08' },
  { id: 'YJ20240615000005', level: 'red', type: '污水溢流', address: '建德市主城区 江滨公园 截流井', device: 'O-012', triggerValue: '1.2m³/s', threshold: '≤0.5m³/s', triggerTime: '2024-06-15 08:55:33', status: 'overdue', responsible: '赵师傅 13657612345', remainingTime: '-00:35:10' },
  { id: 'YJ20240615000006', level: 'red', type: '道路积水', address: '建德市主城区 迎宾大道 下穿立交', device: 'WL-008, CAM-12', triggerValue: '82cm', threshold: '≤30cm', triggerTime: '2024-06-15 09:05:12', status: 'pending', responsible: '-', remainingTime: '02:45:18' },
  { id: 'YJ20240615000007', level: 'yellow', type: '井盖缺失/移位', address: '新安江街道 环湖北路 路灯旁', device: '人工上报', triggerValue: '缺失', threshold: '完好', triggerTime: '2024-06-15 07:15:40', status: 'processing', responsible: '刘师傅 13757612345', remainingTime: '05:20:40' },
  { id: 'YJ20240615000008', level: 'yellow', type: '水质超标', address: '梅城镇 出水口断面', device: 'WQ-023', triggerValue: 'COD 58mg/L', threshold: '≤50mg/L', triggerTime: '2024-06-15 05:20:18', status: 'pending', responsible: '-', remainingTime: '06:18:22' }
])

// 分页配置
const pagination = reactive({ current: 1, pageSize: 10, total: 86, showSizeChanger: true, showQuickJumper: true, showTotal: (total: number) => `共 ${total} 条` })

// 行选择
const selectedRowKeys = ref<string[]>([])
const rowSelection = { selectedRowKeys, onChange: (keys: string[]) => { selectedRowKeys.value = keys } }

// 图表
const totalChartRef = ref<HTMLElement>()
const redChartRef = ref<HTMLElement>()
const orangeChartRef = ref<HTMLElement>()
const yellowChartRef = ref<HTMLElement>()
const blueChartRef = ref<HTMLElement>()
const rateChartRef = ref<HTMLElement>()

const initRingChart = (el: HTMLElement | undefined, value: number, total: number, color: string) => {
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption({
    series: [{ type: 'pie', radius: ['70%', '90%'], avoidLabelOverlap: false, data: [{ value, itemStyle: { color } }, { value: total - value, itemStyle: { color: '#e8e8e8' } }], label: { show: false }, emphasis: { scale: false } }]
  })
}

const handleSearch = () => { console.log('Search:', searchForm) }
const handleReset = () => { searchForm.timeRange = 'today'; searchForm.level = 'all'; searchForm.type = 'all'; searchForm.area = 'all'; searchForm.status = 'all'; searchForm.keyword = '' }

onMounted(() => {
  initRingChart(totalChartRef.value, 86, 100, '#1890ff')
  initRingChart(redChartRef.value, 5, 100, '#ff4d4f')
  initRingChart(orangeChartRef.value, 12, 100, '#fa8c16')
  initRingChart(yellowChartRef.value, 28, 100, '#faad14')
  initRingChart(blueChartRef.value, 41, 100, '#1890ff')
  initRingChart(rateChartRef.value, 68.6, 100, '#52c41a')
})
</script>

<style scoped lang="scss">
.warning-workorder {
  height: 100%;

  .content-wrapper {
    padding: 0 16px;
    background: #f0f2f5;
    overflow-y: auto;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    .stat-card {
      position: relative;
      padding: 16px;
      .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
        .card-title { font-size: 14px; color: #666; }
        .card-icon { font-size: 18px; opacity: 0.6; }
      }
      .card-content {
        .card-number { font-size: 28px; font-weight: 600; color: #333; margin-bottom: 4px;
          &.red { color: #ff4d4f; } &.orange { color: #fa8c16; } &.yellow { color: #faad14; } &.blue { color: #1890ff; } &.rate { color: #52c41a; }
        }
        .card-subtitle { font-size: 12px; color: #999;
          &.red { color: #ff4d4f; } &.orange { color: #fa8c16; } &.yellow { color: #faad14; } &.blue { color: #1890ff; } &.rate { color: #ff4d4f; }
        }
      }
      .ring-chart { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 60px; height: 60px; }
    }
  }

  .view-switch { text-align: right; margin-bottom: 16px; }
  .search-card { margin-bottom: 16px; }
  .action-buttons { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
    .total-records { font-size: 14px; color: #666; }
  }
  .table-card {
    :deep(.ant-table) { .overtime { color: #ff4d4f; font-weight: 600; } }
  }
}
</style>
