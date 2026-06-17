<template>
  <div class="data-stats-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">排水管网数据统计</h2>
    </div>

    <!-- 污水管网数据统计 -->
    <a-card class="stats-section" :bordered="false">
      <template #title>
        <div class="section-header">
          <span class="section-title sewage">污水管网数据统计</span>
          <a-button type="primary" size="small" @click="handleExport('sewage')">
            <DownloadOutlined /> 导出
          </a-button>
        </div>
      </template>
      <a-table
        :columns="sewageColumns"
        :data-source="sewageData"
        :pagination="false"
        row-key="id"
        size="small"
        :scroll="{ x: 2400 }"
        bordered
      />
    </a-card>

    <!-- 雨水管网数据统计 -->
    <a-card class="stats-section" :bordered="false">
      <template #title>
        <div class="section-header">
          <span class="section-title rainwater">雨水管网数据统计</span>
          <a-button type="primary" size="small" @click="handleExport('rainwater')">
            <DownloadOutlined /> 导出
          </a-button>
        </div>
      </template>
      <a-table
        :columns="rainwaterColumns"
        :data-source="rainwaterData"
        :pagination="false"
        row-key="id"
        size="small"
        :scroll="{ x: 2400 }"
        bordered
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'

// 公共列定义（多级表头）
const getStatsColumns = () => [
  {
    title: '地市',
    dataIndex: 'city',
    key: 'city',
    width: 80,
    fixed: 'left' as const
  },
  {
    title: '基础统计',
    children: [
      { title: '井盖总数', dataIndex: 'totalManhole', key: 'totalManhole', width: 90, align: 'center' as const },
      { title: '井盖数\n(审核通过)', dataIndex: 'approvedManhole', key: 'approvedManhole', width: 100, align: 'center' as const },
      { title: '生成管段\n总数(段)', dataIndex: 'totalSection', key: 'totalSection', width: 100, align: 'center' as const },
      { title: '管段总长\n(km)', dataIndex: 'totalLength', key: 'totalLength', width: 100, align: 'center' as const },
      { title: '异常管段\n数(段)', dataIndex: 'abnormalSection', key: 'abnormalSection', width: 100, align: 'center' as const },
      { title: '异常管段\n总长(km)', dataIndex: 'abnormalLength', key: 'abnormalLength', width: 100, align: 'center' as const }
    ]
  },
  {
    title: '管径分类 (km)',
    children: [
      { title: '0-300', dataIndex: 'diameter_0_300', key: 'diameter_0_300', width: 80, align: 'center' as const },
      { title: '300-600', dataIndex: 'diameter_300_600', key: 'diameter_300_600', width: 80, align: 'center' as const },
      { title: '700-1000', dataIndex: 'diameter_700_1000', key: 'diameter_700_1000', width: 80, align: 'center' as const },
      { title: '1100-1500', dataIndex: 'diameter_1100_1500', key: 'diameter_1100_1500', width: 90, align: 'center' as const },
      { title: '1500以上', dataIndex: 'diameter_1500_above', key: 'diameter_1500_above', width: 80, align: 'center' as const }
    ]
  },
  {
    title: '管龄分类 (km)',
    children: [
      { title: '0-5年', dataIndex: 'age_0_5', key: 'age_0_5', width: 80, align: 'center' as const },
      { title: '5-10年', dataIndex: 'age_5_10', key: 'age_5_10', width: 80, align: 'center' as const },
      { title: '10-15年', dataIndex: 'age_10_15', key: 'age_10_15', width: 80, align: 'center' as const },
      { title: '15-20年', dataIndex: 'age_15_20', key: 'age_15_20', width: 80, align: 'center' as const },
      { title: '20-30年', dataIndex: 'age_20_30', key: 'age_20_30', width: 80, align: 'center' as const },
      { title: '30年以上', dataIndex: 'age_30_above', key: 'age_30_above', width: 80, align: 'center' as const }
    ]
  },
  {
    title: '材质分类 (km)',
    children: [
      { title: 'PVC管', dataIndex: 'material_pvc', key: 'material_pvc', width: 80, align: 'center' as const },
      { title: '混凝土管', dataIndex: 'material_concrete', key: 'material_concrete', width: 85, align: 'center' as const },
      { title: 'HDPE管', dataIndex: 'material_hdpe', key: 'material_hdpe', width: 80, align: 'center' as const },
      { title: 'PE管', dataIndex: 'material_pe', key: 'material_pe', width: 70, align: 'center' as const },
      { title: '钢管', dataIndex: 'material_steel', key: 'material_steel', width: 70, align: 'center' as const },
      { title: '球墨铸铁管', dataIndex: 'material_ductile', key: 'material_ductile', width: 95, align: 'center' as const },
      { title: '玻璃钢\n加砂管', dataIndex: 'material_frp', key: 'material_frp', width: 85, align: 'center' as const },
      { title: '其他材料\n管材', dataIndex: 'material_other', key: 'material_other', width: 85, align: 'center' as const }
    ]
  }
]

const sewageColumns = getStatsColumns()
const rainwaterColumns = getStatsColumns()

// 污水管网数据
const sewageData = ref([
  {
    id: 1,
    city: '建德市',
    totalManhole: 3190,
    approvedManhole: 3190,
    totalSection: 3189,
    totalLength: 48,
    abnormalSection: 0,
    abnormalLength: 0,
    diameter_0_300: 0,
    diameter_300_600: 0,
    diameter_700_1000: 0,
    diameter_1100_1500: 0,
    diameter_1500_above: 0,
    age_0_5: 47.85,
    age_5_10: 0,
    age_10_15: 0,
    age_15_20: 0,
    age_20_30: 0,
    age_30_above: 0,
    material_pvc: 15.99,
    material_concrete: 0,
    material_hdpe: 0,
    material_pe: 0,
    material_steel: 0,
    material_ductile: 0,
    material_frp: 0,
    material_other: 0
  }
])

// 雨水管网数据（全部为0）
const rainwaterData = ref([
  {
    id: 1,
    city: '建德市',
    totalManhole: 0,
    approvedManhole: 0,
    totalSection: 0,
    totalLength: 0,
    abnormalSection: 0,
    abnormalLength: 0,
    diameter_0_300: 0,
    diameter_300_600: 0,
    diameter_700_1000: 0,
    diameter_1100_1500: 0,
    diameter_1500_above: 0,
    age_0_5: 0,
    age_5_10: 0,
    age_10_15: 0,
    age_15_20: 0,
    age_20_30: 0,
    age_30_above: 0,
    material_pvc: 0,
    material_concrete: 0,
    material_hdpe: 0,
    material_pe: 0,
    material_steel: 0,
    material_ductile: 0,
    material_frp: 0,
    material_other: 0
  }
])

// 导出操作
const handleExport = (type: string) => {
  const typeName = type === 'sewage' ? '污水管网' : '雨水管网'
  message.success(`正在导出${typeName}数据...`)
}
</script>

<style scoped lang="scss">
.data-stats-page {
  .page-header {
    margin-bottom: 16px;

    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  .stats-section {
    margin-bottom: 20px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        padding-left: 10px;
        border-left: 3px solid;

        &.sewage {
          border-left-color: #1890ff;
          color: #333;
        }

        &.rainwater {
          border-left-color: #52c41a;
          color: #333;
        }
      }
    }

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
