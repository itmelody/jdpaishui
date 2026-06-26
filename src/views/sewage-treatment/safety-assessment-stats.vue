<template>
  <div class="safety-assessment-stats-page">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="search-form">
      <a-form-item label="评估年份:">
        <a-select v-model:value="searchForm.evalYear" style="width: 200px;">
          <a-select-option value="2026">2026</a-select-option>
          <a-select-option value="2025">2025</a-select-option>
          <a-select-option value="2024">2024</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      row-key="id"
      size="small"
      :default-expand-all-rows="true"
      class="data-table"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 搜索表单
const searchForm = reactive({
  evalYear: '2026'
})

// 表格列配置
const columns = [
  { title: '区县', dataIndex: 'city', key: 'city', width: 120, align: 'center' as const, fixed: 'left' as const },
  { title: '发布安评企业数', dataIndex: 'publishedCount', key: 'publishedCount', width: 130, align: 'center' as const },
  { title: '完成安评企业数', dataIndex: 'completedCount', key: 'completedCount', width: 130, align: 'center' as const },
  { title: '发现隐患企业数', dataIndex: 'dangerCompanyCount', key: 'dangerCompanyCount', width: 130, align: 'center' as const },
  { title: '发现隐患总数', dataIndex: 'dangerTotalCount', key: 'dangerTotalCount', width: 120, align: 'center' as const },
  { title: '未整改隐患数', dataIndex: 'unrectifiedCount', key: 'unrectifiedCount', width: 120, align: 'center' as const },
  { title: '一般隐患', dataIndex: 'generalDanger', key: 'generalDanger', width: 100, align: 'center' as const },
  { title: '较大隐患', dataIndex: 'largerDanger', key: 'largerDanger', width: 100, align: 'center' as const },
  { title: '重大隐患', dataIndex: 'majorDanger', key: 'majorDanger', width: 100, align: 'center' as const },
  { title: '发布安评任务总数', dataIndex: 'publishedTaskCount', key: 'publishedTaskCount', width: 140, align: 'center' as const },
  { title: '完成安评任务总数', dataIndex: 'completedTaskCount', key: 'completedTaskCount', width: 140, align: 'center' as const },
  { title: '配套管网安评任务数', dataIndex: 'pipeTaskCount', key: 'pipeTaskCount', width: 140, align: 'center' as const },
  { title: '配套管网已完成任务数', dataIndex: 'pipeCompletedCount', key: 'pipeCompletedCount', width: 150, align: 'center' as const },
  { title: '污水厂安评任务总数', dataIndex: 'plantTaskCount', key: 'plantTaskCount', width: 140, align: 'center' as const },
  { title: '污水厂已完成任务数', dataIndex: 'plantCompletedCount', key: 'plantCompletedCount', width: 140, align: 'center' as const }
]

// 表格数据
const dataSource = ref([
  {
    id: 'province', city: '建德市', publishedCount: 9, completedCount: 2,
    dangerCompanyCount: 7, dangerTotalCount: 10, unrectifiedCount: 10,
    generalDanger: 1, largerDanger: 7, majorDanger: 2,
    publishedTaskCount: 9, completedTaskCount: 2,
    pipeTaskCount: 0, pipeCompletedCount: 0,
    plantTaskCount: 9, plantCompletedCount: 2,
    children: [
      {
        id: 'xinanjiang', city: '新安江街道', publishedCount: 1, completedCount: 1,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 1, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 1,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 1
      },
      {
        id: 'shouchang', city: '寿昌镇', publishedCount: 1, completedCount: 0,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 1, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 0
      },
      {
        id: 'qiantan', city: '乾潭镇', publishedCount: 1, completedCount: 0,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 1, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 0
      },
      {
        id: 'meicheng', city: '梅城镇', publishedCount: 1, completedCount: 0,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 1, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 0
      },
      {
        id: 'lianjia', city: '李家镇', publishedCount: 1, completedCount: 0,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 1, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 0
      },
      {
        id: 'dayang', city: '大洋镇', publishedCount: 1, completedCount: 0,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 1, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 0
      },
      {
        id: 'datong', city: '大同镇', publishedCount: 1, completedCount: 0,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 1, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 0
      },
      {
        id: 'lianhuazhen', city: '莲花镇', publishedCount: 1, completedCount: 1,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 1, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 1, completedTaskCount: 1,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 1
      },
      {
        id: 'daciyan', city: '大慈岩镇', publishedCount: 1, completedCount: 0,
        dangerCompanyCount: 1, dangerTotalCount: 1, unrectifiedCount: 1,
        generalDanger: 0, largerDanger: 0, majorDanger: 1,
        publishedTaskCount: 1, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 1, plantCompletedCount: 0
      },
      {
        id: 'anren', city: '安仁乡', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      },
      {
        id: 'yangxi', city: '洋溪街道', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      },
      {
        id: 'genglou', city: '更楼街道', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      },
      {
        id: 'sandu', city: '三都镇', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      },
      {
        id: 'yangcunqiao', city: '杨村桥镇', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      },
      {
        id: 'xiaya', city: '下涯镇', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      },
      {
        id: 'hangtou', city: '航头镇', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      },
      {
        id: 'qintang', city: '钦堂乡', publishedCount: 0, completedCount: 0,
        dangerCompanyCount: 0, dangerTotalCount: 0, unrectifiedCount: 0,
        generalDanger: 0, largerDanger: 0, majorDanger: 0,
        publishedTaskCount: 0, completedTaskCount: 0,
        pipeTaskCount: 0, pipeCompletedCount: 0,
        plantTaskCount: 0, plantCompletedCount: 0
      }
    ]
  }
])
</script>

<style scoped lang="scss">
.safety-assessment-stats-page {
  .search-form {
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;

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

  .data-table {
    :deep(.ant-table) {
      .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
      }
    }
  }
}
</style>
