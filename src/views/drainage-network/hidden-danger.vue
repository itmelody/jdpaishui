<template>
  <div class="hidden-danger-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">隐患数据信息</h2>
    </div>

    <!-- 标签页导航 -->
    <div class="tab-nav">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 搜索表单 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="[16, 12]">
          <!-- 第一行 -->
          <a-col :span="6">
            <a-form-item label="隐患编号:">
              <a-input v-model:value="searchForm.dangerCode" placeholder="请输入隐患编号" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属地区:">
              <a-select v-model:value="searchForm.area" placeholder="请选择">
                <a-select-option value="hangzhou-jd">杭州市 / 建德市</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="检测项目编号:">
              <a-input v-model:value="searchForm.projectCode" placeholder="请输入检测项目编号" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="检测日期:">
              <a-range-picker
                v-model:value="searchForm.detectionDate"
                :placeholder="['开始日期', '结束日期']"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <!-- 第二行 -->
          <a-col :span="6">
            <a-form-item label="隐患类型:">
              <a-select v-model:value="searchForm.dangerType" placeholder="请选择">
                <a-select-option value="structural">结构性缺陷</a-select-option>
                <a-select-option value="functional">功能性缺陷</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="隐患代码:">
              <a-select v-model:value="searchForm.dangerCodeField" placeholder="请选择">
                <a-select-option value="AJ">AJ - 暗接</a-select-option>
                <a-select-option value="PL">PL - 破裂</a-select-option>
                <a-select-option value="TL">TL - 脱节</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="隐患级别:">
              <a-select v-model:value="searchForm.dangerLevel" placeholder="请选择">
                <a-select-option value="1">一级</a-select-option>
                <a-select-option value="2">二级</a-select-option>
                <a-select-option value="3">三级</a-select-option>
                <a-select-option value="4">四级</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否修复:">
              <a-select v-model:value="searchForm.isRepaired" placeholder="请选择">
                <a-select-option value="yes">已修复</a-select-option>
                <a-select-option value="no">未修复</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!-- 第三行 -->
          <a-col :span="6">
            <a-form-item label="检测单位名称:">
              <a-input v-model:value="searchForm.unitName" placeholder="请输入检测单位名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="检测单位编码:">
              <a-input v-model:value="searchForm.unitCode" placeholder="请输入检测单位编码" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管网类型:">
              <a-select v-model:value="searchForm.networkType" placeholder="请选择管网类型">
                <a-select-option value="sewage">污水管网</a-select-option>
                <a-select-option value="rainwater">雨水管网</a-select-option>
                <a-select-option value="combined">合流管网</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在道路名称:">
              <a-input v-model:value="searchForm.roadName" placeholder="请输入所在道路名称" />
            </a-form-item>
          </a-col>

          <!-- 第四行 -->
          <a-col :span="6">
            <a-form-item label="处置结果:">
              <a-select v-model:value="searchForm.disposalResult" placeholder="请选择">
                <a-select-option value="repaired">已修复</a-select-option>
                <a-select-option value="pending">待处置</a-select-option>
                <a-select-option value="inProgress">处置中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="审核状态:">
              <a-select v-model:value="searchForm.auditStatus" placeholder="请选择">
                <a-select-option value="pending">待审核</a-select-option>
                <a-select-option value="approved">审核通过</a-select-option>
                <a-select-option value="rejected">已驳回</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="超期未修复:">
              <a-checkbox v-model:checked="searchForm.overdueUnrepaired">启用筛选</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="未上传照片隐患:">
              <a-checkbox v-model:checked="searchForm.noPhotoDanger">启用筛选</a-checkbox>
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

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <div class="action-left">
        <a-space>
          <a-button class="btn-download" @click="handleDownloadTemplate">
            <DownloadOutlined /> 下载模板
          </a-button>
          <a-button class="btn-import" @click="handleBatchImport">
            <UploadOutlined /> 批量导入修复信息
          </a-button>
          <a-button class="btn-export" @click="handleBatchExport">
            <ExportOutlined /> 批量导出
          </a-button>
          <a-button class="btn-edit" @click="handleBatchEdit">
            <EditOutlined /> 批量编辑修复信息
          </a-button>
        </a-space>
      </div>
      <div class="action-right">
        <a-button class="btn-filter" @click="handleFilter">
          <FilterOutlined /> 点击筛选
        </a-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        size="small"
        :scroll="{ x: 1600 }"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'stripe-row' : '')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'auditStatus'">
            <a-tag :color="record.auditStatus === '审核通过' ? 'green' : record.auditStatus === '已驳回' ? 'red' : 'orange'">
              {{ record.auditStatus }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space>
              <a class="action-link view" @click="handleView(record)">查看</a>
              <a class="action-link edit" @click="handleEdit(record)">编辑</a>
              <a class="action-link delete" @click="handleDelete(record)">删除</a>
            </a-space>
          </template>
        </template>

        <template #emptyText>
          <div class="empty-data">
            <a-empty description="暂无数据" />
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
  EditOutlined,
  FilterOutlined
} from '@ant-design/icons-vue'

// 标签页配置
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处置' },
  { key: 'scheduled', label: '按期整治隐患' },
  { key: 'supervised', label: '督办隐患' }
]
const activeTab = ref('all')

// 搜索表单
const searchForm = reactive({
  dangerCode: '',
  area: undefined as string | undefined,
  projectCode: '',
  detectionDate: [] as any[],
  dangerType: undefined as string | undefined,
  dangerCodeField: undefined as string | undefined,
  dangerLevel: undefined as string | undefined,
  isRepaired: undefined as string | undefined,
  unitName: '',
  unitCode: '',
  networkType: undefined as string | undefined,
  roadName: '',
  disposalResult: undefined as string | undefined,
  auditStatus: undefined as string | undefined,
  overdueUnrepaired: false,
  noPhotoDanger: false
})

// 选中的行
const selectedRowKeys = ref<number[]>([])
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, fixed: 'left' as const },
  { title: '隐患编号', dataIndex: 'dangerCode', key: 'dangerCode', width: 160 },
  { title: '所属地区', dataIndex: 'area', key: 'area', width: 120 },
  { title: '所在道路名称', dataIndex: 'roadName', key: 'roadName', width: 130 },
  { title: '检测日期', dataIndex: 'detectionDate', key: 'detectionDate', width: 120 },
  { title: '检测项目编号', dataIndex: 'projectCode', key: 'projectCode', width: 150 },
  { title: '检测单位名称', dataIndex: 'unitName', key: 'unitName', width: 200 },
  { title: '检测单位编号', dataIndex: 'unitCode', key: 'unitCode', width: 130 },
  { title: '管网类型', dataIndex: 'networkType', key: 'networkType', width: 100 },
  { title: '隐患类型', dataIndex: 'dangerType', key: 'dangerType', width: 120 },
  { title: '隐患等级', dataIndex: 'dangerLevel', key: 'dangerLevel', width: 100 },
  { title: '企业审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 120 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const }
]

// 表格数据（当前为空，与设计稿一致）
const dataSource = ref<any[]>([])

// 根据标签页过滤数据
const filteredData = computed(() => {
  if (activeTab.value === 'all') return dataSource.value
  // 可根据标签页类型进一步过滤
  return dataSource.value
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
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
  searchForm.dangerCode = ''
  searchForm.area = undefined
  searchForm.projectCode = ''
  searchForm.detectionDate = []
  searchForm.dangerType = undefined
  searchForm.dangerCodeField = undefined
  searchForm.dangerLevel = undefined
  searchForm.isRepaired = undefined
  searchForm.unitName = ''
  searchForm.unitCode = ''
  searchForm.networkType = undefined
  searchForm.roadName = ''
  searchForm.disposalResult = undefined
  searchForm.auditStatus = undefined
  searchForm.overdueUnrepaired = false
  searchForm.noPhotoDanger = false
}

const handleDownloadTemplate = () => {
  message.info('正在下载修复信息模板...')
}

const handleBatchImport = () => {
  message.info('打开批量导入修复信息...')
}

const handleBatchExport = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要导出的数据')
    return
  }
  message.success(`正在导出 ${selectedRowKeys.value.length} 条数据...`)
}

const handleBatchEdit = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要编辑的数据')
    return
  }
  message.info(`正在批量编辑 ${selectedRowKeys.value.length} 条数据...`)
}

const handleFilter = () => {
  message.info('展开更多筛选条件...')
}

const handleView = (record: any) => {
  message.info(`查看隐患记录: ${record.dangerCode}`)
}

const handleEdit = (record: any) => {
  message.info(`编辑隐患记录: ${record.dangerCode}`)
}

const handleDelete = (record: any) => {
  message.info(`删除隐患记录: ${record.dangerCode}`)
}
</script>

<style scoped lang="scss">
.hidden-danger-page {
  .page-header {
    margin-bottom: 16px;

    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  // 标签页导航
  .tab-nav {
    display: flex;
    margin-bottom: 16px;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

    .tab-item {
      flex: 1;
      text-align: center;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      background: #f5f7fa;
      border-right: 1px solid #e8e8e8;
      transition: all 0.3s;

      &:last-child {
        border-right: none;
      }

      &:hover {
        background: #e6f0fa;
        color: #1890ff;
      }

      &.active {
        background: #1890ff;
        color: #fff;
        font-weight: 600;
      }
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
        min-width: 110px;
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
      :deep(.ant-select),
      :deep(.ant-picker) {
        width: 100%;
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .btn-download {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
      border-radius: 4px;

      &:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
        color: #fff;
      }
    }

    .btn-import {
      background-color: #ff9800;
      border-color: #ff9800;
      color: #fff;
      border-radius: 4px;

      &:hover {
        background-color: #ffa726;
        border-color: #ffa726;
        color: #fff;
      }
    }

    .btn-export {
      background-color: #4caf50;
      border-color: #4caf50;
      color: #fff;
      border-radius: 4px;

      &:hover {
        background-color: #66bb6a;
        border-color: #66bb6a;
        color: #fff;
      }
    }

    .btn-edit {
      background-color: #64b5f6;
      border-color: #64b5f6;
      color: #fff;
      border-radius: 4px;

      &:hover {
        background-color: #90caf9;
        border-color: #90caf9;
        color: #fff;
      }
    }

    .btn-filter {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
      border-radius: 4px;

      &:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
        color: #fff;
      }
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

    .empty-data {
      padding: 40px 0;
    }

    .action-link {
      font-size: 13px;

      &.view {
        color: #1890ff;
      }

      &.edit {
        color: #1890ff;
      }

      &.delete {
        color: #999;

        &:hover {
          color: #ff4d4f;
        }
      }
    }
  }
}
</style>
