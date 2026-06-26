<template>
  <div class="pump-station-page">
    <!-- 搜索表单 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" class="search-form">
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">泵站名称:</label>
            <a-input v-model:value="searchForm.stationName" placeholder="请输入泵站名称" style="width: 200px" />
          </div>
          <div class="form-item">
            <label class="form-label">归属地区:</label>
            <a-select v-model:value="searchForm.region" placeholder="请选择" style="width: 200px">
              <a-select-option value="jiande">杭州市 / 建德市</a-select-option>
            </a-select>
          </div>
          <div class="form-item">
            <label class="form-label">所属污水厂:</label>
            <a-input v-model:value="searchForm.sewagePlant" placeholder="请输入所属污水厂" style="width: 200px" />
          </div>
          <div class="form-item form-buttons">
            <a-button type="primary" @click="handleSearch">
              <SearchOutlined /> 搜索
            </a-button>
            <a-button @click="handleReset">
              <ReloadOutlined /> 重置
            </a-button>
          </div>
        </div>
      </a-form>
    </a-card>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <a-space>
        <a-button @click="handleBatchExport">批量导出</a-button>
        <a-button type="primary" @click="handleGoAdd">前往新增、编辑设施数据</a-button>
      </a-space>
    </div>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 搜索表单
const searchForm = reactive({
  stationName: '',
  region: undefined as string | undefined,
  sewagePlant: ''
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' as const },
  { title: '泵站名称', dataIndex: 'stationName', key: 'stationName', width: 150 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '所属污水厂', dataIndex: 'sewagePlant', key: 'sewagePlant', width: 180 },
  { title: '泵机数量', dataIndex: 'pumpCount', key: 'pumpCount', width: 100, align: 'center' as const },
  { title: '建成年份', dataIndex: 'buildYear', key: 'buildYear', width: 120, align: 'center' as const },
  { title: '审核进度', dataIndex: 'auditStatus', key: 'auditStatus', width: 120, align: 'center' as const },
  { title: '操作', key: 'action', width: 100, align: 'center' as const }
]

// 模拟数据
const dataSource = ref([
  { id: 1, index: 1, stationName: '桥北泵站', region: '杭州市建德市', sewagePlant: '建德污水处理有限公司', pumpCount: 4, buildYear: '2021-11', auditStatus: '区县未上报' },
  { id: 2, index: 2, stationName: '溪头泵站', region: '杭州市建德市', sewagePlant: '建德污水处理有限公司', pumpCount: 4, buildYear: '2022-05', auditStatus: '区县未上报' },
  { id: 3, index: 3, stationName: '桥南泵站', region: '杭州市建德市', sewagePlant: '建德污水处理有限公司', pumpCount: 3, buildYear: '2009-03', auditStatus: '区县未上报' },
  { id: 4, index: 4, stationName: '洋安泵站', region: '杭州市建德市', sewagePlant: '建德污水处理有限公司', pumpCount: 3, buildYear: '2013-06', auditStatus: '区县未上报' },
  { id: 5, index: 5, stationName: '洋溪泵站', region: '杭州市建德市', sewagePlant: '大洋污水处理厂', pumpCount: 3, buildYear: '2020-10', auditStatus: '区县未上报' },
  { id: 6, index: 6, stationName: '半岛泵站', region: '杭州市建德市', sewagePlant: '大洋污水处理厂', pumpCount: 3, buildYear: '2014-04', auditStatus: '区县待审核' },
  { id: 7, index: 7, stationName: '电厂泵站', region: '杭州市建德市', sewagePlant: '大洋污水处理厂', pumpCount: 4, buildYear: '2014-06', auditStatus: '区县未上报' },
  { id: 8, index: 8, stationName: '江村埠泵站', region: '杭州市建德市', sewagePlant: '李家污水处理厂', pumpCount: 3, buildYear: '2009-03', auditStatus: '区县未上报' },
  { id: 9, index: 9, stationName: '假日酒店泵站', region: '杭州市建德市', sewagePlant: '李家污水处理厂', pumpCount: 3, buildYear: '2020-05', auditStatus: '区县未上报' },
  { id: 10, index: 10, stationName: '兽王泵站', region: '杭州市建德市', sewagePlant: '李家污水处理厂', pumpCount: 2, buildYear: '2018-06', auditStatus: '区县未上报' }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 1938,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 事件处理
const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待实现')
}

const handleReset = () => {
  searchForm.stationName = ''
  searchForm.region = undefined
  searchForm.sewagePlant = ''
  message.info('已重置搜索条件')
}

const handleBatchExport = () => {
  message.info('批量导出功能待实现')
}

const handleGoAdd = () => {
  message.info('前往新增、编辑设施数据功能待实现')
}

const handleView = (record: any) => {
  message.info(`查看泵站：${record.stationName}`)
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.pump-station-page {
  .search-card {
    margin-bottom: 12px;

    .search-form {
      margin-bottom: 16px;

      .form-row {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: flex-start;
      }

      .form-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .form-label {
        font-size: 14px;
        color: #666;
        white-space: nowrap;
        line-height: 32px;
      }

      .form-buttons {
        margin-left: auto;
        display: flex;
        gap: 8px;
      }
    }
  }

  .action-buttons {
    margin-bottom: 12px;
  }

  .table-card {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
        font-size: 13px;
        color: #333;
      }

      .ant-table-tbody > tr > td {
        padding: 8px;
      }
    }
  }
}
</style>
