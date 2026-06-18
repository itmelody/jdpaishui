<template>
  <div class="maintenance-task">
    <!-- 顶部筛选区 -->
    <div class="filter-bar">
      <div class="filter-left">
        <a-input
          v-model:value="keyword"
          placeholder="请输入道路或小区名"
          class="keyword-input"
          allow-clear
        >
          <template #prefix><SearchOutlined style="color: #999" /></template>
        </a-input>
        <a-select v-model:value="areaFilter" mode="multiple" placeholder="片区" class="filter-select" :max-tag-count="1">
          <a-select-option value="之江片区">之江片区</a-select-option>
          <a-select-option value="留下街道">留下街道</a-select-option>
          <a-select-option value="西园片区">西园片区</a-select-option>
          <a-select-option value="蒋村街道">蒋村街道</a-select-option>
        </a-select>
        <a-select v-model:value="companyFilter" mode="multiple" placeholder="公司" class="filter-select" :max-tag-count="1">
          <a-select-option value="建德市政">建德市政</a-select-option>
          <a-select-option value="杭州养护">杭州养护</a-select-option>
        </a-select>
        <a-range-picker v-model:value="dateRange" class="date-picker" :placeholder="['开始日期', '结束日期']" />
      </div>
      <div class="filter-right">
        <a-button type="primary" @click="handleFilter">更多筛选</a-button>
        <a-button type="primary" @click="handleQuery">查询</a-button>
        <a-button type="primary" @click="handleOperate">操作</a-button>
      </div>
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
            <a-tag :color="record.status === '进行中' ? 'blue' : 'green'">{{ record.status }}</a-tag>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 下方详情面板 -->
    <div class="detail-panel" v-if="selectedTask">
      <div class="detail-left">
        <div class="panel-title">计划信息</div>
        <div class="plan-info">
          <div class="creator-info">
            <div class="avatar-icon">👤</div>
            <span class="creator-name">{{ selectedTask.creator }}</span>
          </div>
          <div class="create-time-tag">
            创建时间：{{ selectedTask.createTime }}
          </div>
          <div class="plan-timeline">
            <div class="timeline-item">
              <span class="timeline-dot" style="background: #52c41a"></span>
              <span>计划开始：{{ selectedTask.planStart }}</span>
            </div>
            <div class="timeline-item">
              <span class="timeline-dot" style="background: #f5222d"></span>
              <span>计划结束：{{ selectedTask.planEnd }}</span>
            </div>
          </div>
          <div class="plan-stats">
            <div class="stat-item">
              <span class="stat-num">{{ selectedTask.year }}</span>
              <span class="stat-desc">养护年份</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ selectedTask.quarter }}</span>
              <span class="stat-desc">养护季度</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ selectedTask.month }}</span>
              <span class="stat-desc">养护月份</span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-right">
        <a-tabs v-model:activeKey="activeDetailTab" class="detail-tabs">
          <a-tab-pane key="well" tab="井室">
            <a-table
              :columns="wellColumns"
              :data-source="wellData"
              :pagination="false"
              size="small"
              class="well-table"
              row-key="id"
            >
              <template #bodyCell="{ column }">
                <template v-if="column.key === 'action'">
                  <a-button type="link" size="small">查看</a-button>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="pipe" tab="管网">
            <a-empty description="暂无管网数据" />
          </a-tab-pane>
          <a-tab-pane key="stats" tab="统计">
            <a-empty description="暂无统计数据" />
          </a-tab-pane>
          <a-tab-pane key="progress" tab="进度">
            <a-empty description="暂无进度信息" />
          </a-tab-pane>
          <a-tab-pane key="map" tab="地图">
            <a-empty description="暂无地图数据" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- 无选中时提示 -->
    <div class="detail-panel empty-panel" v-else>
      <a-empty description="请选择一条任务查看详情" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import dayjs, { type Dayjs } from 'dayjs'

const keyword = ref('')
const areaFilter = ref<string[]>(['全选'])
const companyFilter = ref<string[]>(['全选'])
const dateRange = ref<[Dayjs, Dayjs]>([dayjs('2026-05-17'), dayjs('2026-06-17')])
const selectedRowKeys = ref<string[]>(['5'])
const activeDetailTab = ref('well')

// 任务表格列
const taskColumns = [
  { title: '道路或小区名', dataIndex: 'roadName', key: 'roadName', width: 180, ellipsis: true },
  { title: '任务状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '片区', dataIndex: 'area', key: 'area', width: 100 },
  { title: '管网类型', dataIndex: 'pipeType', key: 'pipeType', width: 80, align: 'center' },
  { title: '养护方式', dataIndex: 'maintainMethod', key: 'maintainMethod', width: 80, align: 'center' },
  { title: '任务子类', dataIndex: 'subType', key: 'subType', width: 80, align: 'center' },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 70 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 100 }
]

// 模拟数据
const taskData = ref([
  { id: '1', roadName: '杭富路（之江路-转塘街道）', status: '进行中', area: '之江片区', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57', remark: '' },
  { id: '2', roadName: '丽景路（珊瑚沙路-之江路）', status: '已确认', area: '之江片区', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57', remark: '' },
  { id: '3', roadName: '留漫巷（小和山站地铁站）', status: '进行中', area: '留下街道', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57', remark: '' },
  { id: '4', roadName: '博览路（博美路-横街）', status: '进行中', area: '之江片区', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57', remark: '' },
  { id: '5', roadName: '西园四路（西园一路-西园九路）', status: '进行中', area: '西园片区', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-20 16:56:48', remark: '' },
  { id: '6', roadName: '紫金港北路（石祥西路-留祥路）', status: '已确认', area: '蒋村街道', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57', remark: '' },
  { id: '7', roadName: '文一西路（紫金港路-古墩路）', status: '进行中', area: '蒋村街道', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57', remark: '' },
  { id: '8', roadName: '古墩路（文一西路-文二西路）', status: '进行中', area: '蒋村街道', pipeType: '雨水', maintainMethod: '疏通', subType: '市政', creator: '吕浪', createTime: '2026-05-27 08:56:57', remark: '' }
])

// 选中的任务
const selectedTask = computed(() => {
  if (selectedRowKeys.value.length > 0) {
    const task = taskData.value.find(t => t.id === selectedRowKeys.value[0])
    if (task) {
      return {
        ...task,
        planStart: '2026-05-20',
        planEnd: '2026-06-01',
        year: '2026',
        quarter: '二',
        month: '5'
      }
    }
  }
  return null
})

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const customRow = (record: any) => ({
  onClick: () => {
    selectedRowKeys.value = [record.id]
  },
  class: selectedRowKeys.value.includes(record.id) ? 'selected-row' : ''
})

// 井室表格
const wellColumns = [
  { title: '类型', dataIndex: 'type', key: 'type', width: 80 },
  { title: '地址', dataIndex: 'address', key: 'address', width: 150 },
  { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 160 },
  { title: '详细信息', key: 'action', width: 80, align: 'center' }
]

const wellData = [
  { id: 1, type: '雨水井', address: '', startTime: '2026-05-28 15:33:10' },
  { id: 2, type: '雨水井', address: '', startTime: '2026-05-28 15:32:58' },
  { id: 3, type: '雨水井', address: '', startTime: '2026-05-28 15:32:35' },
  { id: 4, type: '雨水井', address: '', startTime: '2026-05-28 15:32:12' },
  { id: 5, type: '雨水井', address: '', startTime: '2026-05-28 15:31:45' },
  { id: 6, type: '雨水井', address: '', startTime: '2026-05-28 15:31:20' }
]

const handleFilter = () => {}
const handleQuery = () => {}
const handleOperate = () => {}
</script>

<style scoped lang="scss">
.maintenance-task {
  display: flex;
  flex-direction: column;
  height: 100%;
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
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 10px;

  .keyword-input {
    width: 200px;
  }

  .filter-select {
    width: 130px;
  }

  .date-picker {
    width: 260px;
  }
}

.filter-right {
  display: flex;
  gap: 8px;
}

.task-table-wrapper {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .task-table {
    :deep(.ant-table-thead > tr > th) {
      background: #f0f5ff;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 8px;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
      font-size: 13px;
    }

    :deep(.ant-table-tbody > tr:nth-child(even) > td) {
      background: #f9fbff;
    }

    :deep(.ant-table-tbody > tr.selected-row > td) {
      background: #e6f4ff !important;
    }

    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f0f5ff;
    }
  }
}

.detail-panel {
  flex-shrink: 0;
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  min-height: 260px;
}

.empty-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-left {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  padding-right: 16px;

  .panel-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    padding-left: 10px;
    border-left: 3px solid #3b82f6;
    margin-bottom: 16px;
  }

  .plan-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .creator-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .avatar-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e6f4ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .creator-name {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
  }

  .create-time-tag {
    display: inline-block;
    background: #52c41a;
    color: #fff;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    align-self: flex-start;
  }

  .plan-timeline {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 4px;

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #666;

      .timeline-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
    }
  }

  .plan-stats {
    display: flex;
    gap: 8px;
    margin-top: 8px;

    .stat-item {
      flex: 1;
      text-align: center;
      background: #f8fafc;
      border-radius: 6px;
      padding: 8px 4px;

      .stat-num {
        display: block;
        font-size: 22px;
        font-weight: 700;
        color: #1890ff;
      }

      .stat-desc {
        display: block;
        font-size: 11px;
        color: #999;
        margin-top: 2px;
      }
    }
  }
}

.detail-right {
  flex: 1;
  min-width: 0;

  .detail-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 8px;
    }

    :deep(.ant-tabs-tab-active) {
      background: #e6f4ff;
      border-color: #1890ff;
    }
  }

  .well-table {
    :deep(.ant-table-thead > tr > th) {
      background: #f5f5f5;
      font-size: 12px;
      padding: 8px 6px;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 6px;
      font-size: 12px;
    }
  }
}
</style>
