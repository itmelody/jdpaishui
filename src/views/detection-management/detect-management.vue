<template>
  <div class="detect-management">
    <!-- 左侧导航树 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">探测管理</span>
      </div>
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :tree-data="treeData"
        @select="onTreeSelect"
        show-line
        class="detect-tree"
      >
        <template #title="{ title, count, status }">
          <div class="tree-node-content">
            <span class="node-title">{{ title }}</span>
            <a-tag v-if="count !== undefined" :color="statusColor(status)" size="small" class="node-count">{{ count }}</a-tag>
          </div>
        </template>
      </a-tree>
    </div>

    <!-- 右侧内容区 -->
    <div class="content-area">
      <!-- 标题 -->
      <div class="content-header">
        <h3 class="content-title">{{ currentTab }}</h3>
      </div>

      <!-- 数据表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :scroll="{ x: 1800 }"
        row-key="id"
        size="small"
        class="detect-table"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-if="column.key === 'pipeCode'">
            <span class="pipe-code">{{ record.pipeCode }}</span>
          </template>
          <template v-if="column.key === 'categoryName'">
            <a-tag :color="categoryColor(record.categoryName)">{{ record.categoryName }}</a-tag>
          </template>
          <template v-if="column.key === 'lidMaterial'">
            <span>{{ record.lidMaterial }}</span>
          </template>
        </template>
      </a-table>

      <!-- 底部操作按钮 -->
      <div class="action-bar">
        <a-space>
          <a-button @click="handleAction('withdraw')"><UndoOutlined /> 撤回</a-button>
          <a-button type="primary" @click="handleAction('audit')"><CheckCircleOutlined /> 审核</a-button>
          <a-button @click="handleAction('replace')"><SwapOutlined /> 替换</a-button>
          <a-button danger @click="handleAction('delete')"><DeleteOutlined /> 删除</a-button>
          <a-button @click="handleAction('export')"><DownloadOutlined /> 导出</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  UndoOutlined, CheckCircleOutlined, SwapOutlined,
  DeleteOutlined, DownloadOutlined
} from '@ant-design/icons-vue'

// 树节点状态颜色
const statusColor = (status?: string) => {
  if (status === 'submitted') return 'blue'
  if (status === 'auditing') return 'orange'
  if (status === 'failed') return 'red'
  if (status === 'stored') return 'green'
  return 'default'
}

// 类别颜色
const categoryColor = (name: string) => {
  if (name === '雨篦') return 'cyan'
  if (name === '雨水井') return 'blue'
  if (name === '非普查区') return 'default'
  return 'default'
}

// 左侧树形数据
const expandedKeys = ref<string[]>(['detect', 'area1', 'area2', 'area3'])
const selectedKeys = ref<string[]>(['submitted'])

const treeData = [
  {
    title: '探测管理',
    key: 'detect',
    children: [
      { title: '已提交的探测成果', key: 'submitted', status: 'submitted' },
      { title: '审核中', key: 'auditing', count: 11, status: 'auditing' },
      { title: '未通过', key: 'failed', count: 59, status: 'failed' },
      { title: '已入库', key: 'stored', count: 5821, status: 'stored' }
    ]
  },
  {
    title: '中环北区',
    key: 'area1',
    children: [
      { title: '昆山市市政工程有限公司', key: 'company1' },
      { title: '昆山市鑫泓建设工程有限公司', key: 'company2' },
      { title: '昆山新忠健项目管理有限公司', key: 'company3' },
      { title: '苏州杰诚测绘地理信息有限公司', key: 'company4' }
    ]
  },
  {
    title: '淀山湖',
    key: 'area2',
    children: [
      { title: '苏州市水利工程质量检测中心有限公司', key: 'company5' },
      { title: '昆山鹿城测绘有限公司', key: 'company6' },
      { title: '昆山智禾工程咨询有限公司', key: 'company7' },
      { title: '江苏煤炭地质物探队', key: 'company8' }
    ]
  },
  {
    title: '周庄',
    key: 'area3',
    children: [
      { title: '昆山智禾工程咨询有限公司', key: 'company9' },
      { title: '苏州北·斗测绘有限公司', key: 'company10' }
    ]
  }
]

const currentTab = ref('已提交的探测成果')

const onTreeSelect = (keys: string[], info: any) => {
  if (keys.length > 0) {
    const node = info.node
    if (['submitted', 'auditing', 'failed', 'stored'].includes(keys[0])) {
      currentTab.value = node.title
    } else {
      message.info(`选中: ${node.title}`)
    }
  }
}

// 表格列定义
const columns = [
  { title: '序号', key: 'index', width: 50, align: 'center', fixed: 'left' },
  { title: '管点编码', dataIndex: 'pipeCode', key: 'pipeCode', width: 120, fixed: 'left' },
  { title: '横坐标', dataIndex: 'coordX', key: 'coordX', width: 90, align: 'center' },
  { title: '纵坐标', dataIndex: 'coordY', key: 'coordY', width: 90, align: 'center' },
  { title: '类别名称', dataIndex: 'categoryName', key: 'categoryName', width: 90 },
  { title: '地面标高', dataIndex: 'groundElevation', key: 'groundElevation', width: 90, align: 'center' },
  { title: '井深', dataIndex: 'wellDepth', key: 'wellDepth', width: 70, align: 'center' },
  { title: '规格', dataIndex: 'spec', key: 'spec', width: 80, align: 'center' },
  { title: '井盖材质', dataIndex: 'lidMaterial', key: 'lidMaterial', width: 90 },
  { title: '井盖形状', dataIndex: 'lidShape', key: 'lidShape', width: 80, align: 'center' },
  { title: '井盖尺寸', dataIndex: 'lidSize', key: 'lidSize', width: 80, align: 'center' },
  { title: '探测单位', dataIndex: 'detectUnit', key: 'detectUnit', width: 140 },
  { title: '探测日期', dataIndex: 'detectDate', key: 'detectDate', width: 100 },
  { title: '所在位置', dataIndex: 'location', key: 'location', width: 100 },
  { title: '归属', dataIndex: 'belongTo', key: 'belongTo', width: 70, align: 'center' },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 80 }
]

// 模拟数据
const dataSource = ref([
  { id: 1, pipeCode: 'YB-001', coordX: '3369.85', coordY: '501.25', categoryName: '雨篦', groundElevation: '4.25', wellDepth: '0.8', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/26', location: '鄱阳湖路', belongTo: '市政', remark: '郁金香' },
  { id: 2, pipeCode: 'YB-002', coordX: '3371.42', coordY: '503.18', categoryName: '雨篦', groundElevation: '4.31', wellDepth: '0.9', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/26', location: '鄱阳湖路', belongTo: '市政', remark: '郁金香' },
  { id: 3, pipeCode: 'YS-003', coordX: '3375.68', coordY: '507.92', categoryName: '雨水井', groundElevation: '4.18', wellDepth: '1.2', spec: 'DN400', lidMaterial: '球墨铸铁', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/7/26', location: '鄱阳湖路', belongTo: '市政', remark: '郁金香' },
  { id: 4, pipeCode: 'YB-004', coordX: '3380.15', coordY: '512.45', categoryName: '雨篦', groundElevation: '4.22', wellDepth: '0.85', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/27', location: '太湖路', belongTo: '市政', remark: '郁金香' },
  { id: 5, pipeCode: 'YS-005', coordX: '3385.92', coordY: '518.33', categoryName: '雨水井', groundElevation: '4.35', wellDepth: '1.5', spec: 'DN500', lidMaterial: '球墨铸铁', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/7/27', location: '太湖路', belongTo: '市政', remark: '郁金香' },
  { id: 6, pipeCode: 'FP-006', coordX: '3392.08', coordY: '524.71', categoryName: '非普查区', groundElevation: '-', wellDepth: '-', spec: '-', lidMaterial: '-', lidShape: '-', lidSize: '-', detectUnit: '昆山市测绘中心', detectDate: '2023/7/27', location: '太湖路', belongTo: '市政', remark: '郁金香' },
  { id: 7, pipeCode: 'YB-007', coordX: '3398.55', coordY: '531.28', categoryName: '雨篦', groundElevation: '4.28', wellDepth: '0.9', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/28', location: '淀山湖路', belongTo: '市政', remark: '郁金香' },
  { id: 8, pipeCode: 'YS-008', coordX: '3405.32', coordY: '538.15', categoryName: '雨水井', groundElevation: '4.42', wellDepth: '1.3', spec: 'DN400', lidMaterial: '球墨铸铁', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/7/28', location: '淀山湖路', belongTo: '市政', remark: '郁金香' },
  { id: 9, pipeCode: 'YB-009', coordX: '3412.78', coordY: '545.62', categoryName: '雨篦', groundElevation: '4.19', wellDepth: '0.85', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/28', location: '淀山湖路', belongTo: '市政', remark: '郁金香' },
  { id: 10, pipeCode: 'YS-010', coordX: '3420.15', coordY: '552.98', categoryName: '雨水井', groundElevation: '4.38', wellDepth: '1.4', spec: 'DN500', lidMaterial: '砼', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/7/29', location: '周庄路', belongTo: '市政', remark: '郁金香' },
  { id: 11, pipeCode: 'YB-011', coordX: '3428.62', coordY: '561.45', categoryName: '雨篦', groundElevation: '4.25', wellDepth: '0.8', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/29', location: '周庄路', belongTo: '市政', remark: '郁金香' },
  { id: 12, pipeCode: 'FP-012', coordX: '3435.18', coordY: '568.92', categoryName: '非普查区', groundElevation: '-', wellDepth: '-', spec: '-', lidMaterial: '-', lidShape: '-', lidSize: '-', detectUnit: '昆山市测绘中心', detectDate: '2023/7/29', location: '周庄路', belongTo: '市政', remark: '郁金香' },
  { id: 13, pipeCode: 'YB-013', coordX: '3442.75', coordY: '576.38', categoryName: '雨篦', groundElevation: '4.32', wellDepth: '0.9', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/30', location: '锦溪路', belongTo: '市政', remark: '郁金香' },
  { id: 14, pipeCode: 'YS-014', coordX: '3450.28', coordY: '583.85', categoryName: '雨水井', groundElevation: '4.45', wellDepth: '1.6', spec: 'DN400', lidMaterial: '球墨铸铁', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/7/30', location: '锦溪路', belongTo: '市政', remark: '郁金香' },
  { id: 15, pipeCode: 'YB-015', coordX: '3458.92', coordY: '591.32', categoryName: '雨篦', groundElevation: '4.21', wellDepth: '0.85', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/30', location: '锦溪路', belongTo: '市政', remark: '郁金香' },
  { id: 16, pipeCode: 'YS-016', coordX: '3465.55', coordY: '598.78', categoryName: '雨水井', groundElevation: '4.38', wellDepth: '1.3', spec: 'DN500', lidMaterial: '砼', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/7/31', location: '千灯路', belongTo: '市政', remark: '郁金香' },
  { id: 17, pipeCode: 'YB-017', coordX: '3473.18', coordY: '606.25', categoryName: '雨篦', groundElevation: '4.28', wellDepth: '0.9', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/7/31', location: '千灯路', belongTo: '市政', remark: '郁金香' },
  { id: 18, pipeCode: 'FP-018', coordX: '3480.75', coordY: '613.72', categoryName: '非普查区', groundElevation: '-', wellDepth: '-', spec: '-', lidMaterial: '-', lidShape: '-', lidSize: '-', detectUnit: '昆山市测绘中心', detectDate: '2023/7/31', location: '千灯路', belongTo: '市政', remark: '郁金香' },
  { id: 19, pipeCode: 'YB-019', coordX: '3488.42', coordY: '621.18', categoryName: '雨篦', groundElevation: '4.35', wellDepth: '0.85', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/8/1', location: '陆家路', belongTo: '市政', remark: '郁金香' },
  { id: 20, pipeCode: 'YS-020', coordX: '3495.08', coordY: '628.65', categoryName: '雨水井', groundElevation: '4.48', wellDepth: '1.5', spec: 'DN400', lidMaterial: '球墨铸铁', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/8/1', location: '陆家路', belongTo: '市政', remark: '郁金香' },
  { id: 21, pipeCode: 'YB-021', coordX: '3502.75', coordY: '636.12', categoryName: '雨篦', groundElevation: '4.22', wellDepth: '0.8', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/8/1', location: '陆家路', belongTo: '市政', remark: '郁金香' },
  { id: 22, pipeCode: 'YS-022', coordX: '3510.38', coordY: '643.58', categoryName: '雨水井', groundElevation: '4.42', wellDepth: '1.4', spec: 'DN500', lidMaterial: '球墨铸铁', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/8/2', location: '花桥路', belongTo: '市政', remark: '郁金香' },
  { id: 23, pipeCode: 'YB-023', coordX: '3518.02', coordY: '651.05', categoryName: '雨篦', groundElevation: '4.29', wellDepth: '0.9', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/8/2', location: '花桥路', belongTo: '市政', remark: '郁金香' },
  { id: 24, pipeCode: 'FP-024', coordX: '3525.68', coordY: '658.52', categoryName: '非普查区', groundElevation: '-', wellDepth: '-', spec: '-', lidMaterial: '-', lidShape: '-', lidSize: '-', detectUnit: '昆山市测绘中心', detectDate: '2023/8/2', location: '花桥路', belongTo: '市政', remark: '郁金香' },
  { id: 25, pipeCode: 'YB-025', coordX: '3533.35', coordY: '665.98', categoryName: '雨篦', groundElevation: '4.38', wellDepth: '0.85', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/8/3', location: '巴城路', belongTo: '市政', remark: '郁金香' },
  { id: 26, pipeCode: 'YS-026', coordX: '3540.98', coordY: '673.45', categoryName: '雨水井', groundElevation: '4.52', wellDepth: '1.6', spec: 'DN400', lidMaterial: '砼', lidShape: '圆', lidSize: '70', detectUnit: '昆山市测绘中心', detectDate: '2023/8/3', location: '巴城路', belongTo: '市政', remark: '郁金香' },
  { id: 27, pipeCode: 'YB-027', coordX: '3548.65', coordY: '680.92', categoryName: '雨篦', groundElevation: '4.25', wellDepth: '0.9', spec: 'DN300', lidMaterial: '球墨铸铁', lidShape: '矩', lidSize: '60*40', detectUnit: '昆山市测绘中心', detectDate: '2023/8/3', location: '巴城路', belongTo: '市政', remark: '郁金香' }
])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 27,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const selectedRowKeys = ref<string[]>([])

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const handleAction = (action: string) => {
  if (action === 'delete' && selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的数据')
    return
  }
  message.info(`操作: ${action}`)
}
</script>

<style scoped lang="scss">
.detect-management {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .sidebar-header {
    padding: 12px 16px;
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;

    .sidebar-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
  }

  .detect-tree {
    flex: 1;
    overflow-y: auto;
    padding: 12px 8px;

    :deep(.ant-tree-node-selected) {
      background: #e6f7ff;
    }

    .tree-node-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .node-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .node-count {
        margin-left: 8px;
        flex-shrink: 0;
      }
    }
  }
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
}

.content-header {
  margin-bottom: 12px;

  .content-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.detect-table {
  flex: 1;
  overflow: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

  :deep(.ant-table-thead > tr > th) {
    background: #E3F2FD;
    font-weight: 600;
    font-size: 12px;
    padding: 8px 6px;
    white-space: nowrap;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 6px;
    font-size: 12px;
  }

  .pipe-code {
    color: #fa8c16;
    font-weight: 600;
    background: #fff7e6;
    padding: 2px 6px;
    border-radius: 3px;
  }
}

.action-bar {
  padding: 12px 0;
  display: flex;
  justify-content: flex-start;
}
</style>
