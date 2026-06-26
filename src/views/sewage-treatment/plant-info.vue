<template>
  <div class="plant-info-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="污水处理厂:">
        <a-input v-model:value="searchForm.plantName" placeholder="请输入" allow-clear />
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
        </a-select>
      </a-form-item>
      <a-form-item label="是否再生水单元:">
        <a-select v-model:value="searchForm.isReclaimedWater" placeholder="请选择是否再生水单元" allow-clear>
          <a-select-option value="yes">是</a-select-option>
          <a-select-option value="no">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="处理厂类别:">
        <a-select v-model:value="searchForm.plantCategory" placeholder="请选择处理厂类别" allow-clear>
          <a-select-option value="town">建制镇污水处理厂</a-select-option>
          <a-select-option value="county">县(市)城市生活污水处理厂</a-select-option>
          <a-select-option value="city">设区市城市生活污水处理厂</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="运营情况:">
        <a-select v-model:value="searchForm.operationStatus" placeholder="请选择运营情况" allow-clear>
          <a-select-option value="operating">运营</a-select-option>
          <a-select-option value="suspended">停用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="安全评估等级:">
        <a-input v-model:value="searchForm.safetyLevel" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="账号状态:">
        <a-select v-model:value="searchForm.accountStatus" placeholder="请选择账号状态" allow-clear>
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
        <span class="tip-text">提示：账号开启后企业可通过企业账号登录企业端后台</span>
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
  plantName: '',
  region: undefined,
  isReclaimedWater: undefined,
  plantCategory: undefined,
  operationStatus: undefined,
  safetyLevel: '',
  accountStatus: undefined
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' as const },
  { title: '污水厂名称', dataIndex: 'plantName', key: 'plantName', width: 200, align: 'center' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 140, align: 'center' as const },
  { title: '是否再生水单元', dataIndex: 'isReclaimedWater', key: 'isReclaimedWater', width: 120, align: 'center' as const },
  { title: '处理厂类别', dataIndex: 'plantCategory', key: 'plantCategory', width: 160, align: 'center' as const },
  { title: '法人代表', dataIndex: 'legalPerson', key: 'legalPerson', width: 100, align: 'center' as const },
  { title: '处理能力', dataIndex: 'capacity', key: 'capacity', width: 100, align: 'center' as const },
  { title: '服务范围', dataIndex: 'serviceArea', key: 'serviceArea', width: 120, align: 'center' as const, ellipsis: true },
  { title: '排放去向', dataIndex: 'dischargeTo', key: 'dischargeTo', width: 100, align: 'center' as const },
  { title: '运营情况', dataIndex: 'operationStatus', key: 'operationStatus', width: 100, align: 'center' as const },
  { title: '安全评估等级', dataIndex: 'safetyLevel', key: 'safetyLevel', width: 120, align: 'center' as const },
  { title: '审核进度', dataIndex: 'auditProgress', key: 'auditProgress', width: 120, align: 'center' as const },
  { title: '账号状态', dataIndex: 'accountStatus', key: 'accountStatus', width: 100, align: 'center' as const },
  { title: '操作', key: 'action', width: 140, align: 'center' as const, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1, index: 1, plantName: '建德污水处理有限公司', region: '杭州市建德市',
    isReclaimedWater: '是', plantCategory: '县(市)城市生活污水处理厂', legalPerson: '施宏强',
    capacity: '7.9', serviceArea: '建德市新安...', dischargeTo: '直接进入江河湖、库等水环境', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 2, index: 2, plantName: '大洋污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '0.1', serviceArea: '大洋镇', dischargeTo: '兰江', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 3, index: 3, plantName: '莲花污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '0.1', serviceArea: '莲花镇', dischargeTo: '莲花溪', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 4, index: 4, plantName: '寿昌污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '2', serviceArea: '寿昌镇', dischargeTo: '寿昌江', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 5, index: 5, plantName: '李家污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '0.1', serviceArea: '李家镇', dischargeTo: '劳村溪', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 6, index: 6, plantName: '安仁污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '0.2', serviceArea: '安仁乡', dischargeTo: '清渚溪', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 7, index: 7, plantName: '乾潭污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '0.5', serviceArea: '乾潭镇', dischargeTo: '胥溪', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 8, index: 8, plantName: '大同污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '0.2', serviceArea: '大同镇', dischargeTo: '寿昌江', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  },
  {
    id: 9, index: 9, plantName: '大慈岩污水处理厂', region: '杭州市建德市',
    isReclaimedWater: '否', plantCategory: '建制镇污水处理厂', legalPerson: '钱晓琼',
    capacity: '0.1', serviceArea: '大慈岩镇', dischargeTo: '', operationStatus: '运营',
    safetyLevel: '-', auditProgress: '省级待确认', accountEnabled: true
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 370,
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
  searchForm.plantName = ''
  searchForm.region = undefined
  searchForm.isReclaimedWater = undefined
  searchForm.plantCategory = undefined
  searchForm.operationStatus = undefined
  searchForm.safetyLevel = ''
  searchForm.accountStatus = undefined
}

// 批量导出
const handleBatchExport = () => {
  message.info('批量导出功能待实现')
}

// 查看
const handleView = (record: any) => {
  message.info(`查看：${record.plantName}`)
}

// 密码重置
const handleResetPassword = (record: any) => {
  Modal.confirm({
    title: '密码重置',
    content: `确定要重置 "${record.plantName}" 的账号密码吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('密码重置功能待实现')
    }
  })
}

// 账号开关
const handleAccountToggle = (record: any, val: boolean) => {
  message.info(`${record.plantName} 账号${val ? '开启' : '关闭'}`)
}

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.plant-info-page {
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
