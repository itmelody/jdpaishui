<template>
  <div class="operation-enterprise-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="企业名称:">
        <a-input v-model:value="searchForm.companyName" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="归属地区:">
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
          <a-select-option value="lishui">丽水市</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所辖水厂:">
        <a-input v-model:value="searchForm.plantName" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="账号状态:">
        <a-select v-model:value="searchForm.accountStatus" placeholder="请选择" allow-clear>
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
        <a-button type="primary" @click="handleBatchExport">批量导出</a-button>
        <a-button type="primary" @click="handleAdd">新增</a-button>
        <span class="tip-text">提示：账号开启后企业可通过企业账号登录企业端后台</span>
      </a-space>
    </div>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      row-key="id"
      size="small"
      @change="handleTableChange"
      class="data-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'accountStatus'">
          <a-switch
            v-model:checked="record.accountEnabled"
            checked-children="开"
            un-checked-children="关"
            @change="(val: boolean) => handleAccountToggle(record, val)"
          />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" size="small" @click="handleResetPassword(record)">密码重置</a-button>
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
  companyName: '',
  region: undefined,
  plantName: '',
  accountStatus: undefined
})

// 选中的行
const selectedRowKeys = ref<number[]>([])

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

// 表格列配置
const columns = [
  { title: '', dataIndex: 'checkbox', key: 'checkbox', width: 50 },
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' as const },
  { title: '企业名称', dataIndex: 'companyName', key: 'companyName', width: 220, align: 'center' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 140, align: 'center' as const },
  { title: '统计社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200, align: 'center' as const },
  { title: '法人代表', dataIndex: 'legalPerson', key: 'legalPerson', width: 100, align: 'center' as const },
  { title: '所辖污水厂', dataIndex: 'plantName', key: 'plantName', width: 220, align: 'center' as const, ellipsis: true },
  { title: '账号状态', dataIndex: 'accountStatus', key: 'accountStatus', width: 100, align: 'center' as const },
  { title: '操作', key: 'action', width: 160, align: 'center' as const, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1, index: 1, companyName: '建德市水务有限公司', region: '杭州市建德市',
    creditCode: '913301820821355499', legalPerson: '朱昱靓',
    plantName: '乾潭污水处理厂,寿昌污水处理厂,大慈岩污水处理厂,安仁污水处理厂,莲花污水处理厂,大同污水处理厂,李家污水处理厂,大洋污水处理厂', accountEnabled: true
  },
  {
    id: 2, index: 2, companyName: '杭州建德污水处理有限公司', region: '杭州市建德市',
    creditCode: '91330182MA27WJX54L', legalPerson: '江永伟',
    plantName: '建德污水处理有限公司', accountEnabled: true
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
  searchForm.companyName = ''
  searchForm.region = undefined
  searchForm.plantName = ''
  searchForm.accountStatus = undefined
}

// 批量导出
const handleBatchExport = () => {
  message.info('批量导出功能待实现')
}

// 新增
const handleAdd = () => {
  message.info('新增功能待实现')
}

// 查看
const handleView = (record: any) => {
  message.info(`查看：${record.companyName}`)
}

// 编辑
const handleEdit = (record: any) => {
  message.info(`编辑：${record.companyName}`)
}

// 密码重置
const handleResetPassword = (record: any) => {
  Modal.confirm({
    title: '密码重置',
    content: `确定要重置 "${record.companyName}" 的账号密码吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('密码重置功能待实现')
    }
  })
}

// 账号开关
const handleAccountToggle = (record: any, val: boolean) => {
  message.info(`${record.companyName} 账号${val ? '开启' : '关闭'}`)
}

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.operation-enterprise-page {
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
