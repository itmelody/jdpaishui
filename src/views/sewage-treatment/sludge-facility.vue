<template>
  <div class="sludge-facility-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="处置设施名称:">
        <a-input v-model:value="searchForm.facilityName" placeholder="请输入" allow-clear />
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
          <a-select-option value="quzhou">衢州市</a-select-option>
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
      <a-space>
        <a-button type="primary" @click="handleBatchExport">批量导出</a-button>
        <a-button type="primary" @click="handleGoToAdd">前往新增、编辑设施数据</a-button>
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
        <template v-if="column.key === 'action'">
          <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
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
  facilityName: '',
  region: undefined
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' as const },
  { title: '污水厂名称', dataIndex: 'plantName', key: 'plantName', width: 160, align: 'center' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 120, align: 'center' as const },
  { title: '处置设施名称', dataIndex: 'facilityName', key: 'facilityName', width: 160, align: 'center' as const },
  { title: '处理能力', dataIndex: 'capacity', key: 'capacity', width: 100, align: 'center' as const },
  { title: '处置方式', dataIndex: 'disposalMethod', key: 'disposalMethod', width: 140, align: 'center' as const },
  { title: '污泥含水量', dataIndex: 'moistureContent', key: 'moistureContent', width: 100, align: 'center' as const },
  { title: '焚烧方式', dataIndex: 'incinerationMethod', key: 'incinerationMethod', width: 140, align: 'center' as const },
  { title: '焚烧处理成本', dataIndex: 'incinerationCost', key: 'incinerationCost', width: 120, align: 'center' as const },
  { title: '污泥去向', dataIndex: 'sludgeDestination', key: 'sludgeDestination', width: 180, align: 'center' as const, ellipsis: true },
  { title: '审核进度', dataIndex: 'auditProgress', key: 'auditProgress', width: 120, align: 'center' as const },
  { title: '操作', key: 'action', width: 80, align: 'center' as const, fixed: 'right' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 1, index: 1, plantName: '寿昌污水处理厂', region: '杭州市建德市',
    facilityName: '高压板框脱水机', capacity: '0', disposalMethod: '焚烧发电',
    moistureContent: '60', incinerationMethod: '干化焚烧', incinerationCost: '0',
    sludgeDestination: '浙江富富春江环保热电股份有限公司', auditProgress: '区县待审核'
  },
  {
    id: 2, index: 2, plantName: '李家污水处理厂', region: '杭州市建德市',
    facilityName: '板框脱水机', capacity: '0', disposalMethod: '焚烧发电',
    moistureContent: '80', incinerationMethod: '干化焚烧', incinerationCost: '0',
    sludgeDestination: '浙江富春江环保热电股份有限公司', auditProgress: '区县待审核'
  },
  {
    id: 3, index: 3, plantName: '安仁污水处理厂', region: '杭州市建德市',
    facilityName: '板框脱水机', capacity: '0', disposalMethod: '焚烧发电',
    moistureContent: '80', incinerationMethod: '干化焚烧', incinerationCost: '0',
    sludgeDestination: '浙江富春江环保热电股份有限公司', auditProgress: '区县待审核'
  },
  {
    id: 4, index: 4, plantName: '乾潭污水处理厂', region: '杭州市建德市',
    facilityName: '板框脱水机', capacity: '0', disposalMethod: '焚烧发电',
    moistureContent: '60', incinerationMethod: '干化焚烧', incinerationCost: '0',
    sludgeDestination: '浙江富春江环保热电股份有限公司', auditProgress: '区县待审核'
  },
  {
    id: 5, index: 5, plantName: '大同污水处理厂', region: '杭州市建德市',
    facilityName: '板框脱水机', capacity: '0', disposalMethod: '焚烧发电',
    moistureContent: '80', incinerationMethod: '干化焚烧', incinerationCost: '0',
    sludgeDestination: '浙江富春江环保热电股份有限公司', auditProgress: '区县待审核'
  },
  {
    id: 6, index: 6, plantName: '大慈岩污水处理厂', region: '杭州市建德市',
    facilityName: '板框脱水机', capacity: '0', disposalMethod: '焚烧发电',
    moistureContent: '80', incinerationMethod: '干化焚烧', incinerationCost: '0',
    sludgeDestination: '浙江富春江环保热电股份有限公司', auditProgress: '区县待审核'
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 6,
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
  searchForm.facilityName = ''
  searchForm.region = undefined
}

// 批量导出
const handleBatchExport = () => {
  message.info('批量导出功能待实现')
}

// 前往新增编辑
const handleGoToAdd = () => {
  message.info('前往新增、编辑设施数据功能待实现')
}

// 查看
const handleView = (record: any) => {
  message.info(`查看：${record.plantName}`)
}

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.sludge-facility-page {
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
