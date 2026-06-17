<template>
  <div class="outlet-quality">
    <!-- 页面标题 -->
    <div class="page-header">
      <span class="page-title">排水户排口监测</span>
    </div>

    <!-- 标签页 -->
    <a-tabs v-model:activeKey="activeTab" class="outlet-tabs">
      <a-tab-pane key="hourly" tab="出水小时数据（生态）">
        <!-- 筛选条件 -->
        <a-form :model="searchForm" layout="inline" class="search-form">
          <a-row :gutter="[16, 12]" align="middle">
            <a-col :span="5">
              <a-form-item label="归属地区:">
                <a-select v-model:value="searchForm.region" placeholder="请选择" allow-clear style="width:100%">
                  <a-select-option value="jiande">建德市</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="企业名称:">
                <a-input v-model:value="searchForm.companyName" placeholder="请输入名称" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item label="数据采集时间:">
                <a-range-picker
                  v-model:value="searchForm.dateRange"
                  style="width: 100%"
                  :placeholder="['开始日期', '结束日期']"
                />
              </a-form-item>
            </a-col>
            <a-col :span="7">
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
            </a-col>
          </a-row>
        </a-form>

        <!-- 数据表格 -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          row-key="id"
          :scroll="{ x: 1300 }"
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
        <a-empty description="数据对接情况功能开发中" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const activeTab = ref<string>('hourly')

const searchForm = reactive({
  region: 'jiande' as string | undefined,
  companyName: '',
  dateRange: undefined as any
})

const columns = [
  { title: '企业名称', dataIndex: 'companyName', key: 'companyName', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '数据采集时间（监测时间）', dataIndex: 'collectTime', key: 'collectTime', width: 200 },
  { title: '排口名称', dataIndex: 'outletName', key: 'outletName', width: 120 },
  { title: '因子名称', dataIndex: 'factorName', key: 'factorName', width: 110 },
  { title: '监测值', dataIndex: 'monitorValue', key: 'monitorValue', width: 90, align: 'center' },
  { title: '污染区排放量', dataIndex: 'pollutionEmission', key: 'pollutionEmission', width: 110, align: 'center' },
  { title: '超标状态', dataIndex: 'overLimitStatus', key: 'overLimitStatus', width: 100, align: 'center' }
]

const dataSource = ref([
  { id: 1, companyName: '海宁亚润袜业有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '废水排放口', factorName: '流量', monitorValue: 4.68, pollutionEmission: 0, overLimitStatus: '正常' },
  { id: 2, companyName: '浙江赛芙纺织品有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '总排口', factorName: '总氮', monitorValue: 19.016, pollutionEmission: 0, overLimitStatus: '正常' },
  { id: 3, companyName: '杭州临安沈氏机械有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '污水外排口', factorName: 'pH值', monitorValue: 7.16, pollutionEmission: 0, overLimitStatus: '正常' },
  { id: 4, companyName: '浙江晶科能源有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '雨水总排口', factorName: '水温', monitorValue: 26.4, pollutionEmission: 0, overLimitStatus: '正常' },
  { id: 5, companyName: '舟山市污水处理厂', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '进水口', factorName: '化学需氧量', monitorValue: 107, pollutionEmission: 4566.6, overLimitStatus: '正常' },
  { id: 6, companyName: '农夫山泉（建德）新安江饮品有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '综合排放口', factorName: '总磷', monitorValue: 8.31, pollutionEmission: 120.5, overLimitStatus: '正常' },
  { id: 7, companyName: '青岛啤酒（杭州）有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '废水排放口', factorName: '氨氮', monitorValue: 172.3, pollutionEmission: 850.2, overLimitStatus: '正常' },
  { id: 8, companyName: '杭州玺匠文化创意股份有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '总排口', factorName: '悬浮物', monitorValue: 23.5, pollutionEmission: 310.8, overLimitStatus: '正常' },
  { id: 9, companyName: '中策橡胶（建德）有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '污水外排口', factorName: '五日生化需氧量', monitorValue: 737.3, pollutionEmission: 2200.5, overLimitStatus: '正常' },
  { id: 10, companyName: '浙江致中和实业有限公司', region: '建德市–新安江街道', collectTime: '2026-05-31 00:00:00', outletName: '综合排放口', factorName: '动植物油', monitorValue: 221, pollutionEmission: 580.3, overLimitStatus: '正常' }
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 13,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

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
</script>

<style scoped lang="scss">
.outlet-quality {
  .page-header {
    margin-bottom: 12px;

    .page-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .outlet-tabs {
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
    padding: 16px;
    background: #fafafa;
    border-radius: 4px;

    :deep(.ant-form-item) {
      margin-bottom: 12px;
      width: 100%;
    }

    :deep(.ant-form-item-label) {
      font-size: 14px;
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
}
</style>
