<template>
  <div class="progress-stats-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">排查进度情况统计</h2>
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
        :scroll="{ x: 2200 }"
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
    title: '创建作业\n与检查记录',
    children: [
      { title: '创建作业数\n（个）', dataIndex: 'taskCount', key: 'taskCount', width: 100, align: 'center' as const },
      { title: '检查记录数', dataIndex: 'recordCount', key: 'recordCount', width: 100, align: 'center' as const },
      { title: '检查管段数\n（段）', dataIndex: 'sectionCount', key: 'sectionCount', width: 100, align: 'center' as const },
      { title: '检查管段\n总长（km）', dataIndex: 'sectionLength', key: 'sectionLength', width: 100, align: 'center' as const }
    ]
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
    title: '已修复隐患',
    children: [
      { title: '隐患数\n（个）', dataIndex: 'fixedCount', key: 'fixedCount', width: 80, align: 'center' as const },
      { title: '隐患长度\n（km）', dataIndex: 'fixedLength', key: 'fixedLength', width: 90, align: 'center' as const }
    ]
  },
  {
    title: '列入观察隐患',
    children: [
      { title: '隐患数\n（个）', dataIndex: 'observeCount', key: 'observeCount', width: 80, align: 'center' as const },
      { title: '隐患长度\n（km）', dataIndex: 'observeLength', key: 'observeLength', width: 90, align: 'center' as const }
    ]
  },
  {
    title: '未修复隐患',
    children: [
      { title: '隐患数\n（个）', dataIndex: 'unfixedCount', key: 'unfixedCount', width: 80, align: 'center' as const },
      { title: '隐患长度\n（km）', dataIndex: 'unfixedLength', key: 'unfixedLength', width: 90, align: 'center' as const }
    ]
  }
]

// 表格数据
const dataSource = ref([
  {
    id: 1,
    city: '建德市',
    taskCount: 3,
    recordCount: 1,
    sectionCount: 1628,
    sectionLength: 46.24,
    dangerTotal: 0,
    dangerLevel1: 0,
    dangerLevel2: 0,
    dangerLevel3: 0,
    dangerLevel4: 0,
    dangerLenTotal: 0,
    dangerLenLevel1: 0,
    dangerLenLevel2: 0,
    dangerLenLevel3: 0,
    dangerLenLevel4: 0,
    fixedCount: 0,
    fixedLength: 0,
    observeCount: 0,
    observeLength: 0,
    unfixedCount: 0,
    unfixedLength: 0
  }
])

// 操作方法
const handleSearch = () => {
  message.info('执行搜索...')
}

const handleExport = () => {
  message.success('正在导出排查进度数据...')
}
</script>

<style scoped lang="scss">
.progress-stats-page {
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
