<template>
  <div class="maintenance-task-content">
    <!-- 搜索表单区域 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="[8, 8]" align="middle">
          <a-col>
            <span class="filter-label">关键字：</span>
            <a-input 
              v-model:value="searchForm.keyword" 
              placeholder="请输入道路或小区名" 
              style="width: 180px" 
              allow-clear
            />
          </a-col>
          <a-col>
            <span class="filter-label">片区：</span>
            <a-select 
              v-model:value="searchForm.area" 
              placeholder="全选" 
              style="width: 160px" 
              mode="multiple" 
              maxTagCount="1"
              allow-clear
            >
              <a-select-option value="zhijiang">之江片区</a-select-option>
              <a-select-option value="sandun">三墩镇</a-select-option>
              <a-select-option value="wenxin">文新街道</a-select-option>
              <a-select-option value="xixi">西溪街道</a-select-option>
              <a-select-option value="lingyin">灵隐街道</a-select-option>
            </a-select>
          </a-col>
          <a-col>
            <span class="filter-label">公司：</span>
            <a-select 
              v-model:value="searchForm.company" 
              placeholder="全选" 
              style="width: 160px" 
              mode="multiple" 
              maxTagCount="1"
              allow-clear
            >
              <a-select-option value="company1">公司A</a-select-option>
              <a-select-option value="company2">公司B</a-select-option>
            </a-select>
          </a-col>
          <a-col>
            <span class="filter-label">时间：</span>
            <a-range-picker 
              v-model:value="searchForm.dateRange" 
              style="width: 240px" 
              :placeholder="['Start date', 'End date']"
            />
          </a-col>
          <a-col>
            <a-button type="link">更多筛选</a-button>
          </a-col>
          <a-col>
            <a-button type="primary">查询</a-button>
          </a-col>
          <a-col>
            <a-button>操作</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 主表格 -->
    <a-card :bordered="false" class="main-table-card">
      <a-table
        :columns="taskColumns"
        :data-source="taskData"
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        size="small"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '进行中' ? '#e6f7ff' : '#f6ffed'" :style="{ color: record.status === '进行中' ? '#1890ff' : '#52c41a', borderColor: record.status === '进行中' ? '#91d5ff' : '#b7eb8f' }">{{ text }}</a-tag>
          </template>
          <template v-if="column.key === 'createTime'">
            <span>{{ text }}</span>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 底部详情区域 -->
    <a-row :gutter="16" class="detail-section">
      <!-- 左侧：计划信息 -->
      <a-col :span="6">
        <a-card title="计划信息" :bordered="false" class="plan-info-card">
          <div class="creator-info">
            <a-avatar :size="64" src="https://joeschmoe.io/api/v1/random" />
            <div class="creator-details">
              <div class="create-time">创建时间: {{ selectedTask?.createTime || '2026-05-20 16:56:48' }}</div>
              <div class="plan-timeline">
                <div class="timeline-item start">
                  <span class="dot green"></span>
                  <span>计划开始: {{ selectedTask?.startDate || '2026-05-20' }}</span>
                </div>
                <div class="timeline-item end">
                  <span class="dot orange"></span>
                  <span>计划结束: {{ selectedTask?.endDate || '2026-06-01' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="creator-name">{{ selectedTask?.creator || '吕浪' }}</div>
          
          <div class="time-info">
            <div class="time-item">
              <div class="year">2026</div>
              <div class="label">养护年份</div>
            </div>
            <div class="time-divider"></div>
            <div class="time-item">
              <div class="quarter">二</div>
              <div class="label">养护季度</div>
            </div>
            <div class="time-divider"></div>
            <div class="time-item">
              <div class="month">5</div>
              <div class="label">养护月份</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧：详细信息标签页 -->
      <a-col :span="18">
        <a-card :bordered="false" class="detail-tabs-card">
          <a-tabs v-model:activeKey="activeDetailTab">
            <a-tab-pane key="well" tab="井室">
              <a-table
                :columns="wellColumns"
                :data-source="wellData"
                :pagination="false"
                size="small"
                row-key="id"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'action'">
                    <a-button type="primary" size="small">查看</a-button>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="network" tab="管网" />
            <a-tab-pane key="statistics" tab="统计" />
            <a-tab-pane key="progress" tab="进度" />
            <a-tab-pane key="map" tab="地图" />
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 搜索表单
const searchForm = ref({
  keyword: '',
  area: [],
  company: [],
  dateRange: null
})

// 选中的行
const selectedRowKeys = ref<number[]>([])

// 选中的任务
const selectedTask = ref<any>(null)

// 详情标签页
const activeDetailTab = ref('well')

// 主表格列配置
const taskColumns = [
  { title: '', dataIndex: 'checkbox', key: 'checkbox', width: 40 },
  { title: '道路或小区名', dataIndex: 'roadName', key: 'roadName', width: 200 },
  { title: '任务状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '片区', dataIndex: 'area', key: 'area', width: 100 },
  { title: '管网类型', dataIndex: 'pipeType', key: 'pipeType', width: 100 },
  { title: '养护方式', dataIndex: 'maintenanceMethod', key: 'maintenanceMethod', width: 100 },
  { title: '任务子类', dataIndex: 'taskSubtype', key: 'taskSubtype', width: 100 },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180, sorter: true },
  { title: '备注', dataIndex: 'remark', key: 'remark' }
]

// 主表格数据
const taskData = ref([
  { id: 1, roadName: '梧桐路下穿', status: '进行中', area: '之江片区', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57' },
  { id: 2, roadName: '西园路(石祥西路-苏嘉路)', status: '已确认', area: '三墩镇', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57' },
  { id: 3, roadName: '涵秀弄(纬三路)(江涵路-之浦路)', status: '进行中', area: '之江片区', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57' },
  { id: 4, roadName: '枫桦支路(枫桦东路-四号浦)', status: '进行中', area: '之江片区', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57' },
  { id: 5, roadName: '西园四路(西园一路-西园九路)', status: '已确认', area: '三墩镇', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-20 16:56:48' },
  { id: 6, roadName: '古墩路(天目山路-文一西路)', status: '进行中', area: '文新街道', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-20 16:56:48' },
  { id: 7, roadName: '竞舟路(文三西路-余杭塘河)', status: '进行中', area: '文新街道', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-20 16:56:48' },
  { id: 8, roadName: '嘉州路(文一路-余杭塘路)', status: '进行中', area: '西溪街道', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-20 09:06:25' },
  { id: 9, roadName: '曙光路(北山路-保俶路)', status: '进行中', area: '灵隐街道', pipeType: '雨水', maintenanceMethod: '疏通', taskSubtype: '市政', creator: '吕浪', createTime: '2026-05-20 09:06:23' }
])

// 井室表格列配置
const wellColumns = [
  { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '地址', dataIndex: 'address', key: 'address' },
  { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 180 },
  { title: '详细信息', dataIndex: 'action', key: 'action', width: 100 }
]

// 井室表格数据
const wellData = ref([
  { id: 1, type: '雨水井', address: '', startTime: '2026-05-28 15:33:10' },
  { id: 2, type: '雨水井', address: '', startTime: '2026-05-28 15:32:54' },
  { id: 3, type: '雨水井', address: '', startTime: '2026-05-28 15:32:45' },
  { id: 4, type: '雨水井', address: '', startTime: '2026-05-28 15:31:48' },
  { id: 5, type: '雨水井', address: '', startTime: '2026-05-28 15:31:28' }
])

// 选择行变化
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
  if (keys.length > 0) {
    const selectedId = keys[0]
    selectedTask.value = taskData.value.find(item => item.id === selectedId)
  } else {
    selectedTask.value = null
  }
}

// 表格排序处理
const onTableChange = (pagination: any, filters: any, sorter: any) => {
  if (sorter.field && sorter.order) {
    // 根据创建时间排序
    taskData.value.sort((a, b) => {
      const timeA = new Date(a.createTime).getTime()
      const timeB = new Date(b.createTime).getTime()
      return sorter.order === 'ascend' ? timeA - timeB : timeB - timeA
    })
  }
}
</script>

<style scoped lang="scss">
.maintenance-task-content {
  .search-card {
    margin-bottom: 16px;

    :deep(.ant-card-body) {
      padding: 16px;
    }

    .search-form {
      .filter-label {
        margin-right: 8px;
        font-size: 14px;
        color: #333;
      }

      :deep(.ant-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .main-table-card {
    margin-bottom: 16px;

    :deep(.ant-card-body) {
      padding: 16px;
    }

    :deep(.ant-table-thead > tr > th) {
      background: #fafafa;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 8px;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
      font-size: 13px;
    }

    :deep(.ant-table-tbody > tr:nth-child(even) > td) {
      background: #fafafa;
    }

    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f0f9ff;
    }
  }

  .detail-section {
    .plan-info-card {
      :deep(.ant-card-head) {
        min-height: 40px;
        padding: 0 16px;
        font-weight: 600;
      }

      :deep(.ant-card-body) {
        padding: 16px;
      }

      .creator-info {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;

        .creator-details {
          flex: 1;
          margin-left: 12px;

          .create-time {
            font-size: 12px;
            color: #52c41a;
            background: rgba(82, 196, 26, 0.1);
            padding: 4px 8px;
            border-radius: 2px;
            display: inline-block;
            margin-bottom: 12px;
          }

          .plan-timeline {
            .timeline-item {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              font-size: 14px;
              color: #666;

              &:last-child {
                margin-bottom: 0;
              }

              .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 8px;

                &.green {
                  background: #52c41a;
                }

                &.orange {
                  background: #fa8c16;
                }
              }
            }
          }
        }
      }

      .creator-name {
        font-size: 16px;
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 20px;
      }

      .time-info {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 16px 0;
        border-top: 1px solid #f0f0f0;

        .time-item {
          text-align: center;

          .year,
          .quarter,
          .month {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 4px;
          }

          .label {
            font-size: 12px;
            color: #999;
          }
        }

        .time-divider {
          width: 1px;
          height: 40px;
          background: #e8e8e8;
        }
      }
    }

    .detail-tabs-card {
      :deep(.ant-card-body) {
        padding: 0;
      }

      :deep(.ant-tabs-nav) {
        padding: 0 16px;
      }

      :deep(.ant-tabs-content) {
        padding: 16px;
      }
    }
  }
}
</style>
