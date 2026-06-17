<template>
  <div class="engineering-management">
    <a-layout>
      <!-- 左侧菜单 -->
      <a-layout-sider width="180" :style="{ background: '#fff' }">
        <a-menu v-model:selectedKeys="selectedMenu" mode="inline" :items="menuItems" />
      </a-layout-sider>

      <!-- 右侧内容区 -->
      <a-layout-content class="content-wrapper">
        <a-tabs v-model:activeKey="activeTab" :bordered="false" class="main-tabs">
          <a-tab-pane key="projectLedger" tab="工程项目台账">
            <!-- 筛选条件 -->
        <a-form :model="searchForm" layout="inline" class="search-form">
          <a-row :gutter="[12, 12]" align="middle" style="width:100%">
            <a-col :span="4">
              <a-form-item label="归属地区:">
                <a-select v-model:value="searchForm.city" placeholder="请选择" allow-clear style="width:100%">
                  <a-select-option value="hangzhou">杭州市</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-select v-model:value="searchForm.district" placeholder="请选择" allow-clear style="width:100%">
                  <a-select-option value="jiande">建德市</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="处理状态:">
                <a-select v-model:value="searchForm.status" placeholder="请选择" allow-clear style="width:100%">
                  <a-select-option value="pending">待处理</a-select-option>
                  <a-select-option value="processed">已处理</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item label="归属年度:">
                <a-input v-model:value="searchForm.year" placeholder="" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="是否纳入年考核:">
                <a-select v-model:value="searchForm.assessment" placeholder="请选择" allow-clear style="width:100%">
                  <a-select-option value="yes">是</a-select-option>
                  <a-select-option value="no">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-space>
                <a-button @click="showAdvanced = !showAdvanced">
                  {{ showAdvanced ? '收起' : '展开' }}
                  <UpOutlined v-if="showAdvanced" /><DownOutlined v-else />
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>

        <!-- 批量操作按钮 -->
        <div class="batch-actions">
          <a-space>
            <a-button @click="handleBatch('confirm')">批量确认</a-button>
            <a-button @click="handleBatch('reject')">批量驳回</a-button>
            <a-button @click="handleBatch('delete')">批量删除</a-button>
            <a-button @click="handleBatch('export')">批量导出</a-button>
          </a-space>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
        </div>

        <!-- 数据表格 -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          row-key="id"
          :row-selection="{ selectedRowKeys: selectedRows, onChange: onSelectChange }"
          :scroll="{ x: 1800 }"
          @change="handleTableChange"
          class="data-table"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'projectName'">
              <span>
                <StarFilled v-if="record.isImportant" style="color: #faad14; margin-right: 4px;" />
                {{ record.projectName }}
              </span>
            </template>
            <template v-if="column.key === 'progress'">
              <span :style="{ color: parseFloat(record.progress) >= 100 ? '#52c41a' : parseFloat(record.progress) > 0 ? '#1890ff' : '#999', fontWeight: 600 }">
                {{ record.progress }}
              </span>
            </template>
            <template v-if="column.key === 'handleStatus'">
              <span :style="{ color: record.handleStatus === '本部门已处理' ? '#52c41a' : '#f5222d', fontWeight: 600 }">
                {{ record.handleStatus }}
              </span>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="handleView(record)">查看</a>
                <a-divider type="vertical" />
                <a @click="handleLink(record)">关联谋划项目</a>
                <a-divider type="vertical" />
                <a @click="handleDispose(record)">处置</a>
              </a-space>
            </template>
          </template>
        </a-table>
          </a-tab-pane>

          <a-tab-pane key="constructionSupervision" tab="施工过程监管">
            <a-empty description="施工过程监管功能开发中" />
          </a-tab-pane>

          <a-tab-pane key="qualitySafety" tab="质量安全检查">
            <a-empty description="质量安全检查功能开发中" />
          </a-tab-pane>

          <a-tab-pane key="completionAcceptance" tab="竣工验收">
            <a-empty description="竣工验收功能开发中" />
          </a-tab-pane>

          <a-tab-pane key="archiveFiling" tab="工程档案归档">
            <a-empty description="工程档案归档功能开发中" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import {
  SearchOutlined, StarFilled, DownOutlined, UpOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const selectedMenu = ref<string[]>(['projectLedger'])
const activeTab = ref<string>('projectLedger')
const showAdvanced = ref(false)
const selectedRows = ref<string[]>([])

// 监听菜单选择，联动标签页
watch(selectedMenu, (keys) => {
  if (keys.length > 0) {
    activeTab.value = keys[0]
  }
})

// 监听标签页切换，联动菜单
watch(activeTab, (key) => {
  selectedMenu.value = [key]
})

const menuItems: MenuProps['items'] = [
  { key: 'projectLedger', label: '工程项目台账' },
  { key: 'constructionSupervision', label: '施工过程监管' },
  { key: 'qualitySafety', label: '质量安全检查' },
  { key: 'completionAcceptance', label: '竣工验收' },
  { key: 'archiveFiling', label: '工程档案归档' }
]

const searchForm = reactive({
  city: 'hangzhou' as string | undefined,
  district: 'jiande' as string | undefined,
  status: undefined as string | undefined,
  year: '',
  assessment: undefined as string | undefined,
  planDesign: undefined as string | undefined,
  relatedProject: undefined as string | undefined
})

const columns = [
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200, fixed: 'left' },
  { title: '项目起止时间', dataIndex: 'projectTime', key: 'projectTime', width: 160 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 120 },
  { title: '责任单位', dataIndex: 'responsibleUnit', key: 'responsibleUnit', width: 130 },
  { title: '本年度累计投资额\n(万元)', dataIndex: 'investAmount', key: 'investAmount', width: 120, align: 'center' },
  { title: '本年度累计建设\n雨水管网(公里)', dataIndex: 'builtPipe', key: 'builtPipe', width: 120, align: 'center' },
  { title: '本年度计划投资额\n(万元)', dataIndex: 'planInvest', key: 'planInvest', width: 120, align: 'center' },
  { title: '本年度计划建设\n雨水管网(公里)', dataIndex: 'planPipe', key: 'planPipe', width: 120, align: 'center' },
  { title: '完成本年度目标\n任务比例', dataIndex: 'progress', key: 'progress', width: 120, align: 'center' },
  { title: '审核进度', dataIndex: 'auditStatus', key: 'auditStatus', width: 110, align: 'center' },
  { title: '处理状态', dataIndex: 'handleStatus', key: 'handleStatus', width: 120, align: 'center' },
  { title: '关联谋划\n项目数', dataIndex: 'relatedCount', key: 'relatedCount', width: 90, align: 'center' },
  { title: '操作', key: 'action', width: 200, fixed: 'right' }
]

const dataSource = ref([
  { id: 1, isImportant: true, projectName: '建德市随路新建雨水管网', projectTime: '2026-01至2026-12', region: '杭州市建德市', responsibleUnit: '建德市住建局', investAmount: '46.00', builtPipe: '0.46', planInvest: '46.00', planPipe: '0.46', progress: '100.00%', auditStatus: '省级待确认', handleStatus: '本部门待处理', relatedCount: 0 },
  { id: 2, isImportant: false, projectName: '建德市梅城镇污水管网改造工程', projectTime: '2026-03至2026-12', region: '杭州市建德市', responsibleUnit: '建德市住建局', investAmount: '20.00', builtPipe: '0.23', planInvest: '20.00', planPipe: '0.23', progress: '0%', auditStatus: '省级已确认', handleStatus: '本部门已处理', relatedCount: 0 },
  { id: 3, isImportant: true, projectName: '建德市寿昌镇排水设施提升工程', projectTime: '2026-01至2027-06', region: '杭州市建德市', responsibleUnit: '建德市政府', investAmount: '85.50', builtPipe: '1.20', planInvest: '100.00', planPipe: '1.50', progress: '85.50%', auditStatus: '省级待确认', handleStatus: '本部门待处理', relatedCount: 0 },
  { id: 4, isImportant: false, projectName: '建德市大同镇雨污分流改造', projectTime: '2026-02至2026-11', region: '杭州市建德市', responsibleUnit: '建德市住建局', investAmount: '32.00', builtPipe: '0.55', planInvest: '40.00', planPipe: '0.68', progress: '80.00%', auditStatus: '省级已确认', handleStatus: '本部门已处理', relatedCount: 0 },
  { id: 5, isImportant: false, projectName: '建德市乾潭镇污水处理厂扩建', projectTime: '2026-01至2027-12', region: '杭州市建德市', responsibleUnit: '建德市政府', investAmount: '120.00', builtPipe: '0.00', planInvest: '200.00', planPipe: '2.00', progress: '60.00%', auditStatus: '省级待确认', handleStatus: '本部门待处理', relatedCount: 0 },
  { id: 6, isImportant: true, projectName: '建德市新安江街道雨水管网新建', projectTime: '2026-03至2026-10', region: '杭州市建德市', responsibleUnit: '建德市住建局', investAmount: '55.00', builtPipe: '0.80', planInvest: '55.00', planPipe: '0.80', progress: '100.00%', auditStatus: '省级已确认', handleStatus: '本部门已处理', relatedCount: 0 },
  { id: 7, isImportant: false, projectName: '建德市洋溪街道排水管网维修', projectTime: '2026-04至2026-09', region: '杭州市建德市', responsibleUnit: '建德市住建局', investAmount: '18.00', builtPipe: '0.30', planInvest: '25.00', planPipe: '0.40', progress: '72.00%', auditStatus: '省级待确认', handleStatus: '本部门待处理', relatedCount: 0 },
  { id: 8, isImportant: false, projectName: '建德市莲花镇农村污水治理', projectTime: '2026-01至2026-12', region: '杭州市建德市', responsibleUnit: '建德市政府', investAmount: '42.00', builtPipe: '0.65', planInvest: '50.00', planPipe: '0.75', progress: '84.00%', auditStatus: '省级已确认', handleStatus: '本部门已处理', relatedCount: 0 },
  { id: 9, isImportant: true, projectName: '建德市航头镇集镇排水管网', projectTime: '2026-02至2026-11', region: '杭州市建德市', responsibleUnit: '建德市住建局', investAmount: '28.00', builtPipe: '0.42', planInvest: '35.00', planPipe: '0.50', progress: '80.00%', auditStatus: '省级待确认', handleStatus: '本部门待处理', relatedCount: 0 },
  { id: 10, isImportant: false, projectName: '建德市下涯镇污水管网延伸', projectTime: '2026-03至2027-03', region: '杭州市建德市', responsibleUnit: '建德市住建局', investAmount: '65.00', builtPipe: '0.95', planInvest: '80.00', planPipe: '1.20', progress: '81.25%', auditStatus: '省级已确认', handleStatus: '本部门已处理', relatedCount: 0 }
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 10,
  showSizeChanger: false,
  showTotal: (total: number) => `总数：${total}`
})

const onSelectChange = (keys: string[]) => {
  selectedRows.value = keys
}

const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待实现')
}

const handleBatch = (type: string) => {
  if (selectedRows.value.length === 0) {
    message.warning('请先选择数据')
    return
  }
  message.success(`批量${type}操作待实现，已选${selectedRows.value.length}条`)
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handleView = (record: any) => {
  message.info(`查看: ${record.projectName}`)
}

const handleLink = (record: any) => {
  message.info(`关联谋划项目: ${record.projectName}`)
}

const handleDispose = (record: any) => {
  message.info(`处置: ${record.projectName}`)
}
</script>

<style scoped lang="scss">
.engineering-management {
  .ant-layout {
    background: #fff;
  }

  .content-wrapper {
    padding: 0 16px;
    background: #fff;
  }

  .main-tabs {
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

  .batch-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .data-table {
    :deep(.ant-table) {
      font-size: 13px;
    }

    :deep(.ant-table-thead > tr > th) {
      background: #E3F2FD;
      font-weight: 600;
      font-size: 12px;
      padding: 10px 8px;
      white-space: pre-line;
      text-align: center;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
    }
  }
}
</style>
<template>
  <div class="engineering-management">
    <a-card title="工程管理" :bordered="false">
      <div class="empty-state">
        <a-empty description="工程管理内容待开发" />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 工程管理页面
</script>

<style scoped lang="scss">
.engineering-management {
  .empty-state {
    padding: 60px 0;
    text-align: center;
  }
}
</style>
