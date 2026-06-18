<template>
  <div class="drainage-user">
    <!-- 左侧菜单 -->
    <a-layout>
      <a-layout-sider width="200" :style="{ background: '#fff' }">
        <a-menu
          v-model:selectedKeys="selectedMenu"
          mode="inline"
          :items="menuItems"
          @click="handleMenuClick"
        />
      </a-layout-sider>
      
      <!-- 右侧内容区 -->
      <a-layout-content class="content-wrapper">
        <a-tabs v-model:activeKey="activeTab" :bordered="false">
          <!-- 排水户档案库标签页 -->
          <a-tab-pane key="archive" tab="排水户档案库">
            <a-card :bordered="false" class="main-card">
          <!-- 搜索表单 -->
          <a-form :model="searchForm" layout="inline" class="search-form">
            <a-row :gutter="[16, 16]">
              <a-col :span="6">
                <a-form-item label="企业名称:">
                  <a-input v-model:value="searchForm.companyName" placeholder="请输入" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="所属地区:">
                  <a-select v-model:value="searchForm.region" placeholder="请选择" allow-clear>
                    <a-select-option value="zhejiang">浙江省 / 杭州市 / 建德市</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="统一社会信用代码:">
                  <a-input v-model:value="searchForm.creditCode" placeholder="请输入" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="所属行业:">
                  <a-select v-model:value="searchForm.industry" placeholder="请选择" allow-clear>
                    <a-select-option value="food">食品制造</a-select-option>
                    <a-select-option value="medical">医疗卫生</a-select-option>
                    <a-select-option value="beverage">饮料制造</a-select-option>
                    <a-select-option value="cultural">文化创意</a-select-option>
                    <a-select-option value="rubber">橡胶制品</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="是否列入环保排污名录:">
                  <a-select v-model:value="searchForm.envList" placeholder="请选择" allow-clear>
                    <a-select-option value="yes">是</a-select-option>
                    <a-select-option value="no">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="排水许可编号:">
                  <a-input v-model:value="searchForm.permitNumber" placeholder="请输入" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="发证机关:">
                  <a-input v-model:value="searchForm.issuingAuthority" placeholder="请输入" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="证书状态:">
                  <a-select v-model:value="searchForm.certificateStatus" placeholder="请选择" allow-clear>
                    <a-select-option value="valid">有效</a-select-option>
                    <a-select-option value="expired">过期</a-select-option>
                    <a-select-option value="suspended">暂停</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="排污许可编号:">
                  <a-input v-model:value="searchForm.pollutionPermitNumber" placeholder="请输入" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="排水户状态:">
                  <a-select v-model:value="searchForm.status" placeholder="请选择" allow-clear>
                    <a-select-option value="active">正常</a-select-option>
                    <a-select-option value="inactive">停用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="纳入城镇污水处理厂名称:">
                  <a-input v-model:value="searchForm.sewagePlant" placeholder="请输入" allow-clear />
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

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <a-space>
              <a-button type="primary" @click="handleAdd">
                <template #icon><PlusOutlined /></template>
                新增
              </a-button>
              <a-button @click="handleDownloadTemplate">
                <template #icon><DownloadOutlined /></template>
                下载模板
              </a-button>
              <a-button type="warning" @click="handleBatchImport">
                <template #icon><UploadOutlined /></template>
                批量导入
              </a-button>
              <a-button danger @click="handleBatchDelete">
                <template #icon><DeleteOutlined /></template>
                批量删除
              </a-button>
            </a-space>
          </div>

          <!-- 数据表格 -->
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :row-selection="rowSelection"
            row-key="id"
            @change="handleTableChange"
            class="data-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
                  <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
                  <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
          </a-tab-pane>
          
          <!-- 排水许可管理标签页 -->
          <a-tab-pane key="permit" tab="排水许可管理">
            <PermitManagement />
          </a-tab-pane>
          
          <!-- 在线水质监测标签页 -->
          <a-tab-pane key="monitoring" tab="在线水质监测">
            <WaterQualityMonitor />
          </a-tab-pane>
          
          <!-- 执法巡检登记标签页 -->
          <a-tab-pane key="inspection" tab="执法巡检登记">
            <InspectionRegistration />
          </a-tab-pane>
          
          <!-- 违规排污取证标签页 -->
          <a-tab-pane key="violation" tab="违规排污取证">
            <DevelopmentPlaceholder />
          </a-tab-pane>
          
          <!-- 雨污分流整改督办标签页 -->
          <a-tab-pane key="rectification" tab="雨污分流整改督办">
            <DevelopmentPlaceholder />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined, PlusOutlined, DownloadOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import DevelopmentPlaceholder from '../inspection-maintenance/DevelopmentPlaceholder.vue'
import PermitManagement from './permit-management.vue'
import WaterQualityMonitor from './water-quality-monitor.vue'
import InspectionRegistration from './inspection-registration.vue'

// 左侧菜单配置
const selectedMenu = ref<string[]>(['archive'])
const menuItems = [
  { key: 'archive', label: '排水户档案库' },
  { key: 'permit', label: '排水许可管理' },
  { key: 'monitoring', label: '在线水质监测' },
  { key: 'inspection', label: '执法巡检登记' },
  { key: 'violation', label: '违规排污取证' },
  { key: 'rectification', label: '雨污分流整改督办' }
]

// 当前激活的标签页
const activeTab = ref<string>('archive')

// 搜索表单
const searchForm = reactive({
  companyName: '',
  region: undefined,
  creditCode: '',
  industry: undefined,
  envList: undefined,
  permitNumber: '',
  issuingAuthority: '',
  certificateStatus: undefined,
  pollutionPermitNumber: '',
  status: undefined,
  sewagePlant: ''
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { title: '企业名称', dataIndex: 'companyName', key: 'companyName', width: 200 },
  { title: '所属地区', dataIndex: 'region', key: 'region', width: 120 },
  { title: '详细地址', dataIndex: 'address', key: 'address', width: 200 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 180 },
  { title: '所属行业', dataIndex: 'industry', key: 'industry', width: 120 },
  { title: '法定代表人', dataIndex: 'legalPerson', key: 'legalPerson', width: 100 },
  { title: '法人联系方式', dataIndex: 'contact', key: 'contact', width: 120 },
  { title: '排水户负责人', dataIndex: 'manager', key: 'manager', width: 120 },
  { title: '操作', key: 'action', fixed: 'right', width: 150 }
]

// 模拟数据
const dataSource = ref([
  {
    id: 1,
    index: 1,
    companyName: '农夫山泉（建德）新安江饮品有限公司',
    region: '杭州市 建德市',
    address: '建德市新安江街道朱家埠',
    creditCode: '91330182MA2GMGA45D',
    industry: '食品制造',
    legalPerson: '郭振',
    contact: '138****1234',
    manager: '张经理'
  },
  {
    id: 2,
    index: 2,
    companyName: '杭州市第七人民医院',
    region: '杭州市 建德市',
    address: '建德市寿昌镇江南路66号',
    creditCode: '47011667333010611A5201',
    industry: '医疗卫生',
    legalPerson: '李涛',
    contact: '139****5678',
    manager: '王主任'
  },
  {
    id: 3,
    index: 3,
    companyName: '青岛啤酒（杭州）有限公司',
    region: '杭州市 建德市',
    address: '建德市新安江街道艾溪路999号',
    creditCode: '330182000014239',
    industry: '饮料制造',
    legalPerson: '冯义祥',
    contact: '137****9012',
    manager: '刘厂长'
  },
  {
    id: 4,
    index: 4,
    companyName: '杭州玺匠文化创意股份有限公司',
    region: '杭州市 建德市',
    address: '建德市洋溪街道雅鼎路777号',
    creditCode: '913301000639602521',
    industry: '文化创意',
    legalPerson: '俞光',
    contact: '136****3456',
    manager: '陈总'
  },
  {
    id: 5,
    index: 5,
    companyName: '中策橡胶（建德）有限公司',
    region: '杭州市 建德市',
    address: '建德市下涯镇春秋村',
    creditCode: '913301826970926373',
    industry: '橡胶制品',
    legalPerson: '沈金荣',
    contact: '135****7890',
    manager: '赵经理'
  },
  {
    id: 6,
    index: 6,
    companyName: '建德市第四人民医院',
    region: '杭州市 建德市',
    address: '建德市寿昌镇二桥路1号',
    creditCode: '123301824704837801',
    industry: '医疗卫生',
    legalPerson: '饶圣艺',
    contact: '134****2345',
    manager: '孙院长'
  },
  {
    id: 7,
    index: 7,
    companyName: '浙江致中和实业有限公司',
    region: '杭州市 建德市',
    address: '建德市杨村桥镇新安江路1915号',
    creditCode: '91330182566058260E',
    industry: '食品制造',
    legalPerson: '余倩',
    contact: '133****6789',
    manager: '周总监'
  },
  {
    id: 8,
    index: 8,
    companyName: '农夫山泉（建德）新安江饮用水有限公司',
    region: '杭州市 建德市',
    address: '建德市新安江街道梅坪村',
    creditCode: '913301823218699547',
    industry: '饮料制造',
    legalPerson: '郭振',
    contact: '132****0123',
    manager: '吴经理'
  }
])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 13,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 行选择配置
const selectedRowKeys = ref<number[]>([])
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  }
}

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  // 更新选中的菜单项
  selectedMenu.value = [key]
  activeTab.value = key
}

// 搜索处理
const handleSearch = () => {
  console.log('Search form:', searchForm)
  message.success('搜索功能待实现')
}

// 重置处理
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    (searchForm as any)[key] = undefined
  })
  message.info('已重置搜索条件')
}

// 新增处理
const handleAdd = () => {
  message.info('新增功能待实现')
}

// 下载模板处理
const handleDownloadTemplate = () => {
  message.info('下载模板功能待实现')
}

// 批量导入处理
const handleBatchImport = () => {
  message.info('批量导入功能待实现')
}

// 批量删除处理
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的记录')
    return
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条记录吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('批量删除功能待实现')
    }
  })
}

// 查看处理
const handleView = (record: any) => {
  message.info(`查看企业：${record.companyName}`)
}

// 删除处理
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除企业 "${record.companyName}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('删除功能待实现')
    }
  })
}

// 编辑处理
const handleEdit = (record: any) => {
  message.info(`编辑企业：${record.companyName}`)
}

// 表格变化处理
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.drainage-user {
  height: 100%;
  
  .content-wrapper {
    padding: 0 16px;
    background: #f0f2f5;
  }
  
  .main-card {
    min-height: calc(100vh - 180px);
    
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
    
    .action-buttons {
      margin-bottom: 16px;
    }
    
    .data-table {
      :deep(.ant-table) {
        font-size: 14px;
      }
    }
  }
}
</style>
