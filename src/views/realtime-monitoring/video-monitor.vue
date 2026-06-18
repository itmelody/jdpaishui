<template>
  <div class="video-monitor">
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
            <a-form-item label="监控点编号:">
              <a-input v-model:value="searchForm.pointId" placeholder="请输入" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="监控点名称:">
              <a-input v-model:value="searchForm.pointName" placeholder="请输入" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item class="inline-buttons">
              <a-space>
                <a-button @click="handleReset">
                  <template #icon><ReloadOutlined /></template>
                  重置
                </a-button>
                <a-button type="primary" @click="handleSearch">
                  <template #icon><SearchOutlined /></template>
                  搜索
                </a-button>
                <a-button @click="showAdvanced = !showAdvanced">
                  展开 <DownOutlined v-if="!showAdvanced" /><UpOutlined v-else />
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 工具栏 -->
    <div class="toolbar">
      <span class="toolbar-left">共 {{ pagination.total }} 条数据</span>
      <a-space class="toolbar-right">
        <a-tooltip title="刷新">
          <a-button size="small" @click="handleRefresh"><ReloadOutlined /></a-button>
        </a-tooltip>
        <a-tooltip title="列设置">
          <a-button size="small"><SettingOutlined /></a-button>
        </a-tooltip>
        <a-tooltip title="全屏">
          <a-button size="small"><ExpandOutlined /></a-button>
        </a-tooltip>
      </a-space>
    </div>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      row-key="id"
      :scroll="{ x: 1400 }"
      @change="handleTableChange"
      class="data-table"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="handlePlay(record)">
            <template #icon><PlayCircleOutlined /></template>
            播放
          </a-button>
        </template>
      </template>
    </a-table>

    <!-- 视频播放弹窗 -->
    <a-modal
      v-model:open="videoModalVisible"
      :title="`视频播放 - ${currentStation.pointName || ''}`"
      width="800px"
      :footer="null"
      @cancel="videoModalVisible = false"
    >
      <div class="video-player-placeholder">
        <div class="player-area">
          <PlayCircleOutlined style="font-size: 48px; color: #fff;" />
          <p style="color: #fff; margin-top: 16px;">视频加载中...</p>
          <p style="color: #aaa; font-size: 12px;">监控点: {{ currentStation.pointName }}</p>
          <p style="color: #aaa; font-size: 12px;">编号: {{ currentStation.pointId }}</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  SearchOutlined, ReloadOutlined, SettingOutlined, ExpandOutlined,
  PlayCircleOutlined, DownOutlined, UpOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const showAdvanced = ref(false)
const videoModalVisible = ref(false)
const currentStation = reactive<Record<string, any>>({})

const searchForm = reactive({
  region: 'jiande' as string | undefined,
  pointId: '',
  pointName: ''
})

const columns = [
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '监控点编号', dataIndex: 'pointId', key: 'pointId', width: 200 },
  { title: '监控点名称', dataIndex: 'pointName', key: 'pointName', width: 280 },
  { title: '设备来源', dataIndex: 'deviceSource', key: 'deviceSource', width: 130 },
  { title: '管理单位', dataIndex: 'manageUnit', key: 'manageUnit', width: 120 },
  { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson', width: 100 },
  { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 120 },
  { title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right' }
]

const dataSource = ref([
  { id: 1, region: '杭州市建德市', pointId: '33018252001320310088', pointName: '洋溪03011丽锦大厦2幢高空', deviceSource: '省防指共享数据', manageUnit: '', contactPerson: '', contactPhone: '' },
  { id: 2, region: '杭州市建德市', pointId: '33018252001320310089', pointName: '新安江大桥南侧监控', deviceSource: '省防指共享数据', manageUnit: '', contactPerson: '', contactPhone: '' },
  { id: 3, region: '杭州市建德市', pointId: '33018252001320310090', pointName: '梅城古镇东门监控', deviceSource: '省防指共享数据', manageUnit: '', contactPerson: '', contactPhone: '' },
  { id: 4, region: '杭州市建德市', pointId: '33018252001320310091', pointName: '寿昌镇工业区入口', deviceSource: '省防指共享数据', manageUnit: '', contactPerson: '', contactPhone: '' },
  { id: 5, region: '杭州市建德市', pointId: '33018252001320310092', pointName: '大同镇高速出口卡口', deviceSource: '省防指共享数据', manageUnit: '', contactPerson: '', contactPhone: '' },
  { id: 6, region: '杭州市建德市', pointId: '33018252001320310093', pointName: '乾潭镇中心广场', deviceSource: '省防指共享数据', manageUnit: '', contactPerson: '', contactPhone: '' },
  { id: 7, region: '杭州市建德市', pointId: '33018252001320310094', pointName: '新安江街道政府大楼', deviceSource: '省防指共享数据', manageUnit: '', contactPerson: '', contactPhone: '' }
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 7,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待实现')
}

const handleReset = () => {
  searchForm.region = 'jiande'
  searchForm.pointId = ''
  searchForm.pointName = ''
  message.info('已重置搜索条件')
}

const handleRefresh = () => {
  message.success('数据已刷新')
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handlePlay = (record: any) => {
  currentStation.pointName = record.pointName
  currentStation.pointId = record.pointId
  videoModalVisible.value = true
  message.info('视频播放功能待接入')
}
</script>

<style scoped lang="scss">
.video-monitor {
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

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 0;

    .toolbar-left {
      font-size: 14px;
      color: #666;
    }
  }

  .data-table {
    :deep(.ant-table) {
      font-size: 13px;
    }

    :deep(.ant-table-thead > tr > th) {
      background: #F5F7FA;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 8px;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
    }

    :deep(.ant-table-tbody > tr:nth-child(even) > td) {
      background: #FAFAFA;
    }
  }

  .video-player-placeholder {
    .player-area {
      height: 450px;
      background: #1a1a1a;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
