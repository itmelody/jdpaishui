<template>
  <a-card :bordered="false" class="permit-card">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-row :gutter="[16, 16]">
        <a-col :span="6">
          <a-form-item label="申请单位:">
            <a-input v-model:value="searchForm.applicant" placeholder="请输入" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="所属地区:">
            <a-select v-model:value="searchForm.region" placeholder="请选择" allow-clear>
              <a-select-option value="jiande">浙江省 / 杭州市 / 建德市</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="统一社会信用代码:">
            <a-input v-model:value="searchForm.creditCode" placeholder="请输入" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="污水产生情况:">
            <a-select v-model:value="searchForm.sewageCondition" placeholder="请选择" allow-clear>
              <a-select-option value="normal">正常</a-select-option>
              <a-select-option value="abnormal">异常</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="是否列入重点排水户:">
            <a-select v-model:value="searchForm.keyDrainageUser" placeholder="请选择" allow-clear>
              <a-select-option value="yes">是</a-select-option>
              <a-select-option value="no">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="有效期限:">
            <a-select v-model:value="searchForm.validityPeriod" placeholder="请选择" allow-clear>
              <a-select-option value="5">5年</a-select-option>
              <a-select-option value="3">3年</a-select-option>
              <a-select-option value="1">1年</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="排水户是否列入重点排污名录:">
            <a-select v-model:value="searchForm.pollutionList" placeholder="请选择" allow-clear>
              <a-select-option value="yes">是</a-select-option>
              <a-select-option value="no">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="发证日期:">
            <a-range-picker v-model:value="searchForm.issueDateRange" style="width: 200px" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="证书办理事项:">
            <a-select v-model:value="searchForm.certificateMatter" placeholder="请选择" allow-clear>
              <a-select-option value="new">新办</a-select-option>
              <a-select-option value="renew">续办</a-select-option>
              <a-select-option value="change">变更</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="证书状态:">
            <a-select v-model:value="searchForm.certificateStatus" placeholder="请选择" allow-clear>
              <a-select-option value="valid">有效</a-select-option>
              <a-select-option value="expired">过期</a-select-option>
              <a-select-option value="expiring">即将过期</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <a-checkbox v-model:checked="searchForm.expiringSoon">60天内即将超期证书</a-checkbox>
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
        <a-button type="primary" @click="handleAdd">新增</a-button>
        <a-button style="background: #1565C0; color: #fff; border-color: #1565C0;" @click="handleSendWarning">发送预警提醒</a-button>
        <a-button style="background: #4CAF50; color: #fff; border-color: #4CAF50;" @click="handleExport">导出</a-button>
      </a-space>
    </div>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :row-selection="rowSelection"
      row-key="id"
      :scroll="{ x: 1800 }"
      @change="handleTableChange"
      class="data-table"
      size="small"
    >
      <template #headerCell="{ column }">
        <span>{{ column.title }}</span>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'keyDrainageUser'">
          <span>{{ record.keyDrainageUser ? '是' : '否' }}</span>
        </template>
        <template v-if="column.key === 'keyDischarge'">
          <span>{{ record.keyDischarge || '-' }}</span>
        </template>
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

// 搜索表单
const searchForm = reactive({
  applicant: '',
  region: 'jiande' as string | undefined,
  creditCode: '',
  sewageCondition: undefined as string | undefined,
  keyDrainageUser: undefined as string | undefined,
  validityPeriod: undefined as string | undefined,
  pollutionList: undefined as string | undefined,
  issueDateRange: undefined as any,
  certificateMatter: undefined as string | undefined,
  certificateStatus: undefined as string | undefined,
  expiringSoon: false
})

// 表格列配置
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, fixed: 'left' },
  { title: '地市', dataIndex: 'city', key: 'city', width: 80 },
  { title: '区县', dataIndex: 'district', key: 'district', width: 80 },
  { title: '申请单位', dataIndex: 'applicant', key: 'applicant', width: 240 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 },
  { title: '证书编码', dataIndex: 'certNo', key: 'certNo', width: 160 },
  { title: '有效期起', dataIndex: 'validFrom', key: 'validFrom', width: 110 },
  { title: '有效期止', dataIndex: 'validTo', key: 'validTo', width: 110 },
  { title: '有效期限(年)', dataIndex: 'validityYears', key: 'validityYears', width: 100, align: 'center' },
  { title: '发证机关', dataIndex: 'issuingAuthority', key: 'issuingAuthority', width: 130 },
  { title: '列入重点排水户', dataIndex: 'keyDrainageUser', key: 'keyDrainageUser', width: 120, align: 'center' },
  { title: '排水户重点排', dataIndex: 'keyDischarge', key: 'keyDischarge', width: 120 },
  { title: '操作', key: 'action', fixed: 'right', width: 160 }
]

// 模拟数据
const dataSource = ref([
  { id: 1, index: 1, city: '杭州市', district: '建德市', applicant: '农夫山泉（建德）新安江饮品有限公司', creditCode: '92330182MA28RFH39G', certNo: '浙建排字第26021号', validFrom: '2024-03-15', validTo: '2029-03-14', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: true, keyDischarge: '' },
  { id: 2, index: 2, city: '杭州市', district: '建德市', applicant: '农夫山泉（建德更楼）饮料有限公司', creditCode: '91330182MADJFH3F8C', certNo: '浙建排字第2606002号', validFrom: '2026-06-08', validTo: '2027-06-07', validityYears: 1, issuingAuthority: '建德市住建局', keyDrainageUser: true, keyDischarge: '' },
  { id: 3, index: 3, city: '杭州市', district: '建德市', applicant: '青岛啤酒（杭州）有限公司', creditCode: '91330182MA27WBCD5E', certNo: '浙建排字第26033号', validFrom: '2023-09-01', validTo: '2028-08-31', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: true, keyDischarge: '' },
  { id: 4, index: 4, city: '杭州市', district: '建德市', applicant: '杭州玺匠文化创意股份有限公司', creditCode: '913301000639602521', certNo: '浙建排字第26044号', validFrom: '2024-01-10', validTo: '2029-01-09', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: true, keyDischarge: '' },
  { id: 5, index: 5, city: '杭州市', district: '建德市', applicant: '中策橡胶（建德）有限公司', creditCode: '913301826970926373', certNo: '浙建排字第26055号', validFrom: '2023-06-20', validTo: '2028-06-19', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: false, keyDischarge: '' },
  { id: 6, index: 6, city: '杭州市', district: '建德市', applicant: '浙江致中和实业有限公司', creditCode: '91330182566058260E', certNo: '浙建排字第26066号', validFrom: '2024-05-15', validTo: '2029-05-14', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: false, keyDischarge: '' },
  { id: 7, index: 7, city: '杭州市', district: '建德市', applicant: '杭州市第七人民医院', creditCode: '47011667333010611A', certNo: '浙建排字第26077号', validFrom: '2023-11-01', validTo: '2028-10-31', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: false, keyDischarge: '' },
  { id: 8, index: 8, city: '杭州市', district: '建德市', applicant: '建德市第四人民医院', creditCode: '123301824704837801', certNo: '浙建排字第26088号', validFrom: '2024-07-20', validTo: '2029-07-19', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: false, keyDischarge: '' },
  { id: 9, index: 9, city: '杭州市', district: '建德市', applicant: '农夫山泉（建德）新安江饮用水有限公司', creditCode: '913301823218699547', certNo: '浙建排字第26099号', validFrom: '2023-04-10', validTo: '2028-04-09', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: false, keyDischarge: '' },
  { id: 10, index: 10, city: '杭州市', district: '建德市', applicant: '建德南方水泥有限公司', creditCode: '91330182799904312X', certNo: '浙建排字第260100号', validFrom: '2024-02-28', validTo: '2029-02-27', validityYears: 5, issuingAuthority: '建德市住建局', keyDrainageUser: false, keyDischarge: '' }
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

// 事件处理
const handleSearch = () => {
  console.log('Search:', searchForm)
  message.success('搜索功能待实现')
}

const handleReset = () => {
  searchForm.applicant = ''
  searchForm.region = undefined
  searchForm.creditCode = ''
  searchForm.sewageCondition = undefined
  searchForm.keyDrainageUser = undefined
  searchForm.validityPeriod = undefined
  searchForm.pollutionList = undefined
  searchForm.issueDateRange = undefined
  searchForm.certificateMatter = undefined
  searchForm.certificateStatus = undefined
  searchForm.expiringSoon = false
  message.info('已重置搜索条件')
}

const handleAdd = () => {
  message.info('新增功能待实现')
}

const handleSendWarning = () => {
  message.info('发送预警提醒功能待实现')
}

const handleExport = () => {
  message.info('导出功能待实现')
}

const handleView = (record: any) => {
  message.info(`查看：${record.applicant}`)
}

const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 "${record.applicant}" 的许可记录吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      message.success('删除功能待实现')
    }
  })
}

const handleEdit = (record: any) => {
  message.info(`编辑：${record.applicant}`)
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}
</script>

<style scoped lang="scss">
.permit-card {
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
