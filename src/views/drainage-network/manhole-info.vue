<template>
  <div class="manhole-info-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">井盖基础信息</h2>
    </div>

    <!-- 搜索表单 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="[16, 16]">
          <a-col :span="6">
            <a-form-item label="编号:">
              <a-input v-model:value="searchForm.code" placeholder="请输入编号" />
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
            <a-form-item label="所属道路:">
              <a-input v-model:value="searchForm.road" placeholder="请输入所属道路" />
            </a-form-item>
          </a-col>
          
          <a-col :span="6">
            <a-form-item label="权属单位:">
              <a-input v-model:value="searchForm.owner" placeholder="请输入权属单位" />
            </a-form-item>
          </a-col>
          
          <a-col :span="6">
            <a-form-item label="养护单位:">
              <a-input v-model:value="searchForm.maintenance" placeholder="请输入养护单位" />
            </a-form-item>
          </a-col>
          
          <a-col :span="6">
            <a-form-item label="登记人员:">
              <a-input v-model:value="searchForm.registrar" placeholder="请输入登记人员" />
            </a-form-item>
          </a-col>
          
          <a-col :span="6">
            <a-form-item label="审核状态:">
              <a-select v-model:value="searchForm.status" placeholder="请选择审核状态">
                <a-select-option value="pending">待审核</a-select-option>
                <a-select-option value="approved">审核完成</a-select-option>
                <a-select-option value="rejected">已驳回</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          
          <a-col :span="6">
            <a-form-item label="作业任务:">
              <a-select v-model:value="searchForm.task" placeholder="请选择作业任务">
                <a-select-option value="task1">建德市污水管网检测</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          
          <a-col :span="6">
            <a-form-item label="更新时间:" class="nowrap-item">
              <a-range-picker 
                v-model:value="searchForm.updateTime" 
                :placeholder="['开始日期', '结束日期']"
                style="width: 200px;"
              />
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
            <a-form-item label="批量删除中:">
              <a-radio-group v-model:value="searchForm.batchDelete">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item class="inline-buttons">
              <a-space>
                <a-button type="primary">
                  <search-outlined /> 搜索
                </a-button>
                <a-button>
                  <reload-outlined /> 重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 操作按钮和提示 -->
    <div class="action-bar">
      <a-space>
        <a-button type="primary" danger>
          批量删除
        </a-button>
        <a-alert 
          message="提示：已生成管段或关联检查记录的井盖不允许删除。" 
          type="info" 
          show-icon
          :closable="false"
        />
        <a-button type="link">点击筛选暂未挂接信息的检查井</a-button>
      </a-space>
      
      <div class="right-tip">
        <a-alert 
          message="提示：您有254条删除审批被驳回。" 
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
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag color="green">{{ record.status }}</a-tag>
          </template>
          
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a>查看</a>
              <a>编辑</a>
              <a v-if="record.canDelete" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// 搜索表单
const searchForm = reactive({
  code: '',
  area: undefined,
  road: '',
  owner: '',
  maintenance: '',
  registrar: '',
  status: undefined,
  task: undefined,
  updateTime: [],
  networkType: undefined,
  batchDelete: false
})

// 选中的行
const selectedRowKeys = ref<number[]>([])

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

// 表格列定义
const columns = [
  { title: '', dataIndex: 'checkbox', key: 'checkbox', width: 50 },
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { title: '编号', dataIndex: 'code', key: 'code', width: 180 },
  { title: '自建编码', dataIndex: 'selfCode', key: 'selfCode', width: 100 },
  { title: '所属地区', dataIndex: 'area', key: 'area', width: 120 },
  { title: '管网类型', dataIndex: 'networkType', key: 'networkType', width: 100 },
  { title: '经度', dataIndex: 'longitude', key: 'longitude', width: 120 },
  { title: '纬度', dataIndex: 'latitude', key: 'latitude', width: 120 },
  { title: '所在道路', dataIndex: 'road', key: 'road', width: 100 },
  { title: '权属单位', dataIndex: 'owner', key: 'owner', width: 150 },
  { title: '养护单位', dataIndex: 'maintenance', key: 'maintenance', width: 180 },
  { title: '所属作业任务', dataIndex: 'task', key: 'task', width: 150 },
  { title: '审批状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1,
    index: 1,
    code: '3301820000000097',
    selfCode: 'w88',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.261789494',
    latitude: '29.476378138',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 2,
    index: 2,
    code: '3301820000000096',
    selfCode: 'w87',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.261838064',
    latitude: '29.4763753582',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 3,
    index: 3,
    code: '3301820000000095',
    selfCode: 'w86',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.262199055',
    latitude: '29.4763447031',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 4,
    index: 4,
    code: '3301820000000094',
    selfCode: 'w85',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.262171309',
    latitude: '29.4763775673',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 5,
    index: 5,
    code: '3301820000000093',
    selfCode: 'w84',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.26217348',
    latitude: '29.4764009716',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 6,
    index: 6,
    code: '3301820000000092',
    selfCode: 'w83',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.261805652',
    latitude: '29.4764433345',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 7,
    index: 7,
    code: '3301820000000091',
    selfCode: 'w82',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.261810839',
    latitude: '29.4764502646',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 8,
    index: 8,
    code: '3301820000000090',
    selfCode: 'w81',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.260672874',
    latitude: '29.4765277098',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 9,
    index: 9,
    code: '3301820000000089',
    selfCode: 'w80',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.26060884',
    latitude: '29.4765318286',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  },
  {
    id: 10,
    index: 10,
    code: '3301820000000088',
    selfCode: 'w79',
    area: '杭州市-建德市',
    networkType: '污水管网',
    longitude: '119.260748585',
    latitude: '29.4765285093',
    road: '环城北路',
    owner: '建德市水务有限公司',
    maintenance: '建德市新园市政工程有限公司',
    task: '建德市污水管网检测',
    status: '审核完成',
    canDelete: true
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3190,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})
</script>

<style scoped lang="scss">
.manhole-info-page {
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
    margin-bottom: 16px;

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

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .right-tip {
      margin-left: auto;
    }
  }

  .table-card {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
      }
    }
  }
}
</style>
