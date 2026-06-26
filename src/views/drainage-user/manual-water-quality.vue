<template>
  <a-card :bordered="false" class="manual-water-quality-card">
    <!-- 面包屑导航 -->
    <div v-if="showDetail" class="detail-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <a @click="handleBack">人工水质检测</a>
        </a-breadcrumb-item>
        <a-breadcrumb-item>检测任务详情</a-breadcrumb-item>
      </a-breadcrumb>
      <a-button type="link" class="breadcrumb-back-btn" @click="handleBack">
        <template #icon><ArrowLeftOutlined /></template>
        返回
      </a-button>
    </div>

    <!-- 列表视图 -->
    <template v-if="!showDetail">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-row :gutter="[16, 16]">
        <a-col :span="6">
          <a-form-item label="排水户名称:">
            <a-input v-model:value="searchForm.drainageUserName" placeholder="支持模糊搜索" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="任务编号:">
            <a-input v-model:value="searchForm.taskNo" placeholder="请输入任务编号" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="行政区划:">
            <a-select v-model:value="searchForm.region" placeholder="请选择" allow-clear>
              <a-select-option value="all">建德市 / 全部区域</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="采样点类型:">
            <a-select v-model:value="searchForm.sampleType" placeholder="请选择" allow-clear>
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="drain">排水口</a-select-option>
              <a-select-option value="check">检查井</a-select-option>
              <a-select-option value="pump">泵站</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="检测状态:">
            <a-select v-model:value="searchForm.detectStatus" placeholder="请选择" allow-clear>
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="completed">已完成</a-select-option>
              <a-select-option value="testing">检测中</a-select-option>
              <a-select-option value="submitted">已送检</a-select-option>
              <a-select-option value="archived">已归档</a-select-option>
              <a-select-option value="sampling">采样中</a-select-option>
              <a-select-option value="pending">待采样</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="是否超标:">
            <a-select v-model:value="searchForm.isOverStandard" placeholder="请选择" allow-clear>
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="yes">超标</a-select-option>
              <a-select-option value="no">达标</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="检测时间:">
            <a-range-picker v-model:value="searchForm.detectDateRange" style="width: 200px" placeholder="['选择起止日期', '选择起止日期']" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
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
    <div class="table-header">
      <span class="table-title">检测任务列表</span>
      <span class="table-total">共 {{ pagination.total }} 条记录</span>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      row-key="id"
      :scroll="{ x: 1600 }"
      @change="handleTableChange"
      class="data-table"
      size="small"
      :row-class-name="getRowClassName"
    >
      <template #headerCell="{ column }">
        <span>{{ column.title }}</span>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'taskNo'">
          <a style="color: #1890ff; cursor: pointer;">{{ record.taskNo }}</a>
        </template>
        <template v-if="column.key === 'sampleTypeName'">
          <a-tag>{{ record.sampleTypeName }}</a-tag>
        </template>
        <template v-if="column.key === 'detectStatus'">
          <a-tag :color="getStatusColor(record.detectStatus)">{{ record.detectStatus }}</a-tag>
        </template>
        <template v-if="column.key === 'pollutionLevel'">
          <a-tag :color="getPollutionColor(record.pollutionLevel)">{{ record.pollutionLevel }}</a-tag>
        </template>
        <template v-if="column.key === 'isOverStandard'">
          <span :class="record.isOverStandard === '超标' ? 'over-standard' : 'meet-standard'">{{ record.isOverStandard }}</span>
        </template>
        <template v-if="column.key === 'referenceFee'">
          <span>{{ record.referenceFee || '—' }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
            <a-button type="link" size="small" @click="handleReport(record)">报告</a-button>
            <a-button type="link" size="small" @click="handleNotify(record)">通知</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
    </template>

    <!-- 详情视图 -->
    <WaterQualityDetail v-else :record="currentRecord" @back="handleBack" />
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import WaterQualityDetail from './water-quality-detail.vue'

// 详情视图控制
const showDetail = ref(false)
const currentRecord = ref<any>(null)

// 搜索表单
const searchForm = reactive({
  drainageUserName: '',
  taskNo: '',
  region: undefined as string | undefined,
  sampleType: undefined as string | undefined,
  detectStatus: undefined as string | undefined,
  isOverStandard: undefined as string | undefined,
  detectDateRange: undefined as any
})

// 表格列配置
const columns = [
  { title: '检测任务编号', dataIndex: 'taskNo', key: 'taskNo', width: 150, fixed: 'left' as const },
  { title: '排水户名称', dataIndex: 'drainageUserName', key: 'drainageUserName', width: 200 },
  { title: '区县/街道', dataIndex: 'district', key: 'district', width: 110 },
  { title: '采样点名称', dataIndex: 'samplePointName', key: 'samplePointName', width: 120 },
  { title: '采样类型', dataIndex: 'sampleTypeName', key: 'sampleTypeName', width: 90, align: 'center' as const },
  { title: '采样时间', dataIndex: 'sampleTime', key: 'sampleTime', width: 160 },
  { title: '检测状态', dataIndex: 'detectStatus', key: 'detectStatus', width: 90, align: 'center' as const },
  { title: '污染等级', dataIndex: 'pollutionLevel', key: 'pollutionLevel', width: 100, align: 'center' as const },
  { title: '是否超标', dataIndex: 'isOverStandard', key: 'isOverStandard', width: 90, align: 'center' as const },
  { title: '参考费用', dataIndex: 'referenceFee', key: 'referenceFee', width: 100, align: 'right' as const },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 160 },
  { title: '操作', key: 'action', fixed: 'right' as const, width: 160 }
]

// 模拟数据
const dataSource = ref([
  { id: 1, taskNo: 'JD-WZ-2026-0001', drainageUserName: '建德市恒丰食品有限公司', district: '新安江街道', samplePointName: '总排口A', sampleTypeName: '排水口', sampleTime: '2026-06-20 09:30', detectStatus: '已完成', pollutionLevel: '达标', isOverStandard: '达标', referenceFee: '¥800', updateTime: '2026-06-22 14:20', rowType: 'normal' },
  { id: 2, taskNo: 'JD-WZ-2026-0002', drainageUserName: '建德市华盛化工厂', district: '洋溪街道', samplePointName: '检查井B-03', sampleTypeName: '检查井', sampleTime: '2026-06-19 14:15', detectStatus: '已完成', pollutionLevel: '严重超标', isOverStandard: '超标', referenceFee: '¥3,200', updateTime: '2026-06-21 16:45', rowType: 'severe' },
  { id: 3, taskNo: 'JD-WZ-2026-0003', drainageUserName: '建德市绿源造纸有限公司', district: '更楼街道', samplePointName: '排放口C', sampleTypeName: '排水口', sampleTime: '2026-06-19 10:00', detectStatus: '检测中', pollutionLevel: '中度异常', isOverStandard: '超标', referenceFee: '¥1,800', updateTime: '2026-06-21 09:30', rowType: 'moderate' },
  { id: 4, taskNo: 'JD-WZ-2026-0004', drainageUserName: '建德市天工印染有限公司', district: '梅城镇', samplePointName: '泵站D-01', sampleTypeName: '泵站', sampleTime: '2026-06-18 15:45', detectStatus: '已完成', pollutionLevel: '轻度异常', isOverStandard: '超标', referenceFee: '¥1,200', updateTime: '2026-06-20 11:15', rowType: 'normal' },
  { id: 5, taskNo: 'JD-WZ-2026-0005', drainageUserName: '建德市清源水务有限公司', district: '寿昌镇', samplePointName: '总排口E', sampleTypeName: '排水口', sampleTime: '2026-06-18 08:20', detectStatus: '已送检', pollutionLevel: '达标', isOverStandard: '达标', referenceFee: '¥800', updateTime: '2026-06-19 17:00', rowType: 'normal' },
  { id: 6, taskNo: 'JD-WZ-2026-0006', drainageUserName: '建德市宏达建材有限公司', district: '新安江街道', samplePointName: '检查井F-02', sampleTypeName: '检查井', sampleTime: '2026-06-17 11:30', detectStatus: '已归档', pollutionLevel: '达标', isOverStandard: '达标', referenceFee: '¥800', updateTime: '2026-06-19 10:00', rowType: 'normal' },
  { id: 7, taskNo: 'JD-WZ-2026-0007', drainageUserName: '建德市丰源酒业有限公司', district: '大同镇', samplePointName: '排水口G', sampleTypeName: '排水口', sampleTime: '2026-06-17 09:00', detectStatus: '已完成', pollutionLevel: '轻度异常', isOverStandard: '超标', referenceFee: '¥1,400', updateTime: '2026-06-18 16:30', rowType: 'normal' },
  { id: 8, taskNo: 'JD-WZ-2026-0008', drainageUserName: '建德市锦绣纺织有限公司', district: '航头镇', samplePointName: '泵站H-01', sampleTypeName: '泵站', sampleTime: '2026-06-16 14:00', detectStatus: '采样中', pollutionLevel: '达标', isOverStandard: '达标', referenceFee: '', updateTime: '2026-06-16 14:30', rowType: 'normal' },
  { id: 9, taskNo: 'JD-WZ-2026-0009', drainageUserName: '建德市永盛电镀有限公司', district: '洋溪街道', samplePointName: '排放口I', sampleTypeName: '排水口', sampleTime: '2026-06-16 10:20', detectStatus: '检测中', pollutionLevel: '严重超标', isOverStandard: '超标', referenceFee: '¥4,500', updateTime: '2026-06-18 09:00', rowType: 'severe' },
  { id: 10, taskNo: 'JD-WZ-2026-0010', drainageUserName: '建德市龙腾食品有限公司', district: '梅城镇', samplePointName: '检查井J-05', sampleTypeName: '检查井', sampleTime: '2026-06-15 16:00', detectStatus: '待采样', pollutionLevel: '达标', isOverStandard: '达标', referenceFee: '', updateTime: '2026-06-15 08:00', rowType: 'normal' },
  { id: 11, taskNo: 'JD-WZ-2026-0011', drainageUserName: '建德市三联化工有限公司', district: '更楼街道', samplePointName: '排水口K', sampleTypeName: '排水口', sampleTime: '2026-06-15 09:15', detectStatus: '待采样', pollutionLevel: '达标', isOverStandard: '达标', referenceFee: '', updateTime: '2026-06-14 17:00', rowType: 'normal' },
  { id: 12, taskNo: 'JD-WZ-2026-0012', drainageUserName: '建德市绿洲污水处理有限公司', district: '寿昌镇', samplePointName: '泵站L-02', sampleTypeName: '泵站', sampleTime: '2026-06-14 13:45', detectStatus: '已完成', pollutionLevel: '中度异常', isOverStandard: '超标', referenceFee: '¥2,100', updateTime: '2026-06-16 14:20', rowType: 'moderate' },
  { id: 13, taskNo: 'JD-WZ-2026-0013', drainageUserName: '建德市鑫源矿业有限公司', district: '大同镇', samplePointName: '排放口M', sampleTypeName: '排水口', sampleTime: '2026-06-14 08:30', detectStatus: '已归档', pollutionLevel: '达标', isOverStandard: '达标', referenceFee: '¥800', updateTime: '2026-06-16 09:00', rowType: 'normal' }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 13,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 状态颜色映射
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '已完成': 'green',
    '检测中': 'orange',
    '已送检': 'blue',
    '已归档': 'default',
    '采样中': 'purple',
    '待采样': 'default'
  }
  return colorMap[status] || 'default'
}

// 污染等级颜色映射
const getPollutionColor = (level: string) => {
  const colorMap: Record<string, string> = {
    '达标': 'green',
    '轻度异常': 'orange',
    '中度异常': 'orange',
    '严重超标': 'red'
  }
  return colorMap[level] || 'default'
}

// 行样式类名
const getRowClassName = (record: any) => {
  if (record.rowType === 'severe') return 'row-severe'
  if (record.rowType === 'moderate') return 'row-moderate'
  return ''
}

// 事件处理
const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待实现')
}

const handleReset = () => {
  searchForm.drainageUserName = ''
  searchForm.taskNo = ''
  searchForm.region = undefined
  searchForm.sampleType = undefined
  searchForm.detectStatus = undefined
  searchForm.isOverStandard = undefined
  searchForm.detectDateRange = undefined
  message.info('已重置搜索条件')
}

const handleDetail = (record: any) => {
  currentRecord.value = record
  showDetail.value = true
}

const handleBack = () => {
  showDetail.value = false
  currentRecord.value = null
}

const handleReport = (record: any) => {
  message.info(`查看报告：${record.taskNo}`)
}

const handleNotify = (record: any) => {
  message.info(`发送通知：${record.taskNo}`)
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.manual-water-quality-card {
  min-height: calc(100vh - 180px);

  .detail-breadcrumb {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .breadcrumb-back-btn {
      font-size: 14px;
      padding: 0;
      flex-shrink: 0;
    }
  }

  .search-form {
    margin-bottom: 16px;

    :deep(.ant-form-item-label) {
      font-size: 14px;
    }

    .inline-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .table-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding-left: 10px;
      border-left: 3px solid #1890ff;
    }

    .table-total {
      font-size: 13px;
      color: #999;
    }
  }

  .data-table {
    :deep(.ant-table) {
      font-size: 13px;
    }

    :deep(.ant-table-thead > tr > th) {
      background: #fafafa;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 8px;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
    }

    :deep(.ant-table-tbody > tr.row-severe > td) {
      background-color: #fff1f0;
    }

    :deep(.ant-table-tbody > tr.row-moderate > td) {
      background-color: #fffbe6;
    }
  }

  .over-standard {
    color: #f5222d;
    font-weight: 600;
  }

  .meet-standard {
    color: #52c41a;
    font-weight: 600;
  }
}
</style>
