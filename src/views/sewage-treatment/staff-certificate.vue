<template>
  <div class="staff-certificate-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="姓名:">
        <a-input v-model:value="searchForm.name" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="证书名称:">
        <a-input v-model:value="searchForm.certificateName" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="证书状态:">
        <a-select v-model:value="searchForm.certificateStatus" placeholder="请选择" allow-clear>
          <a-select-option value="valid">有效</a-select-option>
          <a-select-option value="expired">过期</a-select-option>
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
      <a-button type="primary" @click="handleAdd">新增证书</a-button>
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
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
            <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  certificateName: '',
  certificateStatus: undefined
})

// 表格列配置
const columns = [
  { title: '企业名称', dataIndex: 'companyName', key: 'companyName', width: 160, align: 'center' as const },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100, align: 'center' as const },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 80, align: 'center' as const },
  { title: '联系方式', dataIndex: 'contact', key: 'contact', width: 140, align: 'center' as const },
  { title: '身份证', dataIndex: 'idCard', key: 'idCard', width: 180, align: 'center' as const },
  { title: '证书名称', dataIndex: 'certificateName', key: 'certificateName', width: 120, align: 'center' as const },
  { title: '有效期', dataIndex: 'validPeriod', key: 'validPeriod', width: 200, align: 'center' as const },
  { title: '证书状态', dataIndex: 'certificateStatus', key: 'certificateStatus', width: 100, align: 'center' as const },
  { title: '操作', key: 'action', width: 140, align: 'center' as const, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1, companyName: '建德污水处理有限公司', name: '熊晓光', gender: '男',
    contact: '176****0979', idCard: '412829********1791', certificateName: '污水检测证书',
    validPeriod: '2026-03-25 至 2026-03-26', certificateStatus: '过期'
  },
  {
    id: 2, companyName: '建德污水处理有限公司', name: '张淼', gender: '女',
    contact: '184****0230', idCard: '330124********0627', certificateName: '污水检测证书',
    validPeriod: '2026-03-25 至 2026-03-31', certificateStatus: '过期'
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
  searchForm.name = ''
  searchForm.certificateName = ''
  searchForm.certificateStatus = undefined
}

// 新增
const handleAdd = () => {
  message.info('新增证书功能待实现')
}

// 编辑
const handleEdit = (record: any) => {
  message.info(`编辑：${record.name} 的证书`)
}

// 查看
const handleView = (record: any) => {
  message.info(`查看：${record.name} 的证书`)
}

// 删除
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 "${record.name}" 的证书 "${record.certificateName}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('删除功能待实现')
    }
  })
}

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.staff-certificate-page {
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
