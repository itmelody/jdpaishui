<template>
  <div class="inspection-registration">
    <a-card :bordered="false" class="inspection-card">
      <!-- 页面标题 -->
      <div class="page-header">
        <span class="page-title">执法巡检登记</span>
      </div>

      <!-- 标签页 -->
      <a-tabs v-model:activeKey="activeTab" class="inspection-tabs">
        <a-tab-pane key="all" tab="全部记录">
          <!-- 筛选条件 -->
          <a-form :model="searchForm" layout="inline" class="search-form">
            <a-row :gutter="[16, 16]">
              <a-col :span="6">
                <a-form-item label="检查时间:">
                  <a-range-picker
                    v-model:value="searchForm.dateRange"
                    style="width: 100%"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="检查主题:">
                  <a-select v-model:value="searchForm.topic" placeholder="请选择检查主题" allow-clear>
                    <a-select-option value="pump_daily">污水泵站日常检查</a-select-option>
                    <a-select-option value="pipe_inspection">管道巡查</a-select-option>
                    <a-select-option value="drainage_check">排水检查</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="是否发现问题:">
                  <a-select v-model:value="searchForm.hasProblem" placeholder="请选择是否发现问题" allow-clear>
                    <a-select-option value="yes">是</a-select-option>
                    <a-select-option value="no">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="超期未整改:">
                  <a-select v-model:value="searchForm.overdueRectification" placeholder="请选择超期未整改" allow-clear>
                    <a-select-option value="yes">是</a-select-option>
                    <a-select-option value="no">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="问题检查:">
                  <a-select v-model:value="searchForm.problemCheck" placeholder="请选择问题检查" allow-clear>
                    <a-select-option value="yes">是</a-select-option>
                    <a-select-option value="no">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="检查部门:">
                  <a-input v-model:value="searchForm.department" placeholder="请输入检查部门" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="检查对象类型:">
                  <a-select v-model:value="searchForm.objectType" placeholder="请选择检查对象类型" allow-clear>
                    <a-select-option value="pump_station">泵站</a-select-option>
                    <a-select-option value="pipe">管道</a-select-option>
                    <a-select-option value="manhole">检查井</a-select-option>
                    <a-select-option value="outlet">排口</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="所在地区:">
                  <a-select v-model:value="searchForm.region" placeholder="请选择地区" allow-clear>
                    <a-select-option value="jiande">建德市</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-checkbox v-model:checked="searchForm.supervision">督办隐患</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item class="inline-buttons">
                  <a-space>
                    <a-button type="primary" @click="handleSearch">
                      <template #icon><SearchOutlined /></template>
                      搜索
                    </a-button>
                    <a-button @click="handleReset">
                      <template #icon><ReloadOutlined /></template>
                      重置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <!-- 批量操作区 -->
          <div class="action-area">
            <a-button style="background: #4CAF50; color: #fff; border-color: #4CAF50;" @click="handleBatchExport">批量导出</a-button>
          </div>

          <!-- 统计信息 -->
          <div class="stats-info">
            <span>仅按检查时间统计：</span>
            <span>问题数<b>{{ stats.problems }}</b>，</span>
            <span>已整改<b>{{ stats.rectified }}</b>，</span>
            <span>待整改<b>{{ stats.pending }}</b>，</span>
            <span>审核中<b>{{ stats.reviewing }}</b>，</span>
            <span>督办中<b>{{ stats.supervising }}</b></span>
          </div>

          <!-- 数据表格 -->
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :row-selection="rowSelection"
            row-key="id"
            :scroll="{ x: 1600 }"
            @change="handleTableChange"
            class="data-table"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'deleted'">
                <span>{{ record.deleted ? '是' : '否' }}</span>
              </template>
              <template v-if="column.key === 'isSupervision'">
                <span>{{ record.isSupervision ? '是' : '否' }}</span>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
                  <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="pending" tab="待整改">
          <a-empty description="暂无待整改记录" />
        </a-tab-pane>
        <a-tab-pane key="myPending" tab="我的待整改">
          <a-empty description="暂无我的待整改记录" />
        </a-tab-pane>
        <a-tab-pane key="completed" tab="已完成">
          <a-empty description="暂无已完成记录" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

// 当前激活的标签页
const activeTab = ref<string>('all')

// 搜索表单
const searchForm = reactive({
  dateRange: undefined as any,
  topic: undefined as string | undefined,
  hasProblem: undefined as string | undefined,
  overdueRectification: undefined as string | undefined,
  problemCheck: undefined as string | undefined,
  department: '',
  objectType: undefined as string | undefined,
  region: undefined as string | undefined,
  supervision: false
})

// 统计信息
const stats = reactive({
  problems: 0,
  rectified: 0,
  pending: 0,
  reviewing: 0,
  supervising: 0
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { title: '检查时间', dataIndex: 'checkTime', key: 'checkTime', width: 170 },
  { title: '检查主题', dataIndex: 'topic', key: 'topic', width: 220 },
  { title: '检查对象类型', dataIndex: 'objectType', key: 'objectType', width: 110 },
  { title: '检查对象名称', dataIndex: 'objectName', key: 'objectName', width: 140 },
  { title: '所在地区', dataIndex: 'region', key: 'region', width: 100 },
  { title: '检查部门', dataIndex: 'department', key: 'department', width: 100 },
  { title: '填报人员', dataIndex: 'reporter', key: 'reporter', width: 100 },
  { title: '问题数', dataIndex: 'problemCount', key: 'problemCount', width: 80, align: 'center' },
  { title: '已整改', dataIndex: 'rectified', key: 'rectified', width: 80, align: 'center' },
  { title: '待整改', dataIndex: 'pendingRectify', key: 'pendingRectify', width: 80, align: 'center' },
  { title: '检查对象是否删除', dataIndex: 'deleted', key: 'deleted', width: 130, align: 'center' },
  { title: '是否督办', dataIndex: 'isSupervision', key: 'isSupervision', width: 90, align: 'center' },
  { title: '操作', key: 'action', fixed: 'right', width: 120 }
]

// 模拟数据
const dataSource = ref([
  {
    id: 1,
    index: 1,
    checkTime: '2025-11-17 2:46:48',
    topic: '2025年污水泵站日常检查',
    objectType: '泵站',
    objectName: '',
    region: '',
    department: '章洁',
    reporter: '章洁',
    problemCount: 0,
    rectified: 0,
    pendingRectify: 0,
    deleted: false,
    isSupervision: false
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 行选择配置
const selectedRowKeys = ref<number[]>([])
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  }
}

// 事件处理
const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待实现')
}

const handleReset = () => {
  searchForm.dateRange = undefined
  searchForm.topic = undefined
  searchForm.hasProblem = undefined
  searchForm.overdueRectification = undefined
  searchForm.problemCheck = undefined
  searchForm.department = ''
  searchForm.objectType = undefined
  searchForm.region = undefined
  searchForm.supervision = false
  message.info('已重置搜索条件')
}

const handleBatchExport = () => {
  message.info('批量导出功能待实现')
}

const handleDetail = (record: any) => {
  message.info(`查看详情：${record.topic}`)
}

const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除该巡检记录吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('删除功能待实现')
    }
  })
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.inspection-registration {
  .inspection-card {
    min-height: calc(100vh - 180px);

    .page-header {
      margin-bottom: 12px;

      .page-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }

    .inspection-tabs {
      :deep(.ant-tabs-tab) {
        padding: 8px 20px;
      }

      :deep(.ant-tabs-tab-active) {
        background: #1890ff;
        border-radius: 4px 4px 0 0;

        .ant-tabs-tab-btn {
          color: #fff;
        }
      }
    }

    .search-form {
      margin-bottom: 16px;

      :deep(.ant-form-item-label) {
        font-size: 14px;
      }

      .inline-buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }

    .action-area {
      margin-bottom: 8px;
    }

    .stats-info {
      margin-bottom: 12px;
      color: #e53935;
      font-size: 13px;

      b {
        font-weight: 600;
        margin: 0 2px;
      }
    }

    .data-table {
      :deep(.ant-table) {
        font-size: 13px;
      }

      :deep(.ant-table-thead > tr > th) {
        background: #E3F2FD;
        font-weight: 600;
        font-size: 13px;
        padding: 10px 8px;
      }

      :deep(.ant-table-tbody > tr > td) {
        padding: 8px;
      }
    }
  }
}
</style>
