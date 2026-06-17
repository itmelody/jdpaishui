<template>
  <div class="workbench">
    <!-- 顶部统计卡片 -->
    <a-row :gutter="16" class="stats-row">
      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-label">管网总长度</div>
              <div class="stat-value">1,258 <span class="unit">公</span></div>
              <div class="stat-trend up">
                <ArrowUpOutlined /> 2.5% <span class="trend-text">较上月</span>
              </div>
            </div>
            <div class="stat-icon blue">
              <ApartmentOutlined />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-label">在册排水户</div>
              <div class="stat-value">386 <span class="unit">家</span></div>
              <div class="stat-trend up">
                <ArrowUpOutlined /> 5.1% <span class="trend-text">较上月</span>
              </div>
            </div>
            <div class="stat-icon green">
              <UserOutlined />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-label">待办工单</div>
              <div class="stat-value">24 <span class="unit">项</span></div>
              <div class="stat-trend down">
                <ArrowDownOutlined /> 12% <span class="trend-text">较上周</span>
              </div>
            </div>
            <div class="stat-icon orange">
              <FileTextOutlined />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-label">运行设备</div>
              <div class="stat-value">156 <span class="unit">/</span></div>
              <div class="stat-trend up">
                <CheckCircleOutlined /> 98% <span class="trend-text">在线率</span>
              </div>
            </div>
            <div class="stat-icon red">
              <SettingOutlined />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 中间区域 -->
    <a-row :gutter="16" class="middle-row">
      <!-- 左侧：个人待办中心 + 监管台账速递 + 重点点位关注 -->
      <a-col :span="16">
        <!-- 个人待办中心 -->
        <a-card :bordered="false" class="content-card todo-card">
          <template #title>
            <div class="card-title">
              <FileTextOutlined class="title-icon" />
              <span>个人待办中心</span>
            </div>
          </template>
          <template #extra>
            <a-button type="link">查看全部 <RightOutlined /></a-button>
          </template>
          <a-row :gutter="16">
            <a-col :span="12">
              <div class="todo-item">
                <div class="todo-icon blue">
                  <FileTextOutlined />
                </div>
                <div class="todo-content">
                  <div class="todo-name">待审批排水许可</div>
                  <div class="todo-count"><a-tag color="red">8 项</a-tag></div>
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="todo-item">
                <div class="todo-icon orange">
                  <ToolOutlined />
                </div>
                <div class="todo-content">
                  <div class="todo-name">待复核整改工单</div>
                  <div class="todo-count"><a-tag color="red">5 项</a-tag></div>
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="todo-item">
                <div class="todo-icon green">
                  <FileDoneOutlined />
                </div>
                <div class="todo-content">
                  <div class="todo-name">待审核工程资料</div>
                  <div class="todo-count"><a-tag color="orange">3 项</a-tag></div>
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="todo-item">
                <div class="todo-icon purple">
                  <ShareAltOutlined />
                </div>
                <div class="todo-content">
                  <div class="todo-name">待核查混接点位</div>
                  <div class="todo-count"><a-tag color="orange">4 项</a-tag></div>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-card>

        <!-- 监管台账速递 -->
        <a-card :bordered="false" class="content-card ledger-card">
          <template #title>
            <div class="card-title">
              <DatabaseOutlined class="title-icon" />
              <span>监管台账速递</span>
            </div>
          </template>
          <template #extra>
            <a-button type="link">生成报表 <DownloadOutlined /></a-button>
          </template>
          <div class="ledger-list">
            <div class="ledger-item">
              <CalendarOutlined class="item-icon blue" />
              <div class="item-content">
                <div class="item-title">每日管网运行简报</div>
                <div class="item-desc">今日已更新，包含12个泵站运行数据</div>
              </div>
              <a-button size="small" type="primary" ghost>查看</a-button>
            </div>
            <div class="ledger-item">
              <ExclamationCircleOutlined class="item-icon orange" />
              <div class="item-content">
                <div class="item-title">违规排水记录汇总</div>
                <div class="item-desc">本周新增12条违规记录，已完成处理8条</div>
              </div>
              <a-button size="small" type="primary" ghost>查看</a-button>
            </div>
            <div class="ledger-item">
              <TeamOutlined class="item-icon red" />
              <div class="item-content">
                <div class="item-title">巡检缺岗异常提醒</div>
                <div class="item-desc">今日城东片区巡检人员未签到，疑似缺岗</div>
              </div>
              <a-button size="small" danger ghost>处理</a-button>
            </div>
          </div>
        </a-card>

        <!-- 重点点位关注 -->
        <a-card :bordered="false" class="content-card monitor-card">
          <template #title>
            <div class="card-title">
              <StarFilled class="title-icon yellow" />
              <span>重点点位关注</span>
            </div>
          </template>
          <template #extra>
            <a-button type="link"><PlusOutlined /> 添加点位</a-button>
          </template>
          <a-table
            :columns="monitorColumns"
            :data-source="monitorData"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <span :class="['status-dot', record.statusClass]">
                  <span class="dot"></span>
                  {{ record.statusText }}
                </span>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" size="small">详情</a-button>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- 右侧：消息通知中心 + 近7日设备运行状态 -->
      <a-col :span="8">
        <!-- 消息通知中心 -->
        <a-card :bordered="false" class="content-card message-card">
          <template #title>
            <div class="card-title">
              <BellOutlined class="title-icon" />
              <span>消息通知中心</span>
            </div>
          </template>
          <template #extra>
            <a-button type="link">全部已读</a-button>
          </template>
          <div class="message-list">
            <div class="message-item system">
              <div class="message-icon blue">
                <SoundOutlined />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-title">系统公告</span>
                  <span class="message-time">1小时前</span>
                </div>
                <div class="message-text">
                  系统将于本周六凌晨2点-4点进行版本升级维护，请提前做好工作安排。
                </div>
              </div>
            </div>
            <div class="message-item file">
              <div class="message-icon green">
                <FileOutlined />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-title">上级下发文件</span>
                  <span class="message-time">昨天</span>
                </div>
                <div class="message-text">
                  杭州市城镇排水安全管理工作要点（2024年度）已经上传，请查收。
                </div>
              </div>
            </div>
            <div class="message-item weather">
              <div class="message-icon red">
                <CloudOutlined />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-title">汛情气象通知</span>
                  <span class="message-time red">刚刚</span>
                </div>
                <div class="message-text">
                  预计未来24小时我市将出现大到暴雨，请做好防汛排涝准备工作。
                </div>
              </div>
            </div>
            <div class="message-item workorder">
              <div class="message-icon orange">
                <SwapOutlined />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-title">工单流转消息</span>
                  <span class="message-time">10分钟前</span>
                </div>
                <div class="message-text">
                  整改工单GD20240512003已派发给巡检三组张师傅，请跟进。
                </div>
              </div>
            </div>
            <div class="message-item workorder">
              <div class="message-icon purple">
                <FileDoneOutlined />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-title">工单流转消息</span>
                  <span class="message-time">30分钟前</span>
                </div>
                <div class="message-text">
                  排水许可申请SP20240415已通过，请通知申请人前来领证。
                </div>
              </div>
            </div>
          </div>
          <div class="view-more">
            <a-button type="link">查看更多消息</a-button>
          </div>
        </a-card>

        <!-- 近7日设备运行状态 -->
        <a-card :bordered="false" class="content-card chart-card">
          <template #title>
            <div class="card-title">
              <LineChartOutlined class="title-icon" />
              <span>近7日设备运行状态</span>
            </div>
          </template>
          <div class="chart-container" ref="chartRef"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ApartmentOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  RightOutlined,
  ToolOutlined,
  FileDoneOutlined,
  ShareAltOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  StarFilled,
  PlusOutlined,
  BellOutlined,
  SoundOutlined,
  FileOutlined,
  CloudOutlined,
  SwapOutlined,
  LineChartOutlined
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'

// 重点点位表格列配置
const monitorColumns = [
  { title: '点位名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '点位类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '当前状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '最新数据', dataIndex: 'data', key: 'data', width: 120 },
  { title: '更新时间', dataIndex: 'time', key: 'time', width: 100 },
  { title: '操作', key: 'action', width: 80 }
]

// 重点点位数据
const monitorData = ref([
  {
    name: '城东泵站\n建德市经济开发区',
    type: '关键泵站',
    status: 'status-normal',
    statusText: '运行正常',
    statusClass: 'normal',
    data: '2.5m³/h',
    time: '2分钟前'
  },
  {
    name: '新世纪大道积水点\n主城区新世纪大道',
    type: '关键积水点',
    status: 'status-warning',
    statusText: '水位偏高',
    statusClass: 'warning',
    data: '28cm',
    time: '5分钟前'
  },
  {
    name: '建德化工二厂\n化工园区',
    type: '重点工业排水户',
    status: 'status-danger',
    statusText: '超标预警',
    statusClass: 'danger',
    data: 'COD 512mg/L',
    time: '12分钟前'
  },
  {
    name: '城西污水处理厂\n城西片区',
    type: '关键泵站',
    status: 'status-normal',
    statusText: '运行正常',
    statusClass: 'normal',
    data: '18.6m³/h',
    time: '1分钟前'
  }
])

// 图表容器引用
const chartRef = ref<HTMLElement>()

// 初始化图表
onMounted(() => {
  if (chartRef.value) {
    const chart = echarts.init(chartRef.value)
    
    const option = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: {
          lineStyle: {
            color: '#e8e8e8'
          }
        },
        axisLabel: {
          color: '#999'
        }
      },
      yAxis: {
        type: 'value',
        min: 80,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: '#999'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      series: [
        {
          data: [92, 93, 91, 95, 94, 93, 92],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#1890ff'
          },
          lineStyle: {
            color: '#1890ff',
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(24, 144, 255, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.05)'
              }
            ])
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>在线率: {c}%'
      }
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
.workbench {
  .stats-row {
    margin-bottom: 16px;
    
    .stat-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      
      :deep(.ant-card-body) {
        padding: 20px;
      }
      
      .stat-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .stat-info {
          flex: 1;
          
          .stat-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            
            .unit {
              font-size: 14px;
              font-weight: normal;
              color: #999;
              margin-left: 4px;
            }
          }
          
          .stat-trend {
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            
            &.up {
              color: #52c41a;
            }
            
            &.down {
              color: #f5222d;
            }
            
            .trend-text {
              color: #999;
            }
          }
        }
        
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          
          &.blue {
            background: rgba(24, 144, 255, 0.1);
            color: #1890ff;
          }
          
          &.green {
            background: rgba(82, 196, 26, 0.1);
            color: #52c41a;
          }
          
          &.orange {
            background: rgba(250, 173, 20, 0.1);
            color: #faad14;
          }
          
          &.red {
            background: rgba(245, 34, 45, 0.1);
            color: #f5222d;
          }
        }
      }
    }
  }
  
  .middle-row {
    .content-card {
      margin-bottom: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      
      :deep(.ant-card-head) {
        border-bottom: 1px solid #f0f0f0;
        padding: 0 20px;
        
        .ant-card-head-title {
          padding: 16px 0;
        }
      }
      
      :deep(.ant-card-body) {
        padding: 20px;
      }
      
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        
        .title-icon {
          font-size: 18px;
          
          &.yellow {
            color: #faad14;
          }
        }
      }
    }
    
    // 个人待办中心
    .todo-card {
      .todo-item {
        display: flex;
        align-items: center;
        padding: 16px;
        background: #fafafa;
        border-radius: 8px;
        margin-bottom: 12px;
        transition: all 0.3s;
        
        &:hover {
          background: #f0f0f0;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .todo-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-right: 12px;
          
          &.blue {
            background: rgba(24, 144, 255, 0.1);
            color: #1890ff;
          }
          
          &.orange {
            background: rgba(250, 173, 20, 0.1);
            color: #faad14;
          }
          
          &.green {
            background: rgba(82, 196, 26, 0.1);
            color: #52c41a;
          }
          
          &.purple {
            background: rgba(114, 46, 209, 0.1);
            color: #722ed1;
          }
        }
        
        .todo-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .todo-name {
            font-size: 14px;
            color: #333;
          }
          
          .todo-count {
            :deep(.ant-tag) {
              margin: 0;
            }
          }
        }
      }
    }
    
    // 监管台账速递
    .ledger-card {
      .ledger-list {
        .ledger-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          margin-bottom: 12px;
          transition: all 0.3s;
          
          &:hover {
            background: #f0f0f0;
          }
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .item-icon {
            font-size: 24px;
            margin-right: 12px;
            
            &.blue {
              color: #1890ff;
            }
            
            &.orange {
              color: #faad14;
            }
            
            &.red {
              color: #f5222d;
            }
          }
          
          .item-content {
            flex: 1;
            
            .item-title {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }
            
            .item-desc {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
    
    // 重点点位关注
    .monitor-card {
      :deep(.ant-table) {
        .ant-table-thead > tr > th {
          background: #fafafa;
          font-weight: 500;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #f5f5f5;
        }
      }
      
      .status-dot {
        display: flex;
        align-items: center;
        gap: 6px;
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        &.normal {
          color: #52c41a;
          
          .dot {
            background: #52c41a;
          }
        }
        
        &.warning {
          color: #faad14;
          
          .dot {
            background: #faad14;
          }
        }
        
        &.danger {
          color: #f5222d;
          
          .dot {
            background: #f5222d;
          }
        }
      }
    }
    
    // 消息通知中心
    .message-card {
      .message-list {
        max-height: 400px;
        overflow-y: auto;
        
        .message-item {
          display: flex;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          margin-bottom: 12px;
          transition: all 0.3s;
          
          &:hover {
            background: #f0f0f0;
          }
          
          &:last-child {
            margin-bottom: 0;
          }
          
          &.system {
            background: rgba(24, 144, 255, 0.05);
          }
          
          &.weather {
            background: rgba(245, 34, 45, 0.05);
          }
          
          &.workorder {
            background: rgba(250, 173, 20, 0.05);
          }
          
          .message-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            margin-right: 12px;
            flex-shrink: 0;
            
            &.blue {
              background: rgba(24, 144, 255, 0.1);
              color: #1890ff;
            }
            
            &.green {
              background: rgba(82, 196, 26, 0.1);
              color: #52c41a;
            }
            
            &.red {
              background: rgba(245, 34, 45, 0.1);
              color: #f5222d;
            }
            
            &.orange {
              background: rgba(250, 173, 20, 0.1);
              color: #faad14;
            }
            
            &.purple {
              background: rgba(114, 46, 209, 0.1);
              color: #722ed1;
            }
          }
          
          .message-content {
            flex: 1;
            
            .message-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
              
              .message-title {
                font-size: 14px;
                font-weight: 500;
                color: #333;
              }
              
              .message-time {
                font-size: 12px;
                color: #999;
                
                &.red {
                  color: #f5222d;
                }
              }
            }
            
            .message-text {
              font-size: 13px;
              color: #666;
              line-height: 1.6;
            }
          }
        }
      }
      
      .view-more {
        text-align: center;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;
        margin-top: 12px;
      }
    }
    
    // 近7日设备运行状态
    .chart-card {
      .chart-container {
        height: 240px;
      }
    }
  }
}
</style>
