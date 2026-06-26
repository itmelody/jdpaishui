<template>
  <div class="safety-assessment-danger-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="企业名称:">
        <a-input v-model:value="searchForm.companyName" placeholder="请输入" allow-clear />
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
      <a-form-item label="企业类型:">
        <a-select v-model:value="searchForm.companyType" placeholder="请选择" allow-clear>
          <a-select-option value="plant">污水厂</a-select-option>
          <a-select-option value="operator">污水运营企业</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="安评机构:">
        <a-input v-model:value="searchForm.agency" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="安全评估年份:">
        <a-picker v-model:value="searchForm.evalYear" placeholder="请选择年" picker="year" allow-clear />
      </a-form-item>
      <a-form-item label="隐患等级:">
        <a-select v-model:value="searchForm.dangerLevel" placeholder="请选择" allow-clear>
          <a-select-option value="major">重大隐患</a-select-option>
          <a-select-option value="larger">较大隐患</a-select-option>
          <a-select-option value="general">一般隐患</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否逾期未整改:">
        <a-select v-model:value="searchForm.overdue" placeholder="请选择" allow-clear>
          <a-select-option value="yes">是</a-select-option>
          <a-select-option value="no">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态:">
        <a-select v-model:value="searchForm.status" placeholder="请选择" allow-clear>
          <a-select-option value="pending">待整改</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="searchForm.myRectification">待我整改</a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="searchForm.overdueUnconfirmed">超期未确认时限</a-checkbox>
      </a-form-item>
      <a-form-item class="inline-buttons">
        <a-space>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <!-- 提示栏 -->
    <div class="alert-bar">
      <span class="alert-text">0条隐患需确认整改时限</span>
      <a-button type="primary" style="background-color: #fa8c16; border-color: #fa8c16;" @click="handleConfirm">去确认</a-button>
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
        <template v-if="column.key === 'relatedObject'">
          <span v-if="record.hasRelatedObject" style="color: #1890ff; cursor: pointer;">关联对象</span>
          <span v-else>-</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
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
  companyName: '',
  region: undefined,
  companyType: undefined,
  agency: '',
  evalYear: undefined as dayjs.Dayjs | undefined,
  dangerLevel: undefined,
  overdue: undefined,
  status: undefined,
  myRectification: false,
  overdueUnconfirmed: false
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' as const, fixed: 'left' as const },
  { title: '企业名称', dataIndex: 'companyName', key: 'companyName', width: 160, align: 'center' as const },
  { title: '企业类型', dataIndex: 'companyType', key: 'companyType', width: 100, align: 'center' as const },
  { title: '所属地区', dataIndex: 'region', key: 'region', width: 130, align: 'center' as const },
  { title: '安评机构名称', dataIndex: 'agencyName', key: 'agencyName', width: 160, align: 'center' as const },
  { title: '安评评估年份', dataIndex: 'evalYear', key: 'evalYear', width: 120, align: 'center' as const },
  { title: '评估单元', dataIndex: 'evalUnit', key: 'evalUnit', width: 120, align: 'center' as const },
  { title: '评估主体', dataIndex: 'evalSubject', key: 'evalSubject', width: 140, align: 'center' as const },
  { title: '关联隐患对象', dataIndex: 'relatedObject', key: 'relatedObject', width: 120, align: 'center' as const },
  { title: '存在的隐患问题', dataIndex: 'dangerProblem', key: 'dangerProblem', width: 160, align: 'center' as const, ellipsis: true },
  { title: '隐患等级', dataIndex: 'dangerLevel', key: 'dangerLevel', width: 100, align: 'center' as const },
  { title: '整改时限', dataIndex: 'rectificationDeadline', key: 'rectificationDeadline', width: 120, align: 'center' as const },
  { title: '是否逾期未整改', dataIndex: 'isOverdue', key: 'isOverdue', width: 130, align: 'center' as const },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' as const },
  { title: '操作', key: 'action', width: 80, align: 'center' as const, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1, index: 1, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '杭州市城乡建设设计院股份有限公司',
    evalYear: '2025', evalUnit: '污水处理厂安全', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '厂区未建有安防视...', dangerLevel: '较大隐患',
    rectificationDeadline: '2026-06-25', isOverdue: '否', status: '待整改'
  },
  {
    id: 2, index: 2, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '杭州市城乡建设设计院股份有限公司',
    evalYear: '2025', evalUnit: '污水处理厂安全', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '未采用口令登录进...', dangerLevel: '较大隐患',
    rectificationDeadline: '2026-06-25', isOverdue: '否', status: '待整改'
  },
  {
    id: 3, index: 3, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '杭州市城乡建设设计院股份有限公司',
    evalYear: '2025', evalUnit: '污水处理厂安全', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '对于有毒、有害物...', dangerLevel: '重大隐患',
    rectificationDeadline: '2026-06-25', isOverdue: '否', status: '待整改'
  },
  {
    id: 4, index: 4, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '杭州市城乡建设设计院股份有限公司',
    evalYear: '2025', evalUnit: '污水处理厂安全', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '防泄漏、防护装置...', dangerLevel: '较大隐患',
    rectificationDeadline: '2026-07-22', isOverdue: '否', status: '待整改'
  },
  {
    id: 5, index: 5, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '杭州市城乡建设设计院股份有限公司',
    evalYear: '2025', evalUnit: '污水处理厂安全', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '次氯酸钠、聚氯化...', dangerLevel: '较大隐患',
    rectificationDeadline: '2026-07-22', isOverdue: '否', status: '待整改'
  },
  {
    id: 6, index: 6, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '杭州市城乡建设设计院股份有限公司',
    evalYear: '2025', evalUnit: '污水处理厂安全', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '化学需氧量、氨氮...', dangerLevel: '重大隐患',
    rectificationDeadline: '2026-06-25', isOverdue: '否', status: '待整改'
  },
  {
    id: 7, index: 7, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '杭州市城乡建设设计院股份有限公司',
    evalYear: '2025', evalUnit: '污水处理厂安全', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '进厂处理水量月度...', dangerLevel: '一般隐患',
    rectificationDeadline: '2026-06-25', isOverdue: '否', status: '待整改'
  },
  {
    id: 8, index: 8, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '浙江省城乡规划设计研究院',
    evalYear: '2025', evalUnit: '排水侧安全评估', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: true, dangerProblem: '近一年内重点排水...', dangerLevel: '一般隐患',
    rectificationDeadline: '2026-06-21', isOverdue: '是', status: '待整改'
  },
  {
    id: 9, index: 9, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '浙江省城乡规划设计研究院',
    evalYear: '2025', evalUnit: '排水侧安全评估', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: true, dangerProblem: '近一年内重点排水...', dangerLevel: '较大隐患',
    rectificationDeadline: '2026-06-21', isOverdue: '是', status: '待整改'
  },
  {
    id: 10, index: 10, companyName: '建德污水处理有限公司', companyType: '污水厂',
    region: '杭州市-建德市', agencyName: '浙江工业大学工程设计集团有限公司',
    evalYear: '2025', evalUnit: '污水泵站评分表', evalSubject: '建德污水处理有限公司',
    hasRelatedObject: false, dangerProblem: '污水泵站无安保人...', dangerLevel: '较大隐患',
    rectificationDeadline: '2026-07-23', isOverdue: '否', status: '待整改'
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 1291,
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
  searchForm.companyName = ''
  searchForm.region = undefined
  searchForm.companyType = undefined
  searchForm.agency = ''
  searchForm.evalYear = undefined
  searchForm.dangerLevel = undefined
  searchForm.overdue = undefined
  searchForm.status = undefined
  searchForm.myRectification = false
  searchForm.overdueUnconfirmed = false
}

// 去确认
const handleConfirm = () => {
  message.info('去确认功能待实现')
}

// 详情
const handleDetail = (record: any) => {
  message.info(`详情：${record.companyName}`)
}

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.safety-assessment-danger-page {
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

  .alert-bar {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background-color: #fff7e6;
    border: 1px solid #ffd591;
    border-radius: 4px;
    margin-bottom: 16px;

    .alert-text {
      color: #fa8c16;
      font-size: 14px;
      margin-right: 16px;
    }
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
