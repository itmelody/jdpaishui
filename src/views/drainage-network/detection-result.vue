<template>
  <div class="detection-result-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">检测结果信息</h2>
    </div>

    <!-- 搜索表单 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="[16, 16]">
          <a-col :span="6">
            <a-form-item label="编号:">
              <a-input v-model:value="searchForm.code" placeholder="请输入..." />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="项目编号:">
              <a-input v-model:value="searchForm.projectCode" placeholder="请输入..." />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属地区:">
              <a-select v-model:value="searchForm.area" placeholder="请选择...">
                <a-select-option value="hangzhou-jd">杭州市 / 建德市</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="登记人:">
              <a-input v-model:value="searchForm.registrar" placeholder="请输入..." />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="审核状态:">
              <a-select v-model:value="searchForm.auditStatus" placeholder="请选择...">
                <a-select-option value="pending">待审核</a-select-option>
                <a-select-option value="approved">审核完成</a-select-option>
                <a-select-option value="rejected">已驳回</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="检测单位:">
              <a-input v-model:value="searchForm.detectionUnit" placeholder="请输入..." />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="检测方式:">
              <a-select v-model:value="searchForm.detectionMethod" placeholder="请选择...">
                <a-select-option value="cctv">电视检测 (CCTV)</a-select-option>
                <a-select-option value="qv">潜望镜检测 (QV)</a-select-option>
                <a-select-option value="sonar">声纳检测</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否存在问题隐患:">
              <a-select v-model:value="searchForm.hasDanger" placeholder="请选择...">
                <a-select-option value="yes">是</a-select-option>
                <a-select-option value="no">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测日期:" class="nowrap-item">
              <a-range-picker
                v-model:value="searchForm.detectionDate"
                :placeholder="['开始日期', '结束日期']"
                style="width: 320px;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="未上传照片隐患:">
              <a-checkbox v-model:checked="searchForm.noPhotoDanger" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item class="inline-buttons">
              <a-space>
                <a-button type="primary" @click="handleSearch">
                  <SearchOutlined /> 搜索
                </a-button>
                <a-button @click="handleReset">
                  <ReloadOutlined /> 重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 提示信息 -->
    <div class="tip-bar">
      <span class="tip-text">提示：有28673条数据待审核</span>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <a-space>
        <a-button class="btn-export" @click="handleBatchExport">
          <DownloadOutlined /> 批量导出
        </a-button>
        <a-button class="btn-audit" @click="handleBatchAudit">
          <CheckCircleOutlined /> 批量审核
        </a-button>
        <a-button class="btn-filter" @click="handleFilter">
          <FilterOutlined /> 点击筛选
        </a-button>
      </a-space>
    </div>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        size="small"
        :scroll="{ x: 1800 }"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'stripe-row' : '')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'hasDanger'">
            <a-tag :color="record.hasDanger === '是' ? 'red' : 'default'">
              {{ record.hasDanger }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space>
              <a class="action-link view" @click="handleView(record)">查看</a>
              <a class="action-link delete" @click="handleDelete(record)">删除</a>
              <a class="action-link audit" @click="handleAudit(record)">审核</a>
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
  DownloadOutlined,
  CheckCircleOutlined,
  FilterOutlined
} from '@ant-design/icons-vue'

// 搜索表单
const searchForm = reactive({
  code: '',
  projectCode: '',
  area: undefined as string | undefined,
  registrar: '',
  auditStatus: undefined as string | undefined,
  detectionDate: [] as any[],
  detectionUnit: '',
  detectionMethod: undefined as string | undefined,
  hasDanger: undefined as string | undefined,
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
  { title: '检测记录编号', dataIndex: 'detectionCode', key: 'detectionCode', width: 180 },
  { title: '所属区域', dataIndex: 'area', key: 'area', width: 120 },
  { title: '所在道路名称', dataIndex: 'roadName', key: 'roadName', width: 130 },
  { title: '所属作业任务', dataIndex: 'taskName', key: 'taskName', width: 160 },
  { title: '检测项目编号', dataIndex: 'projectCode', key: 'projectCode', width: 160 },
  { title: '检测单位名称', dataIndex: 'unitName', key: 'unitName', width: 200 },
  { title: '检测单位编号', dataIndex: 'unitCode', key: 'unitCode', width: 140 },
  { title: '管网类型', dataIndex: 'networkType', key: 'networkType', width: 100 },
  { title: '起始井号', dataIndex: 'startManhole', key: 'startManhole', width: 120 },
  { title: '终止井号', dataIndex: 'endManhole', key: 'endManhole', width: 120 },
  { title: '检测日期', dataIndex: 'detectionDate', key: 'detectionDate', width: 120 },
  { title: '检测方式', dataIndex: 'detectionMethod', key: 'detectionMethod', width: 140 },
  { title: '是否存在隐患', dataIndex: 'hasDanger', key: 'hasDanger', width: 110 },
  { title: '登记人', dataIndex: 'registrar', key: 'registrar', width: 80 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const }
]

// 表格数据（模拟19条）
const dataSource = ref([
  {
    id: 1, index: 1, detectionCode: 'JC20260525001', area: '杭州市-建德市', roadName: '环城北路',
    taskName: '建德市污水管网检测', projectCode: 'PRJ2026001', unitName: '浙江管网检测技术有限公司',
    unitCode: 'UNIT001', networkType: '污水管网', startManhole: 'W001', endManhole: 'W002',
    detectionDate: '2026-05-25', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '张三'
  },
  {
    id: 2, index: 2, detectionCode: 'JC20260525002', area: '杭州市-建德市', roadName: '环城北路',
    taskName: '建德市污水管网检测', projectCode: 'PRJ2026001', unitName: '浙江管网检测技术有限公司',
    unitCode: 'UNIT001', networkType: '污水管网', startManhole: 'W002', endManhole: 'W003',
    detectionDate: '2026-05-25', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '张三'
  },
  {
    id: 3, index: 3, detectionCode: 'JC20260525003', area: '杭州市-建德市', roadName: '环城北路',
    taskName: '建德市污水管网检测', projectCode: 'PRJ2026001', unitName: '浙江管网检测技术有限公司',
    unitCode: 'UNIT001', networkType: '污水管网', startManhole: 'W003', endManhole: 'W004',
    detectionDate: '2026-05-25', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '李四'
  },
  {
    id: 4, index: 4, detectionCode: 'JC20260524001', area: '杭州市-建德市', roadName: '新安东路',
    taskName: '建德市雨水管网检测', projectCode: 'PRJ2026002', unitName: '杭州市政检测有限公司',
    unitCode: 'UNIT002', networkType: '雨水管网', startManhole: 'Y010', endManhole: 'Y011',
    detectionDate: '2026-05-24', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '王五'
  },
  {
    id: 5, index: 5, detectionCode: 'JC20260524002', area: '杭州市-建德市', roadName: '新安东路',
    taskName: '建德市雨水管网检测', projectCode: 'PRJ2026002', unitName: '杭州市政检测有限公司',
    unitCode: 'UNIT002', networkType: '雨水管网', startManhole: 'Y011', endManhole: 'Y012',
    detectionDate: '2026-05-24', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '王五'
  },
  {
    id: 6, index: 6, detectionCode: 'JC20260523001', area: '杭州市-建德市', roadName: '严州大道',
    taskName: '建德市污水管网检测', projectCode: 'PRJ2026001', unitName: '浙江管网检测技术有限公司',
    unitCode: 'UNIT001', networkType: '污水管网', startManhole: 'W010', endManhole: 'W011',
    detectionDate: '2026-05-23', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '赵六'
  },
  {
    id: 7, index: 7, detectionCode: 'JC20260523002', area: '杭州市-建德市', roadName: '严州大道',
    taskName: '建德市污水管网检测', projectCode: 'PRJ2026001', unitName: '浙江管网检测技术有限公司',
    unitCode: 'UNIT001', networkType: '污水管网', startManhole: 'W011', endManhole: 'W012',
    detectionDate: '2026-05-23', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '赵六'
  },
  {
    id: 8, index: 8, detectionCode: 'JC20260522001', area: '杭州市-建德市', roadName: '白沙路',
    taskName: '建德市合流管网检测', projectCode: 'PRJ2026003', unitName: '建德检测仪器有限公司',
    unitCode: 'UNIT003', networkType: '合流管网', startManhole: 'H001', endManhole: 'H002',
    detectionDate: '2026-05-22', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '孙七'
  },
  {
    id: 9, index: 9, detectionCode: 'JC20260522002', area: '杭州市-建德市', roadName: '白沙路',
    taskName: '建德市合流管网检测', projectCode: 'PRJ2026003', unitName: '建德检测仪器有限公司',
    unitCode: 'UNIT003', networkType: '合流管网', startManhole: 'H002', endManhole: 'H003',
    detectionDate: '2026-05-22', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '孙七'
  },
  {
    id: 10, index: 10, detectionCode: 'JC20260521001', area: '杭州市-建德市', roadName: '环城北路',
    taskName: '建德市污水管网检测', projectCode: 'PRJ2026001', unitName: '浙江管网检测技术有限公司',
    unitCode: 'UNIT001', networkType: '污水管网', startManhole: 'W020', endManhole: 'W021',
    detectionDate: '2026-05-21', detectionMethod: '电视检测 (CCTV)', hasDanger: '否', registrar: '周八'
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 19,
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
  searchForm.code = ''
  searchForm.projectCode = ''
  searchForm.area = undefined
  searchForm.registrar = ''
  searchForm.auditStatus = undefined
  searchForm.detectionDate = []
  searchForm.detectionUnit = ''
  searchForm.detectionMethod = undefined
  searchForm.hasDanger = undefined
  searchForm.noPhotoDanger = false
}

const handleBatchExport = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要导出的数据')
    return
  }
  message.success(`正在导出 ${selectedRowKeys.value.length} 条数据...`)
}

const handleBatchAudit = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要审核的数据')
    return
  }
  message.success(`正在审核 ${selectedRowKeys.value.length} 条数据...`)
}

const handleFilter = () => {
  message.info('展开更多筛选条件...')
}

const handleView = (record: any) => {
  message.info(`查看记录: ${record.detectionCode}`)
}

const handleDelete = (record: any) => {
  message.info(`删除记录: ${record.detectionCode}`)
}

const handleAudit = (record: any) => {
  message.info(`审核记录: ${record.detectionCode}`)
}
</script>

<style scoped lang="scss">
.detection-result-page {
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
      :deep(.ant-form-item-label) {
        label {
          font-size: 14px;
          color: #666;
        }
      }

      .nowrap-item {
        :deep(.ant-form-item-control-input-content) {
          white-space: nowrap;
        }
      }

      .inline-buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }

  .tip-bar {
    margin-bottom: 12px;

    .tip-text {
      font-size: 13px;
      color: #666;
    }
  }

  .action-bar {
    margin-bottom: 12px;

    .btn-export {
      background-color: #67c23a;
      border-color: #67c23a;
      color: #fff;
      border-radius: 4px;

      &:hover {
        background-color: #85ce61;
        border-color: #85ce61;
        color: #fff;
      }
    }

    .btn-audit {
      background-color: #e6f7ff;
      border-color: #91d5ff;
      color: #1890ff;
      border-radius: 4px;

      &:hover {
        background-color: #bae7ff;
        border-color: #69c0ff;
        color: #1890ff;
      }
    }

    .btn-filter {
      background-color: #f5f7fa;
      border-color: #dcdfe6;
      color: #333;
      border-radius: 4px;

      &:hover {
        background-color: #ecf5ff;
        border-color: #c0c4cc;
        color: #333;
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

    .action-link {
      font-size: 13px;

      &.view {
        color: #1890ff;
      }

      &.delete {
        color: #999;

        &:hover {
          color: #ff4d4f;
        }
      }

      &.audit {
        color: #1890ff;
      }
    }
  }
}
</style>
