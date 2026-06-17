<template>
  <div class="detection-management">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 大标题 -->
        <span class="main-title">排水管网管理系统</span>
        <a-divider type="vertical" class="title-divider" />
        <!-- 文件操作按钮 -->
        <a-button @click="handleAction('newProject')"><FolderAddOutlined /> 新建工程</a-button>
        <a-button @click="handleAction('openProject')"><FolderOpenOutlined /> 打开工程</a-button>
        <a-button @click="handleAction('saveProject')"><SaveOutlined /> 保存工程</a-button>
        <a-button @click="handleAction('createReport')"><FileTextOutlined /> 创建报告</a-button>
        <a-button @click="handleAction('validateData')"><CheckCircleOutlined /> 校验数据</a-button>
        <a-button @click="handleAction('submitData')"><SendOutlined /> 提交数据</a-button>
        <a-button :type="currentPage === 'detection' ? 'primary' : 'default'" :class="{ 'active-tab': currentPage === 'detection' }" @click="handleNav('detection')"><DatabaseOutlined /> 检测管理</a-button>
        <a-divider type="vertical" class="nav-divider" />
        <!-- 导航菜单按钮 -->
        <a-button @click="handleNav('detectUpload')"><WifiOutlined /> 探测上传</a-button>
        <a-button :type="currentPage === 'detectManage' ? 'primary' : 'default'" :class="{ 'active-tab': currentPage === 'detectManage' }" @click="handleNav('detectManage')"><WifiOutlined /> 探测管理</a-button>
        <a-divider type="vertical" class="nav-divider" />
        <a-button @click="handleNav('repairUpload')"><ToolOutlined /> 修复上传</a-button>
        <a-button @click="handleNav('repairManage')"><FileDoneOutlined /> 修复管理</a-button>
        <a-divider type="vertical" class="nav-divider" />
        <a-button @click="handleNav('statsAnalysis')"><BarChartOutlined /> 统计分析</a-button>
        <a-button @click="handleNav('permission')"><SafetyOutlined /> 权限管理</a-button>
        <a-button @click="handleNav('projectManage')"><ProfileOutlined /> 项目管理</a-button>
        <a-divider type="vertical" class="nav-divider" />
        <a-button @click="handleNav('validateConfig')"><SearchOutlined /> 校验配置</a-button>
        <a-button @click="handleNav('changePassword')"><LockOutlined /> 修改密码</a-button>
        <a-button @click="handleNav('downloadSpec')"><FileProtectOutlined /> 下载规范</a-button>
        <a-button @click="handleNav('updateAI')"><RobotOutlined /> 更新AI</a-button>
        <a-button @click="handleNav('systemHelp')"><QuestionCircleOutlined /> 系统帮助</a-button>
      </div>
      <div class="toolbar-right">
        <a-button type="text" @click="goBack"><LogoutOutlined /> 退出</a-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div v-if="currentPage === 'detection'" class="main-content">
      <!-- 左侧工程清单树 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">已提交工程清单</span>
        </div>
        <a-tree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          :tree-data="treeData"
          @select="onTreeSelect"
          show-line
          class="project-tree"
        />
      </div>

      <!-- 右侧表格区 -->
      <div class="content-area">
        <!-- 统计信息 -->
        <div class="stats-bar">
          <span>检测总长：<b style="color:#1890ff">{{ stats.totalLength }}</b> 米</span>
          <a-divider type="vertical" />
          <span>管段总长：<b style="color:#1890ff">{{ stats.pipeLength }}</b> 米</span>
          <a-divider type="vertical" />
          <span>抽检比：<b style="color:#fa8c16">{{ stats.samplingRate }}%</b></span>
        </div>

        <!-- 数据表格 -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          :scroll="{ x: 2000 }"
          row-key="id"
          size="small"
          class="detection-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'detectionObject'">
              <a-tag :color="record.detectionObject === '污水管' ? 'orange' : 'blue'">
                {{ record.detectionObject }}
              </a-tag>
            </template>
            <template v-if="column.key === 'structuralTotal'">
              <span :style="{ color: record.structuralTotal > 5 ? '#f5222d' : '#333', fontWeight: 600 }">
                {{ record.structuralTotal }}
              </span>
            </template>
            <template v-if="column.key === 'functionalTotal'">
              <span :style="{ color: record.functionalTotal > 3 ? '#fa8c16' : '#333', fontWeight: 600 }">
                {{ record.functionalTotal }}
              </span>
            </template>
          </template>
        </a-table>

        <!-- 底部操作按钮 -->
        <div class="action-bar">
          <a-space>
            <a-button @click="handleAction('approve')"><CheckOutlined /> 工程审批</a-button>
            <a-button danger @click="handleAction('delete')"><DeleteOutlined /> 删除工程</a-button>
            <a-button @click="handleAction('export')"><DownloadOutlined /> 导出表格</a-button>
            <a-button @click="handleAction('replace')"><SwapOutlined /> 替换文件</a-button>
            <a-button @click="handleAction('download')"><CloudDownloadOutlined /> 下载文件</a-button>
          </a-space>
        </div>
      </div>
    </div>

    <!-- 探测管理页面 -->
    <DetectManagement v-else-if="currentPage === 'detectManage'" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import DetectManagement from './detect-management.vue'
import {
  DatabaseOutlined, LogoutOutlined,
  CheckOutlined, DeleteOutlined, DownloadOutlined, SwapOutlined,
  CloudDownloadOutlined,
  WifiOutlined, ToolOutlined, FileDoneOutlined,
  BarChartOutlined, SafetyOutlined, ProfileOutlined,
  SearchOutlined, LockOutlined, FileProtectOutlined,
  RobotOutlined, QuestionCircleOutlined,
  FolderAddOutlined, FolderOpenOutlined, SaveOutlined, FileTextOutlined,
  CheckCircleOutlined, SendOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 当前页面：detection=检测管理, detectManage=探测管理
const currentPage = ref('detection')

// 统计信息
const stats = reactive({
  totalLength: '4441.67',
  pipeLength: '4402.29',
  samplingRate: '13'
})

// 树形数据
const expandedKeys = ref<string[]>(['company1'])
const selectedKeys = ref<string[]>(['project1'])

const treeData = [
  {
    title: '昆山市市政工程有限公司',
    key: 'company1',
    children: [
      { title: '景秀苑/78101', key: 'project1' },
      { title: '金都花园/50938', key: 'project2' },
      { title: '火炬新村/02969', key: 'project3' },
      { title: '翠湾新城/12056', key: 'project4' },
      { title: '西湖国际/33201', key: 'project5' }
    ]
  },
  {
    title: '建德市排水工程有限公司',
    key: 'company2',
    children: [
      { title: '新安江项目/45012', key: 'project6' },
      { title: '洋溪片区/67890', key: 'project7' },
      { title: '梅城工程/23456', key: 'project8' }
    ]
  },
  {
    title: '杭州市管道检测有限公司',
    key: 'company3',
    children: [
      { title: '寿昌管网/89012', key: 'project9' },
      { title: '大同镇检测/34567', key: 'project10' }
    ]
  }
]

const onTreeSelect = (keys: string[], info: any) => {
  if (keys.length > 0) {
    message.info(`选中工程: ${info.node.title}`)
  }
}

// 表格列定义
const columns = [
  { title: '工程编码', dataIndex: 'projectCode', key: 'projectCode', width: 160, fixed: 'left' },
  { title: '起点编码', dataIndex: 'startCode', key: 'startCode', width: 100 },
  { title: '终点编码', dataIndex: 'endCode', key: 'endCode', width: 100 },
  { title: '检测对象', dataIndex: 'detectionObject', key: 'detectionObject', width: 90 },
  { title: '管径', dataIndex: 'diameter', key: 'diameter', width: 80, align: 'center' },
  { title: '管材', dataIndex: 'material', key: 'material', width: 80 },
  { title: '结构性缺陷-I级', dataIndex: 'structuralI', key: 'structuralI', width: 80, align: 'center' },
  { title: '结构性缺陷-II级', dataIndex: 'structuralII', key: 'structuralII', width: 80, align: 'center' },
  { title: '结构性缺陷-III级', dataIndex: 'structuralIII', key: 'structuralIII', width: 80, align: 'center' },
  { title: '结构性缺陷-IV级', dataIndex: 'structuralIV', key: 'structuralIV', width: 80, align: 'center' },
  { title: '结构性缺陷-合计', dataIndex: 'structuralTotal', key: 'structuralTotal', width: 90, align: 'center' },
  { title: '功能性缺陷-I级', dataIndex: 'functionalI', key: 'functionalI', width: 80, align: 'center' },
  { title: '功能性缺陷-II级', dataIndex: 'functionalII', key: 'functionalII', width: 80, align: 'center' },
  { title: '功能性缺陷-III级', dataIndex: 'functionalIII', key: 'functionalIII', width: 80, align: 'center' },
  { title: '功能性缺陷-IV级', dataIndex: 'functionalIV', key: 'functionalIV', width: 80, align: 'center' },
  { title: '功能性缺陷-合计', dataIndex: 'functionalTotal', key: 'functionalTotal', width: 90, align: 'center' },
  { title: '检测单位', dataIndex: 'detectionUnit', key: 'detectionUnit', width: 150 },
  { title: '检测日期', dataIndex: 'detectionDate', key: 'detectionDate', width: 100 }
]

// 模拟数据
const dataSource = ref([
  { id: 1, projectCode: 'GD-202211262-001', startCode: 'MJ-001', endCode: 'MJ-002', detectionObject: '雨水管', diameter: 'DN400', material: 'PVC', structuralI: 2, structuralII: 1, structuralIII: 0, structuralIV: 0, structuralTotal: 3, functionalI: 1, functionalII: 0, functionalIII: 0, functionalIV: 0, functionalTotal: 1, detectionUnit: '昆山市市政工程有限公司', detectionDate: '2022-11' },
  { id: 2, projectCode: 'GD-202211262-002', startCode: 'MJ-002', endCode: 'MJ-003', detectionObject: '污水管', diameter: 'DN300', material: 'PE', structuralI: 1, structuralII: 2, structuralIII: 1, structuralIV: 0, structuralTotal: 4, functionalI: 0, functionalII: 1, functionalIII: 0, functionalIV: 0, functionalTotal: 1, detectionUnit: '昆山市市政工程有限公司', detectionDate: '2022-11' },
  { id: 3, projectCode: 'GD-202211262-003', startCode: 'MJ-003', endCode: 'MJ-004', detectionObject: '雨水管', diameter: 'DN500', material: '砼', structuralI: 0, structuralII: 1, structuralIII: 2, structuralIV: 1, structuralTotal: 4, functionalI: 2, functionalII: 1, functionalIII: 1, functionalIV: 0, functionalTotal: 4, detectionUnit: '建德市排水工程有限公司', detectionDate: '2022-11' },
  { id: 4, projectCode: 'GD-202211262-004', startCode: 'MJ-004', endCode: 'MJ-005', detectionObject: '合流管', diameter: 'DN600', material: 'PVC', structuralI: 3, structuralII: 0, structuralIII: 0, structuralIV: 0, structuralTotal: 3, functionalI: 1, functionalII: 2, functionalIII: 0, functionalIV: 0, functionalTotal: 3, detectionUnit: '杭州市管道检测有限公司', detectionDate: '2022-12' },
  { id: 5, projectCode: 'GD-202211262-005', startCode: 'MJ-005', endCode: 'MJ-006', detectionObject: '污水管', diameter: 'DN400', material: 'PE', structuralI: 1, structuralII: 1, structuralIII: 3, structuralIV: 1, structuralTotal: 6, functionalI: 0, functionalII: 0, functionalIII: 2, functionalIV: 1, functionalTotal: 3, detectionUnit: '昆山市市政工程有限公司', detectionDate: '2022-12' },
  { id: 6, projectCode: 'GD-202211262-006', startCode: 'MJ-006', endCode: 'MJ-007', detectionObject: '雨水管', diameter: 'DN300', material: 'UPVC', structuralI: 2, structuralII: 0, structuralIII: 1, structuralIV: 0, structuralTotal: 3, functionalI: 1, functionalII: 1, functionalIII: 0, functionalIV: 0, functionalTotal: 2, detectionUnit: '建德市排水工程有限公司', detectionDate: '2022-12' },
  { id: 7, projectCode: 'GD-202211262-007', startCode: 'MJ-007', endCode: 'MJ-008', detectionObject: '污水管', diameter: 'DN500', material: '砼', structuralI: 0, structuralII: 2, structuralIII: 1, structuralIV: 2, structuralTotal: 5, functionalI: 2, functionalII: 0, functionalIII: 1, functionalIV: 1, functionalTotal: 4, detectionUnit: '杭州市管道检测有限公司', detectionDate: '2023-01' },
  { id: 8, projectCode: 'GD-202211262-008', startCode: 'MJ-008', endCode: 'MJ-009', detectionObject: '雨水管', diameter: 'DN400', material: 'PE', structuralI: 1, structuralII: 1, structuralIII: 0, structuralIV: 0, structuralTotal: 2, functionalI: 0, functionalII: 1, functionalIII: 0, functionalIV: 0, functionalTotal: 1, detectionUnit: '昆山市市政工程有限公司', detectionDate: '2023-01' }
])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 19,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const handleNav = (key: string) => {
  if (key === 'detectManage') {
    currentPage.value = 'detectManage'
  } else if (key === 'detection') {
    currentPage.value = 'detection'
  } else {
    message.info(`导航到: ${key}`)
  }
}

const handleAction = (action: string) => {
  message.info(`操作: ${action}`)
}

const goBack = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.detection-management {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.toolbar {
  height: 48px;
  background: linear-gradient(90deg, #001529 0%, #003a70 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 1px;
    flex-wrap: nowrap;
    overflow: hidden;

    .main-title {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      margin-right: 8px;
      letter-spacing: 1px;
    }

    .title-divider {
      height: 24px;
      border-color: rgba(255, 255, 255, 0.3);
      margin: 0 8px 0 0;
    }

    .nav-divider {
      height: 20px;
      border-color: rgba(255, 255, 255, 0.2);
      margin: 0 2px;
    }

    .ant-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.75);
      font-size: 12px;
      height: 32px;
      padding: 0 6px;
      flex-shrink: 0;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      &.active-tab {
        background: #1890ff;
        color: #fff;
        font-weight: 600;
      }
    }
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 8px;

    .ant-btn {
      color: rgba(255, 255, 255, 0.65);
      font-size: 12px;

      &:hover {
        color: #fff;
      }
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 260px;
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
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }

  .project-tree {
    flex: 1;
    overflow-y: auto;
    padding: 12px 8px;

    :deep(.ant-tree-node-selected) {
      background: #e6f7ff;
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

.stats-bar {
  padding: 10px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

  b {
    font-size: 16px;
  }
}

.detection-table {
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
}

.action-bar {
  padding: 12px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
