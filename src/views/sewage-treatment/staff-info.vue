<template>
  <div class="staff-info-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="企业名称:">
        <a-input v-model:value="searchForm.companyName" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="姓名:">
        <a-input v-model:value="searchForm.name" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="性别:">
        <a-select v-model:value="searchForm.gender" placeholder="请选择" allow-clear>
          <a-select-option value="male">男</a-select-option>
          <a-select-option value="female">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="学历:">
        <a-select v-model:value="searchForm.education" placeholder="请选择" allow-clear>
          <a-select-option value="high_school_below">高中以下</a-select-option>
          <a-select-option value="high_school">高中</a-select-option>
          <a-select-option value="college">大专</a-select-option>
          <a-select-option value="bachelor">本科</a-select-option>
          <a-select-option value="master">硕士</a-select-option>
          <a-select-option value="doctor">博士</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="人员状态:">
        <a-select v-model:value="searchForm.staffStatus" placeholder="请选择" allow-clear>
          <a-select-option value="active">在职</a-select-option>
          <a-select-option value="resigned">离职</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="检查授权:">
        <a-select v-model:value="searchForm.inspectionAuth" placeholder="请选择" allow-clear>
          <a-select-option value="enabled">已开启</a-select-option>
          <a-select-option value="disabled">已关闭</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="inline-buttons">
        <a-space>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <!-- 操作按钮和提示 -->
    <div class="action-bar">
      <a-space>
        <a-button type="primary" @click="handleAdd">新增从业人员</a-button>
        <span class="tip-text">提示：授权检查工具开启后可登录浙里办检查工具开展企业自查工作</span>
      </a-space>
    </div>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      row-key="id"
      size="small"
      @change="handleTableChange"
      class="data-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'inspectionAuth'">
          <a-switch
            v-model:checked="record.authEnabled"
            checked-children="开"
            un-checked-children="关"
            @change="(val: boolean) => handleAuthToggle(record, val)"
          />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'

// 搜索表单
const searchForm = reactive({
  companyName: '',
  name: '',
  gender: undefined,
  education: undefined,
  staffStatus: undefined,
  inspectionAuth: undefined
})

// 表格列配置
const columns = [
  { title: '企业名称', dataIndex: 'companyName', key: 'companyName', width: 200, align: 'center' as const },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100, align: 'center' as const },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 80, align: 'center' as const },
  { title: '联系方式', dataIndex: 'contact', key: 'contact', width: 140, align: 'center' as const },
  { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 180, align: 'center' as const },
  { title: '学历', dataIndex: 'education', key: 'education', width: 100, align: 'center' as const },
  { title: '从业人员状态', dataIndex: 'staffStatus', key: 'staffStatus', width: 120, align: 'center' as const },
  { title: '授权检查工具', dataIndex: 'inspectionAuth', key: 'inspectionAuth', width: 120, align: 'center' as const },
  { title: '操作', key: 'action', width: 120, align: 'center' as const, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1, companyName: '建德污水处理有限公司', name: '熊晓光', gender: '男',
    contact: '158****3819', idCard: '330302********2017', education: '高中以下',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 2, companyName: '建德污水处理有限公司', name: '翁精一', gender: '男',
    contact: '136****5766', idCard: '330302********1210', education: '本科',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 3, companyName: '建德污水处理有限公司', name: '顾礼杰', gender: '男',
    contact: '187****2785', idCard: '330382********8010', education: '大专',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 4, companyName: '建德污水处理有限公司', name: '郑智毅', gender: '男',
    contact: '150****0837', idCard: '330302********1238', education: '高中',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 5, companyName: '建德污水处理有限公司', name: '吴龙翔', gender: '男',
    contact: '158****8455', idCard: '330324********2838', education: '本科',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 6, companyName: '建德污水处理有限公司', name: '张淼', gender: '男',
    contact: '180****3500', idCard: '330381********2271', education: '本科',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 7, companyName: '建德污水处理有限公司', name: '姜慎行', gender: '男',
    contact: '135****3684', idCard: '330302********1230', education: '本科',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 8, companyName: '建德污水处理有限公司', name: '缪欧洋', gender: '男',
    contact: '139****0110', idCard: '330324********0394', education: '本科',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 9, companyName: '建德污水处理有限公司', name: '谢钻镑', gender: '男',
    contact: '135****8567', idCard: '330324********0053', education: '高中',
    staffStatus: '在职', authEnabled: false
  },
  {
    id: 10, companyName: '建德污水处理有限公司', name: '曾邦云', gender: '男',
    contact: '151****7087', idCard: '330325********531X', education: '高中以下',
    staffStatus: '在职', authEnabled: false
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 149,
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
  searchForm.name = ''
  searchForm.gender = undefined
  searchForm.education = undefined
  searchForm.staffStatus = undefined
  searchForm.inspectionAuth = undefined
}

// 新增
const handleAdd = () => {
  message.info('新增从业人员功能待实现')
}

// 编辑
const handleEdit = (record: any) => {
  message.info(`编辑：${record.name}`)
}

// 查看
const handleView = (record: any) => {
  message.info(`查看：${record.name}`)
}

// 授权开关
const handleAuthToggle = (record: any, val: boolean) => {
  message.info(`${record.name} 授权检查工具${val ? '开启' : '关闭'}`)
}

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.staff-info-page {
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

    .tip-text {
      color: #ff4d4f;
      font-size: 14px;
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
