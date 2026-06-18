<template>
  <div class="pipe-monitor">
    <!-- 标签页 -->
    <a-tabs v-model:activeKey="activeTab" class="pipe-tabs">
      <a-tab-pane key="realtime" tab="管网实时数据">
        <!-- 筛选条件 -->
        <a-card :bordered="false" class="search-card">
          <a-form :model="searchForm" layout="inline" class="search-form">
            <a-row :gutter="[16, 16]">
              <a-col :span="8">
                <a-form-item label="归属地区:">
                  <a-select v-model:value="searchForm.region" placeholder="请选择地区" allow-clear>
                    <a-select-option value="jiande">浙江省 / 杭州市 / 建德市</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="污水管网节点名称:">
                  <a-input v-model:value="searchForm.nodeName" placeholder="请输入" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="管网编号:">
                  <a-input v-model:value="searchForm.pipeId" placeholder="请输入" allow-clear />
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
        </a-card>

        <!-- 数据表格 -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          row-key="id"
          :scroll="{ x: 1100 }"
          @change="handleTableChange"
          class="data-table"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'flow'">
              <span :style="{ color: record.flow > 80 ? '#f5222d' : record.flow > 50 ? '#fa8c16' : '#333', fontWeight: 600 }">
                {{ record.flow }}
              </span>
            </template>
            <template v-if="column.key === 'waterLevel'">
              <span :style="{ color: record.waterLevel > 1.5 ? '#f5222d' : record.waterLevel > 1.0 ? '#fa8c16' : '#333', fontWeight: 600 }">
                {{ record.waterLevel }}
              </span>
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

const activeTab = ref<string>('realtime')

const searchForm = reactive({
  region: undefined as string | undefined,
  nodeName: '',
  pipeId: '',
  dateRange: undefined as any
})

const columns = [
  { title: '污水管网节点名称', dataIndex: 'nodeName', key: 'nodeName', width: 180 },
  { title: '管网编号', dataIndex: 'pipeId', key: 'pipeId', width: 130 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 100 },
  { title: '数据采集时间（监测时间）', dataIndex: 'collectTime', key: 'collectTime', width: 200 },
  { title: '流量(m³/h)', dataIndex: 'flow', key: 'flow', width: 110, align: 'center' },
  { title: '液位（m）', dataIndex: 'waterLevel', key: 'waterLevel', width: 100, align: 'center' }
]

const dataSource = ref([
  { id: 1, nodeName: '新安江泵站出口', pipeId: 'GW-XAJ-001', region: '城区片区', collectTime: '2026-06-11 08:30:00', flow: 45.2, waterLevel: 0.85 },
  { id: 2, nodeName: '洋溪污水处理厂入口', pipeId: 'GW-YX-002', region: '城区片区', collectTime: '2026-06-11 08:30:00', flow: 78.6, waterLevel: 1.32 },
  { id: 3, nodeName: '梅城管网节点A', pipeId: 'GW-MC-003', region: '梅城片区', collectTime: '2026-06-11 08:28:00', flow: 32.1, waterLevel: 0.65 },
  { id: 4, nodeName: '寿昌工业区出口', pipeId: 'GW-SC-004', region: '寿昌片区', collectTime: '2026-06-11 08:25:00', flow: 56.8, waterLevel: 1.05 },
  { id: 5, nodeName: '大同镇污水管网', pipeId: 'GW-DT-005', region: '寿昌片区', collectTime: '2026-06-11 08:20:00', flow: 22.3, waterLevel: 0.48 }
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
  searchForm.nodeName = ''
  searchForm.pipeId = ''
  searchForm.dateRange = undefined
  message.info('已重置搜索条件')
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.pipe-monitor {
  .pipe-tabs {
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

  .search-card {
    margin-bottom: 16px;

    :deep(.ant-card-body) {
      padding: 16px;
    }
  }

  .search-form {
    :deep(.ant-form-item) {
      margin-bottom: 0;
      width: 100%;
      display: flex;
      align-items: center;
    }

    :deep(.ant-form-item-label) {
      font-size: 14px;
      line-height: 32px;
      white-space: nowrap;
    }

    :deep(.ant-form-item-control) {
      flex: 1;
    }

    .inline-buttons {
      display: flex;
      justify-content: flex-end;
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
