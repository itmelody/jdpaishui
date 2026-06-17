<template>
  <div class="rectification-analysis-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">隐患整治结果分析</h2>
    </div>

    <!-- 筛选区 -->
    <a-card :bordered="false" class="filter-card">
      <a-form :model="searchForm" layout="inline" class="filter-form">
        <a-form-item label="时间:">
          <a-range-picker
            v-model:value="searchForm.dateRange"
            :placeholder="['开始时间', '结束时间']"
            style="width: 280px"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <SearchOutlined /> 搜索
            </a-button>
            <a-button @click="handleExport">
              <DownloadOutlined /> 导出
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 数据表格 -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        row-key="id"
        size="small"
        :scroll="{ x: 2800 }"
        bordered
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue'

// 搜索表单
const searchForm = reactive({
  dateRange: [] as any[]
})

// 多级表头列定义
const columns = [
  {
    title: '地市',
    dataIndex: 'city',
    key: 'city',
    width: 80,
    fixed: 'left' as const
  },
  {
    title: '发现隐患数（个）',
    children: [
      { title: '总数', dataIndex: 'dangerTotal', key: 'dangerTotal', width: 70, align: 'center' as const },
      { title: '一级轻微', dataIndex: 'dangerLevel1', key: 'dangerLevel1', width: 85, align: 'center' as const },
      { title: '二级中等', dataIndex: 'dangerLevel2', key: 'dangerLevel2', width: 85, align: 'center' as const },
      { title: '三级严重', dataIndex: 'dangerLevel3', key: 'dangerLevel3', width: 85, align: 'center' as const },
      { title: '四级重大', dataIndex: 'dangerLevel4', key: 'dangerLevel4', width: 85, align: 'center' as const }
    ]
  },
  {
    title: '隐患管段总长（km）',
    children: [
      { title: '总数', dataIndex: 'dangerLenTotal', key: 'dangerLenTotal', width: 70, align: 'center' as const },
      { title: '一级轻微', dataIndex: 'dangerLenLevel1', key: 'dangerLenLevel1', width: 85, align: 'center' as const },
      { title: '二级中等', dataIndex: 'dangerLenLevel2', key: 'dangerLenLevel2', width: 85, align: 'center' as const },
      { title: '三级严重', dataIndex: 'dangerLenLevel3', key: 'dangerLenLevel3', width: 85, align: 'center' as const },
      { title: '四级重大', dataIndex: 'dangerLenLevel4', key: 'dangerLenLevel4', width: 85, align: 'center' as const }
    ]
  },
  {
    title: '结构隐患（个）',
    children: [
      { title: '破裂', dataIndex: 'struct_crack', key: 'struct_crack', width: 70, align: 'center' as const },
      { title: '变形', dataIndex: 'struct_deform', key: 'struct_deform', width: 70, align: 'center' as const },
      { title: '腐蚀', dataIndex: 'struct_corrosion', key: 'struct_corrosion', width: 70, align: 'center' as const },
      { title: '错口', dataIndex: 'struct_misalign', key: 'struct_misalign', width: 70, align: 'center' as const },
      { title: '起伏', dataIndex: 'struct_undulation', key: 'struct_undulation', width: 70, align: 'center' as const },
      { title: '脱节', dataIndex: 'struct_disconnect', key: 'struct_disconnect', width: 70, align: 'center' as const },
      { title: '接口材料\n脱落', dataIndex: 'struct_joint', key: 'struct_joint', width: 85, align: 'center' as const },
      { title: '支管错接', dataIndex: 'struct_branch', key: 'struct_branch', width: 80, align: 'center' as const },
      { title: '异物穿入', dataIndex: 'struct_foreign', key: 'struct_foreign', width: 80, align: 'center' as const },
      { title: '渗漏', dataIndex: 'struct_leakage', key: 'struct_leakage', width: 70, align: 'center' as const }
    ]
  },
  {
    title: '功能隐患（个）',
    children: [
      { title: '总数', dataIndex: 'funcTotal', key: 'funcTotal', width: 70, align: 'center' as const },
      { title: '沉积', dataIndex: 'func_sediment', key: 'func_sediment', width: 70, align: 'center' as const },
      { title: '障碍物', dataIndex: 'func_obstacle', key: 'func_obstacle', width: 75, align: 'center' as const },
      { title: '结垢', dataIndex: 'func_scale', key: 'func_scale', width: 70, align: 'center' as const },
      { title: '疏堵塌损', dataIndex: 'func_blockage', key: 'func_blockage', width: 85, align: 'center' as const },
      { title: '浮渣', dataIndex: 'func_scum', key: 'func_scum', width: 70, align: 'center' as const },
      { title: '树根', dataIndex: 'func_root', key: 'func_root', width: 70, align: 'center' as const }
    ]
  }
]

// 表格数据
const dataSource = ref([
  {
    id: 1,
    city: '建德市',
    dangerTotal: 0, dangerLevel1: 0, dangerLevel2: 0, dangerLevel3: 0, dangerLevel4: 0,
    dangerLenTotal: 0, dangerLenLevel1: 0, dangerLenLevel2: 0, dangerLenLevel3: 0, dangerLenLevel4: 0,
    struct_crack: 0, struct_deform: 0, struct_corrosion: 0, struct_misalign: 0, struct_undulation: 0,
    struct_disconnect: 0, struct_joint: 0, struct_branch: 0, struct_foreign: 0, struct_leakage: 0,
    funcTotal: 0, func_sediment: 0, func_obstacle: 0, func_scale: 0, func_blockage: 0, func_scum: 0, func_root: 0
  }
])

// 操作方法
const handleSearch = () => {
  message.info('执行搜索...')
}

const handleExport = () => {
  message.success('正在导出隐患整治分析数据...')
}
</script>

<style scoped lang="scss">
.rectification-analysis-page {
  .page-header {
    margin-bottom: 16px;

    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  .filter-card {
    margin-bottom: 12px;

    .filter-form {
      :deep(.ant-form-item) {
        margin-bottom: 0;
      }

      :deep(.ant-form-item-label) {
        label {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .table-card {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #f5f7fa;
        font-weight: 600;
        font-size: 12px;
        color: #333;
        text-align: center;
        white-space: pre-line;
        padding: 8px 4px;
      }

      .ant-table-thead > tr:first-child > th {
        background-color: #e8edf3;
        font-size: 13px;
      }

      .ant-table-tbody > tr > td {
        text-align: center;
        font-size: 13px;
        color: #333;
      }

      .ant-table-tbody > tr:hover > td {
        background-color: #e6f7ff;
      }
    }
  }
}
</style>
