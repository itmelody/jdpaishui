<template>
  <div class="unit-basic-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">检测单位基础信息</h2>
    </div>

    <!-- 搜索表单 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="[16, 12]">
          <a-col :span="6">
            <a-form-item label="单位名称:">
              <a-input v-model:value="searchForm.unitName" placeholder="请输入单位名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="统一社会信用代码:">
              <a-input v-model:value="searchForm.creditCode" placeholder="统一社会信用代码" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属区域:">
              <a-select v-model:value="searchForm.area" placeholder="请选择">
                <a-select-option value="hangzhou-jd">杭州市 / 建德市</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="当前状态:">
              <a-select v-model:value="searchForm.status" placeholder="请选择">
                <a-select-option value="active">正常</a-select-option>
                <a-select-option value="inactive">已作废</a-select-option>
                <a-select-option value="suspended">暂停</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 扩展筛选项 -->
        <a-row :gutter="[16, 12]" class="extra-filters">
          <a-col :span="6">
            <a-form-item label="合同状态:">
              <a-checkbox v-model:checked="searchForm.expiredContract">筛选已到期合同</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="数据同步状态:">
              <a-checkbox v-model:checked="searchForm.pendingSync">筛选待同步数据</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item class="search-buttons">
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <SearchOutlined /> 搜索
            </a-button>
            <a-button @click="handleReset">
              <ReloadOutlined /> 重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 操作提示区 -->
    <div class="action-bar">
      <a-button type="primary" class="btn-add" @click="handleAdd">
        <PlusOutlined /> 新增检测单位
      </a-button>
      <div class="action-tip">
        <a-alert
          message="请在停止作业后同步检查并信息数据，同步后将更新检查并编码信息。"
          type="warning"
          show-icon
          :closable="false"
        />
      </div>
    </div>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        row-key="id"
        size="small"
        :scroll="{ x: 1600 }"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'stripe-row' : '')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a class="action-link" @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a class="action-link" @click="handleTaskManage(record)">作业管理</a>
              <a-divider type="vertical" />
              <a class="action-link" @click="handleResetPassword(record)">重置密码</a>
              <a-divider type="vertical" />
              <a class="action-link danger" @click="handleVoid(record)">作废</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

// 搜索表单
const searchForm = reactive({
  unitName: '',
  creditCode: '',
  area: 'hangzhou-jd' as string | undefined,
  status: undefined as string | undefined,
  expiredContract: false,
  pendingSync: false
})

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, fixed: 'left' as const },
  { title: '单位名称', dataIndex: 'unitName', key: 'unitName', width: 220 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 },
  { title: '所属区域', dataIndex: 'area', key: 'area', width: 120 },
  { title: '单位详细地址', dataIndex: 'address', key: 'address', width: 280, ellipsis: true },
  { title: '法定代表人', dataIndex: 'legalPerson', key: 'legalPerson', width: 100 },
  { title: '法人联系方式', dataIndex: 'legalPhone', key: 'legalPhone', width: 130 },
  { title: '单位负责人', dataIndex: 'manager', key: 'manager', width: 100 },
  { title: '负责人联系方式', dataIndex: 'managerPhone', key: 'managerPhone', width: 130 },
  { title: '日常联系人', dataIndex: 'contact', key: 'contact', width: 100 },
  { title: '联系人电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 },
  { title: '操作', key: 'action', width: 240, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1,
    index: 1,
    unitName: '建德市新园市政工程有限公司',
    creditCode: '91330182322904571F',
    area: '杭州市·建德市',
    address: '浙江省杭州市建德市经济开发区横铜区块E2-17幢',
    legalPerson: '张少川',
    legalPhone: '15805816027',
    manager: '何斌杰',
    managerPhone: '13819167890',
    contact: '何斌杰',
    contactPhone: '13819167890'
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 操作方法
const handleSearch = () => {
  message.info('执行搜索...')
}

const handleReset = () => {
  searchForm.unitName = ''
  searchForm.creditCode = ''
  searchForm.area = 'hangzhou-jd'
  searchForm.status = undefined
  searchForm.expiredContract = false
  searchForm.pendingSync = false
}

const handleAdd = () => {
  message.info('打开新增检测单位表单...')
}

const handleView = (record: any) => {
  message.info(`查看单位: ${record.unitName}`)
}

const handleTaskManage = (record: any) => {
  message.info(`作业管理: ${record.unitName}`)
}

const handleResetPassword = (record: any) => {
  message.info(`重置密码: ${record.unitName}`)
}

const handleVoid = (record: any) => {
  message.warning(`作废单位: ${record.unitName}`)
}
</script>

<style scoped lang="scss">
.unit-basic-page {
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

    .search-form {
      :deep(.ant-form-item) {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
      }

      :deep(.ant-form-item-label) {
        flex-shrink: 0;
        min-width: 130px;
        text-align: right;

        label {
          font-size: 14px;
          color: #666;
        }
      }

      :deep(.ant-form-item-control) {
        flex: 1;
      }

      :deep(.ant-input),
      :deep(.ant-select) {
        width: 100%;
      }

      .extra-filters {
        margin-top: 0;
      }

      .search-buttons {
        width: 100%;
        text-align: right;
        margin-top: 4px;
      }
    }
  }

  .action-bar {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 16px;

    .btn-add {
      flex-shrink: 0;
      border-radius: 4px;
    }

    .action-tip {
      flex: 1;
    }
  }

  .table-card {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
        font-size: 13px;
        color: #333;
      }

      .stripe-row {
        background-color: #f9fafc;
      }

      .ant-table-tbody > tr:hover > td {
        background-color: #e6f7ff;
      }
    }

    .action-link {
      font-size: 13px;
      color: #1890ff;

      &:hover {
        color: #40a9ff;
      }

      &.danger {
        color: #ff4d4f;

        &:hover {
          color: #ff7875;
        }
      }
    }
  }
}
</style>
