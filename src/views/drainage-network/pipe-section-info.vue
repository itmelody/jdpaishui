<template>
  <div class="pipe-section-info-page">
    <!-- 搜索表单 -->
    <a-card :bordered="false" class="search-card">
      <a-form layout="inline" :model="searchForm">
        <a-row :gutter="[16, 16]" style="width: 100%">
          <a-col :span="6">
            <a-form-item label="编号">
              <a-input v-model:value="searchForm.code" placeholder="请输入编号" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属地区">
              <a-select v-model:value="searchForm.region" placeholder="请选择所属地区">
                <a-select-option value="hangzhou">杭州市 / 建德市</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="项目编号">
              <a-input v-model:value="searchForm.projectCode" placeholder="请输入检测项目编号" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="登记人员">
              <a-input v-model:value="searchForm.registrar" placeholder="请输入登记人员" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="[16, 16]" style="width: 100%; margin-top: 8px">
          <a-col :span="6">
            <a-form-item label="单位名称">
              <a-input v-model:value="searchForm.unitName" placeholder="请输入检测单位名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="单位编码">
              <a-input v-model:value="searchForm.unitCode" placeholder="请输入检测单位编码" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="审核状态">
              <a-select v-model:value="searchForm.auditStatus" placeholder="请选择审核状态">
                <a-select-option value="pending">待审核</a-select-option>
                <a-select-option value="completed">审核完成</a-select-option>
                <a-select-option value="rejected">审核不通过</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="更新时间">
              <a-range-picker v-model:value="searchForm.updateTime" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="[16, 16]" style="width: 100%; margin-top: 8px">
          <a-col :span="6">
            <a-form-item label="管网类型">
              <a-select v-model:value="searchForm.networkType" placeholder="请选择管网类型">
                <a-select-option value="sewage">污水管网</a-select-option>
                <a-select-option value="rainwater">雨水管网</a-select-option>
                <a-select-option value="combined">合流管网</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管网管龄">
              <a-select v-model:value="searchForm.pipeAge" placeholder="请选择">
                <a-select-option value="0-5">0-5年</a-select-option>
                <a-select-option value="5-10">5-10年</a-select-option>
                <a-select-option value="10+">10年以上</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在道路名称">
              <a-input v-model:value="searchForm.roadName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="权属单位">
              <a-input v-model:value="searchForm.ownerUnit" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="[16, 16]" style="width: 100%; margin-top: 8px">
          <a-col :span="6">
            <a-form-item label="养护单位">
              <a-input v-model:value="searchForm.maintenanceUnit" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="18">
            <a-form-item>
              <a-button type="primary" @click="handleSearch" style="margin-right: 8px">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button @click="handleReset">
                <template #icon><ReloadOutlined /></template>
                重置
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <div class="table-header">
        <a-space>
          <a-button type="primary">
            批量编辑管段信息
          </a-button>
          <span class="tip-text">只允许编辑审核通过的管段数据</span>
        </a-space>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        :row-selection="rowSelection"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'auditStatus'">
            <span :class="record.auditStatus === 'completed' ? 'status-completed' : ''">
              {{ record.auditStatus === 'completed' ? '审核完成' : record.auditStatus }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="handleEdit(record)">编 辑</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 搜索表单
const searchForm = reactive({
  code: '',
  region: undefined,
  projectCode: '',
  registrar: '',
  unitName: '',
  unitCode: '',
  auditStatus: undefined,
  updateTime: [],
  networkType: undefined,
  pipeAge: undefined,
  roadName: '',
  ownerUnit: '',
  maintenanceUnit: ''
})

// 表格列配置
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    fixed: 'left'
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
    width: 180,
    fixed: 'left'
  },
  {
    title: '检测项目编号',
    dataIndex: 'projectCode',
    key: 'projectCode',
    width: 150
  },
  {
    title: '检测单位名称',
    dataIndex: 'unitName',
    key: 'unitName',
    width: 200
  },
  {
    title: '检测单位编号',
    dataIndex: 'unitCode',
    key: 'unitCode',
    width: 150
  },
  {
    title: '所属区域',
    dataIndex: 'region',
    key: 'region',
    width: 150
  },
  {
    title: '所在道路名称',
    dataIndex: 'roadName',
    key: 'roadName',
    width: 150
  },
  {
    title: '权属单位',
    dataIndex: 'ownerUnit',
    key: 'ownerUnit',
    width: 180
  },
  {
    title: '养护单位',
    dataIndex: 'maintenanceUnit',
    key: 'maintenanceUnit',
    width: 180
  },
  {
    title: '管网类型',
    dataIndex: 'networkType',
    key: 'networkType',
    width: 120
  },
  {
    title: '起始井编号',
    dataIndex: 'startWellCode',
    key: 'startWellCode',
    width: 150
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    key: 'auditStatus',
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right'
  }
]

// 表格数据
const dataSource = ref([
  {
    id: '1',
    index: 1,
    code: '3301820000001887',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001887',
    endWellCode: '3301820000001888',
    diameter: 400,
    material: '混凝土',
    length: 150.5,
    depth: 2.5,
    auditStatus: 'completed'
  },
  {
    id: '2',
    index: 2,
    code: '3301820000001886',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001886',
    endWellCode: '3301820000001887',
    diameter: 400,
    material: '混凝土',
    length: 180.2,
    depth: 2.8,
    auditStatus: 'completed'
  },
  {
    id: '3',
    index: 3,
    code: '3301820000001885',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '新安东路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001885',
    endWellCode: '3301820000001886',
    diameter: 500,
    material: '混凝土',
    length: 95.3,
    depth: 1.8,
    auditStatus: 'completed'
  },
  {
    id: '4',
    index: 4,
    code: '3301820000001884',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001884',
    endWellCode: '3301820000001885',
    diameter: 400,
    material: '混凝土',
    length: 120.8,
    depth: 2.2,
    auditStatus: 'completed'
  },
  {
    id: '5',
    index: 5,
    code: '3301820000001883',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001883',
    endWellCode: '3301820000001884',
    diameter: 400,
    material: '混凝土',
    length: 135.6,
    depth: 2.3,
    auditStatus: 'completed'
  },
  {
    id: '6',
    index: 6,
    code: '3301820000001882',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001882',
    endWellCode: '3301820000001883',
    diameter: 400,
    material: '混凝土',
    length: 142.3,
    depth: 2.4,
    auditStatus: 'completed'
  },
  {
    id: '7',
    index: 7,
    code: '3301820000001881',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001881',
    endWellCode: '3301820000001882',
    diameter: 400,
    material: '混凝土',
    length: 158.9,
    depth: 2.6,
    auditStatus: 'completed'
  },
  {
    id: '8',
    index: 8,
    code: '3301820000001880',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001880',
    endWellCode: '3301820000001881',
    diameter: 400,
    material: '混凝土',
    length: 165.4,
    depth: 2.7,
    auditStatus: 'completed'
  },
  {
    id: '9',
    index: 9,
    code: '3301820000001879',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001879',
    endWellCode: '3301820000001880',
    diameter: 400,
    material: '混凝土',
    length: 172.1,
    depth: 2.8,
    auditStatus: 'completed'
  },
  {
    id: '10',
    index: 10,
    code: '3301820000001878',
    projectCode: '',
    unitName: '',
    unitCode: '',
    region: '杭州市-建德市',
    roadName: '政法路',
    ownerUnit: '建德市水务有限公司',
    maintenanceUnit: '建德市新园市政工程有限公司',
    networkType: '污水管网',
    startWellCode: '3301820000001878',
    endWellCode: '3301820000001879',
    diameter: 400,
    material: '混凝土',
    length: 188.7,
    depth: 2.9,
    auditStatus: 'completed'
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 1655,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 加载状态
const loading = ref(false)

// 行选择配置
const rowSelection = {
  selectedRowKeys: ref<string[]>([]),
  onChange: (selectedRowKeys: string[]) => {
    rowSelection.selectedRowKeys.value = selectedRowKeys
  }
}

// 搜索
const handleSearch = () => {
  loading.value = true
  message.info('执行查询...')
  // TODO: 调用API查询数据
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置
const handleReset = () => {
  searchForm.code = ''
  searchForm.region = undefined
  searchForm.projectCode = ''
  searchForm.registrar = ''
  searchForm.unitName = ''
  searchForm.unitCode = ''
  searchForm.auditStatus = undefined
  searchForm.updateTime = []
  searchForm.networkType = undefined
  searchForm.pipeAge = undefined
  searchForm.roadName = ''
  searchForm.ownerUnit = ''
  searchForm.maintenanceUnit = ''
  message.info('已重置搜索条件')
}

// 新增
const handleAdd = () => {
  message.info('打开新增对话框')
  // TODO: 实现新增功能
}

// 导出
const handleExport = () => {
  message.info('导出数据到Excel')
  // TODO: 实现导出功能
}

// 编辑
const handleEdit = (record: any) => {
  if (record.auditStatus !== 'completed') {
    message.warning('只能编辑审核通过的管段数据')
    return
  }
  message.info(`编辑管段：${record.code}`)
  // TODO: 实现编辑功能
}

// 表格变化（分页、排序、筛选）
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  // TODO: 重新加载数据
}
</script>

<style scoped lang="scss">
.pipe-section-info-page {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 120px);

  .search-card {
    margin-bottom: 16px;
    border-radius: 4px;
    
    :deep(.ant-card-body) {
      padding: 24px 24px 8px 24px;
    }

    :deep(.ant-form-item-label) {
      label {
        font-size: 14px;
        color: #333;
        
        &::after {
          content: ':';
          margin-left: 4px;
        }
      }
    }

    :deep(.ant-input),
    :deep(.ant-select-selector) {
      border-radius: 4px;
    }

    :deep(.ant-btn-primary) {
      background-color: #1890ff;
      border-color: #1890ff;
      
      &:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
      }
    }

    :deep(.ant-btn-default) {
      border-radius: 4px;
      
      &:hover {
        color: #1890ff;
        border-color: #1890ff;
      }
    }
  }

  .table-card {
    border-radius: 4px;

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .tip-text {
        color: #ff4d4f;
        font-size: 14px;
        margin-left: 8px;
      }
    }

    :deep(.ant-table) {
      .status-completed {
        color: #1890ff;
        font-weight: 500;
      }

      .ant-btn-link {
        color: #1890ff;
        padding: 0;
        
        &:hover {
          color: #40a9ff;
        }
      }

      .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
      }

      .ant-table-tbody > tr:hover > td {
        background-color: #e6f7ff;
      }
    }

    :deep(.ant-pagination) {
      margin-top: 16px;
      
      .ant-pagination-item-active {
        border-color: #1890ff;
        
        a {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
