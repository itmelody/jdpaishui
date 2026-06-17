<template>
  <div class="inspection-maintenance">
    <!-- 左侧菜单 -->
    <a-layout>
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
        <!-- 数据总览标签页 -->
        <a-tabs v-model:activeKey="activeTab" class="main-tabs">
          <a-tab-pane key="overview" tab="数据总览">
            <!-- 待办事项 -->
            <a-card title="待办事项" :bordered="false" class="section-card">
              <a-row :gutter="16">
                <a-col :span="4">
                  <div class="todo-item">
                    <div class="icon-circle blue">
                      <FileTextOutlined />
                    </div>
                    <div class="todo-info">
                      <div class="todo-label">养护计划</div>
                      <div class="todo-count">0</div>
                      <div class="progress-placeholder"></div>
                    </div>
                  </div>
                </a-col>
                <a-col :span="5">
                  <div class="todo-item">
                    <div class="icon-circle cyan">
                      <ToolOutlined />
                    </div>
                    <div class="todo-info">
                      <div class="todo-label">管网养护</div>
                      <div class="todo-count">909个</div>
                      <a-progress :percent="75" :showInfo="false" strokeColor="#1890ff" />
                    </div>
                  </div>
                </a-col>
                <a-col :span="5">
                  <div class="todo-item">
                    <div class="icon-circle purple">
                      <SearchOutlined />
                    </div>
                    <div class="todo-info">
                      <div class="todo-label">排口巡查</div>
                      <div class="todo-count">329次</div>
                      <a-progress :percent="45" :showInfo="false" strokeColor="#722ed1" />
                    </div>
                  </div>
                </a-col>
                <a-col :span="5">
                  <div class="todo-item">
                    <div class="icon-circle orange">
                      <EnvironmentOutlined />
                    </div>
                    <div class="todo-info">
                      <div class="todo-label">工地巡查</div>
                      <div class="todo-count">196个</div>
                      <a-progress :percent="60" :showInfo="false" strokeColor="#fa8c16" />
                    </div>
                  </div>
                </a-col>
                <a-col :span="5">
                  <div class="todo-item">
                    <div class="icon-circle light-blue">
                      <BellOutlined />
                    </div>
                    <div class="todo-info">
                      <div class="todo-label">事件上报</div>
                      <div class="todo-count">9个</div>
                      <div class="progress-placeholder"></div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </a-card>

            <!-- 数据统计 -->
            <a-card title="数据统计" :bordered="false" class="section-card">
              <a-row :gutter="16">
                <!-- 养护情况 -->
                <a-col :span="12">
                  <div class="stats-box maintenance-box">
                    <div class="box-header">
                      <a-tag color="blue">养护情况</a-tag>
                      <a-radio-group size="small" v-model:value="maintenancePeriod">
                        <a-radio-button value="yesterday">昨日</a-radio-button>
                        <a-radio-button value="week">本周</a-radio-button>
                        <a-radio-button value="quarter">本季度</a-radio-button>
                        <a-radio-button value="year">本年</a-radio-button>
                      </a-radio-group>
                    </div>
                    <div class="box-content">
                      <a-row :gutter="16">
                        <a-col :span="12">
                          <div class="stat-item green">
                            <div class="stat-icon">
                              <ApartmentOutlined />
                            </div>
                            <div class="stat-info">
                              <div class="stat-label">管网</div>
                              <div class="stat-value">3.36 km</div>
                            </div>
                          </div>
                        </a-col>
                        <a-col :span="12">
                          <div class="stat-item blue">
                            <div class="stat-icon">
                              <InboxOutlined />
                            </div>
                            <div class="stat-info">
                              <div class="stat-label">井室</div>
                              <div class="stat-value">540 个</div>
                            </div>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                </a-col>
                
                <!-- 巡查情况 -->
                <a-col :span="12">
                  <div class="stats-box inspection-box">
                    <div class="box-header">
                      <a-tag color="green">巡查情况</a-tag>
                      <a-radio-group size="small" v-model:value="inspectionPeriod">
                        <a-radio-button value="yesterday">昨日</a-radio-button>
                        <a-radio-button value="week">本周</a-radio-button>
                        <a-radio-button value="quarter">本季度</a-radio-button>
                        <a-radio-button value="year">本年</a-radio-button>
                      </a-radio-group>
                    </div>
                    <div class="box-content">
                      <div class="inspection-chart-wrapper">
                        <div ref="inspectionChartRef" class="inspection-chart"></div>
                        <div class="chart-legend">
                          <div class="legend-item">
                            <span class="dot purple"></span>
                            <span>工地巡查 3</span>
                          </div>
                          <div class="legend-item">
                            <span class="dot yellow"></span>
                            <span>排口巡查 2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </a-card>

            <!-- 底部三个表格区域 -->
            <a-row :gutter="16">
              <!-- 工地巡查 -->
              <a-col :span="8">
                <a-card title="工地巡查" :bordered="false" class="table-card">
                  <a-table
                    :columns="constructionColumns"
                    :data-source="constructionData"
                    :pagination="false"
                    size="small"
                    row-key="id"
                  >
                    <template #bodyCell="{ column, text }">
                      <template v-if="column.key === 'siteName'">
                        <span class="text-ellipsis" :title="text">{{ text }}</span>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>
              
              <!-- 排口检查 -->
              <a-col :span="8">
                <a-card title="排口检查" :bordered="false" class="table-card">
                  <a-table
                    :columns="outletColumns"
                    :data-source="outletData"
                    :pagination="false"
                    size="small"
                    row-key="id"
                  />
                </a-card>
              </a-col>
              
              <!-- 事件上报 -->
              <a-col :span="8">
                <a-card title="事件上报" :bordered="false" class="table-card">
                  <a-table
                    :columns="eventColumns"
                    :data-source="eventData"
                    :pagination="false"
                    size="small"
                    row-key="id"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'rank'">
                        <div :class="['rank-badge', `rank-${record.rank}`]">
                          {{ record.rank }}
                        </div>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
          
          <!-- 计划管理标签页 -->
          <a-tab-pane key="plan" tab="计划管理">
            <DevelopmentPlaceholder />
          </a-tab-pane>
          
          <!-- 任务管理标签页 -->
          <a-tab-pane key="task" tab="任务管理">
            <!-- 直接嵌入养护任务组件内容 -->
            <MaintenanceTaskContent />
          </a-tab-pane>
          
          <!-- 科学决策标签页 -->
          <a-tab-pane key="decision" tab="科学决策">
            <DevelopmentPlaceholder />
          </a-tab-pane>
          
          <!-- 统计分析标签页 -->
          <a-tab-pane key="statistics" tab="统计分析">
            <DevelopmentPlaceholder />
          </a-tab-pane>
          
          <!-- 后台监管标签页 -->
          <a-tab-pane key="backend" tab="后台监管">
            <DevelopmentPlaceholder />
          </a-tab-pane>
          
          <!-- 现场监督标签页 -->
          <a-tab-pane key="supervision" tab="现场监督">
            <DevelopmentPlaceholder />
          </a-tab-pane>
          
          <!-- 专项行政标签页 -->
          <a-tab-pane key="special" tab="专项行政">
            <DevelopmentPlaceholder />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  FileTextOutlined,
  ToolOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  BellOutlined,
  ApartmentOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import MaintenanceTaskContent from './MaintenanceTaskContent.vue'
import DevelopmentPlaceholder from './DevelopmentPlaceholder.vue'

const router = useRouter()

// 左侧菜单配置
const selectedMenu = ref<string[]>(['overview'])
const menuItems = [
  { key: 'overview', label: '数据总览' },
  {
    key: 'plan',
    label: '计划管理',
    children: [
      { key: 'maintenance-plan', label: '养护计划' },
      { key: 'inspection-plan', label: '巡查计划' },
      { key: 'repair-plan', label: '抢修计划' }
    ]
  },
  {
    key: 'task',
    label: '任务管理',
    children: [
      { key: 'maintenance-task', label: '养护任务' },
      { key: 'inspection-task', label: '巡查任务' },
      { key: 'repair-task', label: '抢修任务' }
    ]
  },
  {
    key: 'decision',
    label: '科学决策',
    children: [
      { key: 'maintenance-list', label: '养护清单' },
      { key: 'smart-maintenance', label: '智慧养护' }
    ]
  },
  {
    key: 'statistics',
    label: '统计分析',
    children: [
      { key: 'maintenance-stats', label: '养护统计' },
      { key: 'inspection-stats', label: '巡查统计' },
      { key: 'repair-stats', label: '抢修统计' },
      { key: 'personnel-stats', label: '人员统计' }
    ]
  },
  {
    key: 'backend',
    label: '后台监管',
    children: [
      { key: 'network-analysis', label: '管网养护分析' },
      { key: 'chamber-analysis', label: '井室养护分析' },
      { key: 'abnormal-analysis', label: '异常数据分析' },
      { key: 'trajectory-analysis', label: '人员轨迹分析' }
    ]
  },
  {
    key: 'supervision',
    label: '现场监督',
    children: [
      { key: 'assessment', label: '监管考核' },
      { key: 'log', label: '监管日志' },
      { key: 'well-operation', label: '下井作业' },
      { key: 'checkin', label: '签到信息' }
    ]
  },
  {
    key: 'special',
    label: '专项行政',
    children: [
      { key: 'construction-site', label: '在建工地' },
      { key: 'outlet-check', label: '排放口检查' }
    ]
  }
]

// 标签页
const activeTab = ref('overview')

// 周期选择
const maintenancePeriod = ref('week')
const inspectionPeriod = ref('week')

// 工地巡查列配置
const constructionColumns = [
  { title: '工地名称', dataIndex: 'siteName', key: 'siteName', ellipsis: true },
  { title: '片区', dataIndex: 'area', key: 'area', width: 80 },
  { title: '巡查时间', dataIndex: 'time', key: 'time', width: 100 }
]

// 工地巡查数据
const constructionData = ref([
  { id: 1, siteName: '杭政储出[2022]63号...', area: '之江片区', time: '2026-06-17' },
  { id: 2, siteName: '浙江科技大学数字化...', area: '留下街道', time: '2026-06-16' },
  { id: 3, siteName: '杭政储出[2024]122...', area: '之江片区', time: '2026-06-16' },
  { id: 4, siteName: '工大青春宝总部用地...', area: '留下街道', time: '2026-06-15' },
  { id: 5, siteName: '丽景路(珊瑚沙路-文...', area: '之江片区', time: '2026-06-15' },
  { id: 6, siteName: '博览路（博美路-横...', area: '之江片区', time: '2026-06-15' },
  { id: 7, siteName: '留漫巷（小和山站）', area: '留下街道', time: '2026-06-12' }
])

// 排口检查列配置
const outletColumns = [
  { title: '排口编码', dataIndex: 'code', key: 'code', width: 120 },
  { title: '巡查次数', dataIndex: 'count', key: 'count', width: 80 },
  { title: '最新巡查时间', dataIndex: 'time', key: 'time', width: 110 }
]

// 排口检查数据
const outletData = ref([
  { id: 1, code: 'E039H59', count: 4, time: '2026-06-17' },
  { id: 2, code: 'XHPS013YS091', count: 5, time: '2026-06-16' },
  { id: 3, code: '4F8069AC20B5BFFA', count: 40, time: '2026-06-15' },
  { id: 4, code: 'E039H50', count: 8, time: '2026-06-15' },
  { id: 5, code: 'E68H44', count: 9, time: '2026-06-15' },
  { id: 6, code: 'XHPS003YS379', count: 2, time: '2026-06-13' },
  { id: 7, code: 'XHPS003YS329', count: 1, time: '2026-06-13' }
])

// 事件上报列配置
const eventColumns = [
  { title: '编号', dataIndex: 'rank', key: 'rank', width: 60 },
  { title: '类别', dataIndex: 'category', key: 'category' },
  { title: '数量', dataIndex: 'count', key: 'count', width: 60 }
]

// 事件上报数据
const eventData = ref([
  { id: 1, rank: 1, category: '自行上报', count: 0 },
  { id: 2, rank: 2, category: '工程上报', count: 0 },
  { id: 3, rank: 3, category: '管网养护', count: 0 },
  { id: 4, rank: 4, category: '管网巡查', count: 0 }
])

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  // 更新选中的菜单项
  selectedMenu.value = [key]
  
  // 如果是养护任务、巡查任务、抢修任务，切换到任务管理标签页
  if (['maintenance-task', 'inspection-task', 'repair-task'].indexOf(key) !== -1) {
    activeTab.value = 'task'
  } else if (['maintenance-plan', 'inspection-plan', 'repair-plan'].indexOf(key) !== -1) {
    activeTab.value = 'plan'
  } else if (['maintenance-list', 'smart-maintenance'].indexOf(key) !== -1) {
    activeTab.value = 'decision'
  } else if (['maintenance-stats', 'inspection-stats', 'repair-stats', 'personnel-stats'].indexOf(key) !== -1) {
    activeTab.value = 'statistics'
  } else if (['network-analysis', 'chamber-analysis', 'abnormal-analysis', 'trajectory-analysis'].indexOf(key) !== -1) {
    activeTab.value = 'backend'
  } else if (['assessment', 'log', 'well-operation', 'checkin'].indexOf(key) !== -1) {
    activeTab.value = 'supervision'
  } else if (['construction-site', 'outlet-check'].indexOf(key) !== -1) {
    activeTab.value = 'special'
  } else {
    activeTab.value = key
  }
}

// 巡查情况图表
const inspectionChartRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (inspectionChartRef.value) {
    const chart = echarts.init(inspectionChartRef.value)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      series: [
        {
          name: '巡查情况',
          type: 'pie',
          radius: ['60%', '85%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 3, name: '工地巡查', itemStyle: { color: '#722ed1' } },
            { value: 2, name: '排口巡查', itemStyle: { color: '#faad14' } }
          ]
        }
      ]
    }
    
    chart.setOption(option)
    
    // 响应式调整
    window.addEventListener('resize', () => {
      chart.resize()
    })
  }
})
</script>

<style scoped lang="scss">
.inspection-maintenance {
  height: 100%;
  
  .content-wrapper {
    padding: 0 16px;
    background: #f0f2f5;
  }
  
  .main-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 16px;
    }
  }
  
  .section-card {
    margin-bottom: 16px;
    
    .todo-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f5f7fa;
      border-radius: 4px;
      
      .icon-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-right: 12px;
        
        &.blue { background: #e6f7ff; color: #1890ff; }
        &.cyan { background: #e6fffb; color: #13c2c2; }
        &.purple { background: #f9f0ff; color: #722ed1; }
        &.orange { background: #fff7e6; color: #fa8c16; }
        &.light-blue { background: #e6f7ff; color: #52c41a; }
      }
      
      .todo-info {
        flex: 1;
        
        .todo-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .todo-count {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }
        
        .progress-placeholder {
          height: 14px;
        }
      }
    }
    
    .stats-box {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      padding: 0;
      height: 100%;
      min-height: 220px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
            
      &.maintenance-box {
        border-top: 3px solid #1890ff;
      }
            
      &.inspection-box {
        border-top: 3px solid #52c41a;
      }
            
      .box-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 16px 12px;
        border-bottom: 1px solid #f0f0f0;
        background: #fafafa;
      }
            
      .box-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        min-height: 180px;
      }
      
      .stat-item {
        display: flex;
        align-items: center;
        padding: 0 32px;
        border-radius: 8px;
        width: auto;
        min-width: 200px;
        height: 140px;
                
        &.green {
          background: linear-gradient(135deg, #e6fffb 0%, #b3efe8 100%);
                  
          .stat-icon {
            font-size: 56px;
            color: #13c2c2;
            margin-right: 20px;
            flex-shrink: 0;
          }
        }
                
        &.blue {
          background: linear-gradient(135deg, #e6f7ff 0%, #b3d9ff 100%);
                  
          .stat-icon {
            font-size: 56px;
            color: #1890ff;
            margin-right: 20px;
            flex-shrink: 0;
          }
        }
                
        .stat-info {
          flex: 1;
          text-align: left;
                  
          .stat-label {
            font-size: 16px;
            color: #666;
            margin-bottom: 12px;
          }
                  
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            line-height: 1.2;
          }
        }
      }
      
      .inspection-chart-wrapper {
        display: flex;
        align-items: center;
        width: auto;
        gap: 24px;
                
        .inspection-chart {
          width: 160px;
          height: 160px;
          flex-shrink: 0;
        }
                
        .chart-legend {
          flex: 1;
                  
          .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            font-size: 14px;
                    
            &:last-child {
              margin-bottom: 0;
            }
                    
            .dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              margin-right: 8px;
              flex-shrink: 0;
                      
              &.purple { background: #722ed1; }
              &.yellow { background: #faad14; }
            }
          }
        }
      }
    }
  }
  
  .table-card {
    height: 100%;
    min-height: 320px;
    
    :deep(.ant-card-head) {
      min-height: 40px;
      padding: 0 12px;
    }
    
    :deep(.ant-card-body) {
      padding: 12px;
    }
    
    .text-ellipsis {
      display: inline-block;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .rank-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #fff;
      
      &.rank-1 { background: linear-gradient(135deg, #ffd700, #ffed4e); }
      &.rank-2 { background: linear-gradient(135deg, #c0c0c0, #e8e8e8); }
      &.rank-3 { background: linear-gradient(135deg, #cd7f32, #daa520); }
      &.rank-4 { background: #d9d9d9; color: #666; }
    }
  }
}
</style>
