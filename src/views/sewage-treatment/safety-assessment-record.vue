<template>
  <div class="safety-assessment-record-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="评估企业名称:">
        <a-input v-model:value="searchForm.evalCompanyName" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="评估对象:">
        <a-select v-model:value="searchForm.evalTarget" placeholder="请选择" allow-clear>
          <a-select-option value="plant">污水处理厂</a-select-option>
          <a-select-option value="pipe">配套管网</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属区域:">
        <a-select v-model:value="searchForm.region" placeholder="请选择地区" allow-clear>
          <a-select-option value="hangzhou">杭州市</a-select-option>
          <a-select-option value="ningbo">宁波市</a-select-option>
          <a-select-option value="wenzhou">温州市</a-select-option>
          <a-select-option value="jinhua">金华市</a-select-option>
          <a-select-option value="taizhou">台州市</a-select-option>
          <a-select-option value="shaoxing">绍兴市</a-select-option>
          <a-select-option value="zhoushan">舟山市</a-select-option>
          <a-select-option value="jiaxing">嘉兴市</a-select-option>
          <a-select-option value="huzhou">湖州市</a-select-option>
          <a-select-option value="quzhou">衢州市</a-select-option>
          <a-select-option value="lishui">丽水市</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="安评机构:">
        <a-input v-model:value="searchForm.agency" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="发起单位:">
        <a-input v-model:value="searchForm.initiator" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="安全等级系数:">
        <a-select v-model:value="searchForm.safetyLevelCoeff1" placeholder="请选择" allow-clear style="width: 120px;">
          <a-select-option value="plant">污水厂</a-select-option>
        </a-select>
        <a-select v-model:value="searchForm.safetyLevelCoeff2" placeholder="请选择" allow-clear style="width: 120px; margin-left: 8px;">
          <a-select-option value="pipe">管网</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="安全评估年份:">
        <a-picker v-model:value="searchForm.evalYear" placeholder="请选择年" picker="year" allow-clear />
      </a-form-item>
      <a-form-item label="状态:">
        <a-select v-model:value="searchForm.status" placeholder="请选择" allow-clear>
          <a-select-option value="compiling">编制中</a-select-option>
          <a-select-option value="pending">待认领</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="inline-buttons">
        <a-space>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <a-button type="primary" style="background-color: #52c41a; border-color: #52c41a;" @click="handleExport">导出</a-button>
    </div>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      row-key="id"
      size="small"
      scroll="{ x: 2200 }"
      @change="handleTableChange"
      class="data-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handlePlantDetail(record)">污水厂详情</a-button>
            <a-button type="link" size="small" @click="handleViewReport(record)">查看安评报告附件</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

// 搜索表单
const searchForm = reactive({
  evalCompanyName: '',
  evalTarget: undefined,
  region: undefined,
  agency: '',
  initiator: '',
  safetyLevelCoeff1: undefined,
  safetyLevelCoeff2: undefined,
  evalYear: undefined as dayjs.Dayjs | undefined,
  status: undefined
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' as const, fixed: 'left' as const },
  { title: '发起单位', dataIndex: 'initiator', key: 'initiator', width: 140, align: 'center' as const },
  { title: '评估对象', dataIndex: 'evalTarget', key: 'evalTarget', width: 100, align: 'center' as const },
  { title: '评估企业名称', dataIndex: 'evalCompanyName', key: 'evalCompanyName', width: 160, align: 'center' as const },
  { title: '企业类型', dataIndex: 'companyType', key: 'companyType', width: 120, align: 'center' as const },
  { title: '所属地区', dataIndex: 'region', key: 'region', width: 120, align: 'center' as const },
  { title: '安评机构名称', dataIndex: 'agencyName', key: 'agencyName', width: 160, align: 'center' as const },
  { title: '安评评估年份', dataIndex: 'evalYear', key: 'evalYear', width: 120, align: 'center' as const },
  { title: '编制人员', dataIndex: 'compiler', key: 'compiler', width: 100, align: 'center' as const },
  { title: '校核人员', dataIndex: 'reviewer', key: 'reviewer', width: 100, align: 'center' as const },
  { title: '审核人员', dataIndex: 'auditor', key: 'auditor', width: 100, align: 'center' as const },
  { title: '污水处理厂安全等级系数', dataIndex: 'plantCoeff', key: 'plantCoeff', width: 140, align: 'center' as const },
  { title: '配套管网安全等级系数', dataIndex: 'pipeCoeff', key: 'pipeCoeff', width: 140, align: 'center' as const },
  { title: '综合安全等级系数', dataIndex: 'combinedCoeff', key: 'combinedCoeff', width: 140, align: 'center' as const },
  { title: '状态', dataIndex: 'status', key: 'status', width: 140, align: 'center' as const },
  { title: '操作', key: 'action', width: 80, align: 'center' as const, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1, index: 1, initiator: '建德市水务有限公司', evalTarget: '污水处理厂',
    evalCompanyName: '大慈岩污水处理厂', companyType: '污水运营企业', region: '杭州市-建德市',
    agencyName: '杭州向旭安全技术有限公司', evalYear: '2025', compiler: '施晓旺',
    reviewer: '施晓旺', auditor: '施晓旺', plantCoeff: 'A', pipeCoeff: '/', combinedCoeff: '/',
    status: '杭州向旭安全技术有限公司（审核通过）'
  },
  {
    id: 2, index: 2, initiator: '建德市水务有限公司', evalTarget: '污水处理厂',
    evalCompanyName: '寿昌污水处理厂', companyType: '污水运营企业', region: '杭州市-建德市',
    agencyName: '杭州向旭安全技术有限公司', evalYear: '2025', compiler: '施晓旺',
    reviewer: '施晓旺', auditor: '施晓旺', plantCoeff: 'A', pipeCoeff: '/', combinedCoeff: '/',
    status: '杭州向旭安全技术有限公司（审核通过）'
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 搜索处理
const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待对接')
}

// 重置处理
const handleReset = () => {
  searchForm.evalCompanyName = ''
  searchForm.evalTarget = undefined
  searchForm.region = undefined
  searchForm.agency = ''
  searchForm.initiator = ''
  searchForm.safetyLevelCoeff1 = undefined
  searchForm.safetyLevelCoeff2 = undefined
  searchForm.evalYear = undefined
  searchForm.status = undefined
}

// 导出
const handleExport = () => {
  message.info('导出功能待实现')
}

// 污水厂详情
const handlePlantDetail = (record: any) => {
  message.info(`污水厂详情：${record.evalCompanyName}`)
}

// 查看安评报告附件
const handleViewReport = (record: any) => {
  message.info(`查看安评报告附件：${record.evalCompanyName}`)
}

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.safety-assessment-record-page {
  .search-form {
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;

    :deep(.ant-form-item) {
      margin-bottom: 0;
    }

    :deep(.ant-form-item-label) {
      label {
        font-size: 14px;
        color: #666;
      }
    }

    .inline-buttons {
      margin-left: auto;
    }
  }

  .action-bar {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .data-table {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
      }
    }
  }
}
</style>
