<template>
  <div class="unit-personnel-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">检测单位人员信息</h2>
    </div>

    <!-- 搜索表单 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <!-- 第一行 -->
        <a-row :gutter="[16, 12]">
          <a-col :span="5">
            <a-form-item label="检测单位:">
              <a-input v-model:value="searchForm.unitName" placeholder="请输入检测单位" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="所属区域:">
              <a-select v-model:value="searchForm.area" placeholder="请选择">
                <a-select-option value="hangzhou-jd">杭州市 / 建德市</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="信用代码:">
              <a-input v-model:value="searchForm.creditCode" placeholder="请输入统一社会信用代码" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="姓名:">
              <a-input v-model:value="searchForm.name" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="身份证:">
              <a-input v-model:value="searchForm.idCard" placeholder="请输入身份证号码" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行 -->
        <a-row :gutter="[16, 12]">
          <a-col :span="5">
            <a-form-item label="工种:">
              <a-select v-model:value="searchForm.jobType" placeholder="请选择工种">
                <a-select-option value="operator">操作人员</a-select-option>
                <a-select-option value="proofreader">校对人员</a-select-option>
                <a-select-option value="reviewer">审核人员</a-select-option>
                <a-select-option value="manager">管理人员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="学历:">
              <a-select v-model:value="searchForm.education" placeholder="请选择学历">
                <a-select-option value="high">高中</a-select-option>
                <a-select-option value="college">大专</a-select-option>
                <a-select-option value="bachelor">本科</a-select-option>
                <a-select-option value="master">硕士</a-select-option>
                <a-select-option value="doctor">博士</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="人员状态:">
              <a-select v-model:value="searchForm.personnelStatus" placeholder="请选择人员状态">
                <a-select-option value="active">启用</a-select-option>
                <a-select-option value="disabled">停用</a-select-option>
              </a-select>
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
      <a-button type="primary" class="btn-add" @click="handleAdd">
        <PlusOutlined /> 新增人员
      </a-button>
    </div>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        row-key="id"
        size="small"
        :scroll="{ x: 1500 }"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'stripe-row' : '')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'personnelStatus'">
            <a-tag :color="record.personnelStatus === '启用' ? 'green' : 'red'">
              {{ record.personnelStatus }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'jobType'">
            <span>{{ record.jobType }}</span>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space :size="0" :split="divider">
              <a class="action-link" @click="handleView(record)">查看</a>
              <a class="action-link" @click="handleEdit(record)">编辑</a>
              <a class="action-link" @click="handleResetPassword(record)">重置密码</a>
              <a
                :class="['action-link', record.personnelStatus === '启用' ? 'warning' : '']"
                @click="handleToggleStatus(record)"
              >
                {{ record.personnelStatus === '启用' ? '停用' : '启用' }}
              </a>
              <a class="action-link danger" @click="handleDelete(record)">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { message, Divider } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

// 分隔线组件
const divider = h(Divider, { type: 'vertical' })

// 搜索表单
const searchForm = reactive({
  unitName: '',
  area: 'hangzhou-jd' as string | undefined,
  creditCode: '',
  name: '',
  idCard: '',
  jobType: undefined as string | undefined,
  education: undefined as string | undefined,
  personnelStatus: undefined as string | undefined
})

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, fixed: 'left' as const },
  { title: '所属检测单位', dataIndex: 'unitName', key: 'unitName', width: 220 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 190 },
  { title: '所属区域', dataIndex: 'area', key: 'area', width: 120 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
  { title: '身份证号码', dataIndex: 'idCard', key: 'idCard', width: 160 },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 120 },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 60 },
  { title: '学历', dataIndex: 'education', key: 'education', width: 80 },
  { title: '工种', dataIndex: 'jobType', key: 'jobType', width: 150 },
  { title: '人员状态', dataIndex: 'personnelStatus', key: 'personnelStatus', width: 90 },
  { title: '操作', key: 'action', width: 260, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1,
    index: 1,
    unitName: '建德市新园市政工程有限公司',
    creditCode: '91330182322904571F',
    area: '杭州市·建德市',
    name: '朱奇',
    idCard: '330182********0515',
    phone: '15958102652',
    gender: '男',
    education: '',
    jobType: '操作人员',
    personnelStatus: '启用'
  },
  {
    id: 2,
    index: 2,
    unitName: '建德市新园市政工程有限公司',
    creditCode: '91330182322904571F',
    area: '杭州市·建德市',
    name: '叶必文',
    idCard: '341702********4810',
    phone: '13155660768',
    gender: '男',
    education: '',
    jobType: '校对人员、审核人员',
    personnelStatus: '启用'
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

// 操作方法
const handleSearch = () => {
  message.info('执行搜索...')
}

const handleReset = () => {
  searchForm.unitName = ''
  searchForm.area = 'hangzhou-jd'
  searchForm.creditCode = ''
  searchForm.name = ''
  searchForm.idCard = ''
  searchForm.jobType = undefined
  searchForm.education = undefined
  searchForm.personnelStatus = undefined
}

const handleAdd = () => {
  message.info('打开新增人员表单...')
}

const handleView = (record: any) => {
  message.info(`查看人员: ${record.name}`)
}

const handleEdit = (record: any) => {
  message.info(`编辑人员: ${record.name}`)
}

const handleResetPassword = (record: any) => {
  message.info(`重置密码: ${record.name}`)
}

const handleToggleStatus = (record: any) => {
  const action = record.personnelStatus === '启用' ? '停用' : '启用'
  message.info(`${action}人员: ${record.name}`)
}

const handleDelete = (record: any) => {
  message.warning(`删除人员: ${record.name}`)
}
</script>

<style scoped lang="scss">
.unit-personnel-page {
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
        min-width: 80px;
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

      .search-buttons {
        width: 100%;
        text-align: right;
        margin-top: 4px;
      }
    }
  }

  .action-bar {
    margin-bottom: 12px;

    .btn-add {
      border-radius: 4px;
    }
  }

  .table-card {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #e6e6f0;
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

      &.warning {
        color: #fa8c16;

        &:hover {
          color: #ffa940;
        }
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
