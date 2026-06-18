<template>
  <div class="water-quality-monitor">
    <a-card :bordered="false" class="monitor-card">
      <!-- 页面标题 -->
      <div class="page-header">
        <span class="page-title">排水户排口监测</span>
      </div>

      <!-- 标签页 -->
      <a-tabs v-model:activeKey="activeTab" class="monitor-tabs">
        <a-tab-pane key="hourly" tab="出水小时数据（生态）">
          <!-- 筛选条件 -->
          <a-form :model="searchForm" layout="inline" class="search-form">
            <a-row :gutter="[16, 16]">
              <a-col :span="8">
                <a-form-item label="归属地区:">
                  <a-select v-model:value="searchForm.region" placeholder="请选择" allow-clear class="region-select">
                    <a-select-option value="jiande">浙江省 / 杭州市 / 建德市</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="企业名称:">
                  <a-input v-model:value="searchForm.companyName" placeholder="请输入" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="数据采集时间:">
                  <a-range-picker
                    v-model:value="searchForm.dateRange"
                    style="width: 100%"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item class="inline-buttons">
                  <a-space>
                    <a-button type="primary" @click="handleSearch">
                      <template #icon><SearchOutlined /></template>
                      搜索
                    </a-button>
                    <a-button @click="handleReset">
                      <template #icon><ReloadOutlined /></template>
                      重置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <!-- 数据表格 -->
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            row-key="id"
            :scroll="{ x: 1200 }"
            @change="handleTableChange"
            class="data-table"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'overLimitStatus'">
                <a-tag :color="record.overLimitStatus === '正常' ? 'success' : 'error'">
                  {{ record.overLimitStatus }}
                </a-tag>
              </template>
            </template>
          </a-table>


        </a-tab-pane>

        <a-tab-pane key="docking" tab="数据对接情况">
          <!-- 筛选条件 -->
          <a-form :model="dockingForm" layout="inline" class="search-form">
            <a-row :gutter="[16, 16]">
              <a-col :span="8">
                <a-form-item label="归属地区:">
                  <a-select v-model:value="dockingForm.region" placeholder="请选择" allow-clear class="region-select">
                    <a-select-option value="jiande">浙江省 / 杭州市 / 建德市</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item class="inline-buttons" style="text-align: right;">
                  <a-space>
                    <a-button style="background: #FA8C16; color: #fff; border-color: #FA8C16;" @click="handleDockingExport">
                      <template #icon><ExportOutlined /></template>
                      导出
                    </a-button>
                    <a-button type="primary" @click="handleDockingSearch">
                      <template #icon><SearchOutlined /></template>
                      搜索
                    </a-button>
                    <a-button @click="handleDockingReset">
                      <template #icon><ReloadOutlined /></template>
                      重置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <!-- 离线提示 -->
          <a-alert
            message="离线提示：实时数据连续9小时未上报数据；日均数据连续48小时未上报数据"
            type="error"
            show-icon
            class="offline-alert"
          />

          <!-- 数据对接表格 -->
          <a-table
            :columns="dockingColumns"
            :data-source="dockingDataSource"
            :pagination="dockingPagination"
            row-key="id"
            @change="handleDockingTableChange"
            class="data-table"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="record.status === '在线' ? 'success' : 'error'">
                  {{ record.status }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 当前激活的标签页
const activeTab = ref<string>('hourly')

// 搜索表单
const searchForm = reactive({
  region: 'jiande' as string | undefined,
  companyName: '',
  dateRange: undefined as any
})

// 表格列配置
const columns = [
  { title: '企业名称', dataIndex: 'companyName', key: 'companyName', width: 220 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 120 },
  { title: '数据采集时间（监测时间）', dataIndex: 'collectTime', key: 'collectTime', width: 200 },
  { title: '排口名称', dataIndex: 'outletName', key: 'outletName', width: 130 },
  { title: '因子名称', dataIndex: 'factorName', key: 'factorName', width: 120 },
  { title: '监测值', dataIndex: 'monitorValue', key: 'monitorValue', width: 100 },
  { title: '污染区排放量', dataIndex: 'pollutionEmission', key: 'pollutionEmission', width: 120 },
  { title: '超标状态', dataIndex: 'overLimitStatus', key: 'overLimitStatus', width: 100, align: 'center' }
]

// 模拟数据
const dataSource = ref([
  { id: 1, companyName: '浙江晶科能源有限公司', region: '建德市', collectTime: '2026-06-08 00:00:00', outletName: '污水入网口', factorName: '氨氮', monitorValue: '', pollutionEmission: '', overLimitStatus: '正常' },
  { id: 2, companyName: '浙江晶科能源有限公司', region: '建德市', collectTime: '2026-06-08 00:00:00', outletName: '污水入网口', factorName: '化学需氧量', monitorValue: '', pollutionEmission: '', overLimitStatus: '正常' },
  { id: 3, companyName: '浙江晶科能源有限公司', region: '建德市', collectTime: '2026-06-08 00:00:00', outletName: '污水入网口', factorName: '总氮', monitorValue: '', pollutionEmission: '', overLimitStatus: '正常' }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 事件处理
const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待实现')
}

const handleReset = () => {
  searchForm.region = undefined
  searchForm.companyName = ''
  searchForm.dateRange = undefined
  message.info('已重置搜索条件')
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

// ===== 数据对接情况 =====
const dockingForm = reactive({
  region: 'jiande' as string | undefined
})

const dockingColumns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 70 },
  { title: '重点排水户', dataIndex: 'companyName', key: 'companyName', width: 280 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 120 },
  { title: '最新上报时间', dataIndex: 'latestReportTime', key: 'latestReportTime', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' }
]

const dockingDataSource = ref([
  { id: 1, index: 1, companyName: '杭州中策清泉实业有限公司', region: '浙江省', latestReportTime: '', status: '在线' },
  { id: 2, index: 2, companyName: '浙江海正药业有限公司', region: '浙江省', latestReportTime: '', status: '在线' },
  { id: 3, index: 3, companyName: '浙江江铜富冶和鼎铜业有限公司', region: '浙江省', latestReportTime: '', status: '在线' },
  { id: 4, index: 4, companyName: '杭州鑫富科技有限公司', region: '浙江省', latestReportTime: '', status: '在线' },
  { id: 5, index: 5, companyName: '浙江帝龙新材料有限公司', region: '浙江省', latestReportTime: '', status: '在线' },
  { id: 6, index: 6, companyName: '浙江振有电子股份有限公司', region: '浙江省', latestReportTime: '', status: '在线' },
  { id: 7, index: 7, companyName: '杭州宝玛机电有限公司', region: '浙江省', latestReportTime: '', status: '在线' },
  { id: 8, index: 8, companyName: '杭州金顺达织造有限公司', region: '浙江省', latestReportTime: '', status: '在线' }
])

const dockingPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 13,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const handleDockingSearch = () => {
  console.log('Docking search:', dockingForm)
  message.success('搜索功能待实现')
}

const handleDockingReset = () => {
  dockingForm.region = undefined
  message.info('已重置搜索条件')
}

const handleDockingExport = () => {
  message.info('导出功能待实现')
}

const handleDockingTableChange = (pag: any) => {
  dockingPagination.current = pag.current
  dockingPagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.water-quality-monitor {
  .monitor-card {
    min-height: calc(100vh - 180px);

    .page-header {
      margin-bottom: 12px;

      .page-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }

    .monitor-tabs {
      :deep(.ant-tabs-tab) {
        padding: 8px 20px;
      }

      :deep(.ant-tabs-tab-active) {
        background: #1890ff;
        border-radius: 4px 4px 0 0;

        .ant-tabs-tab-btn {
          color: #fff;
        }
      }
    }

    .search-form {
      margin-bottom: 16px;

      :deep(.ant-row) {
        align-items: flex-start;
      }

      :deep(.ant-form-item) {
        margin-bottom: 0;
      }

      :deep(.ant-form-item-label) {
        font-size: 14px;
        white-space: nowrap;
        flex: 0 0 auto !important;
        width: auto !important;
        max-width: none !important;
        text-align: left;
        padding-right: 8px;
      }

      :deep(.ant-form-item-control) {
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0;

        .ant-select,
        .ant-input,
        .ant-picker {
          width: 100% !important;
        }

        .ant-form-item-control-input {
          width: 100%;

          .ant-form-item-control-input-content {
            width: 100%;
          }
        }
      }

      :deep(.ant-form-item-row) {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
      }

      .inline-buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      // 归属地区下拉框宽度设置
      :deep(.region-select) {
        width: 300px !important;
        min-width: 300px !important;
      }

      :deep(.region-select.ant-select) {
        width: 300px !important;
      }

      :deep(.region-select .ant-select-selector) {
        padding-right: 32px !important;
      }

      :deep(.region-select .ant-select-arrow) {
        inset-inline-end: 11px !important;
      }
    }

    .data-table {
      :deep(.ant-table) {
        font-size: 13px;
      }

      :deep(.ant-table-thead > tr > th) {
        background: #E3F2FD;
        font-weight: 600;
        font-size: 13px;
        padding: 10px 8px;
      }

      :deep(.ant-table-tbody > tr > td) {
        padding: 8px;
      }
    }

    .offline-alert {
      margin-bottom: 16px;
    }
  }
}
</style>
