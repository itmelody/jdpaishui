<template>
  <div class="water-quality-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">检测任务详情</h2>
        <p class="page-subtitle">建德市华盛化工厂 | 洋溪街道 | 检查井 B-03</p>
      </div>
      <div class="header-right">
        <a-tag>已下发</a-tag>
        <a-tag color="blue">归档</a-tag>
        <a-tag color="green">审核通过</a-tag>
      </div>
    </div>

    <!-- 汇总卡片 -->
    <a-row :gutter="16" class="summary-cards">
      <a-col :span="6">
        <a-card size="small" class="summary-card">
          <div class="card-icon icon-red">
            <ExperimentOutlined />
          </div>
          <div class="card-content">
            <div class="card-label">综合污染指数</div>
            <div class="card-value text-red">3.82</div>
            <div class="card-desc text-red">严重超标</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small" class="summary-card">
          <div class="card-icon icon-orange">
            <AlertOutlined />
          </div>
          <div class="card-content">
            <div class="card-label">超标指标数</div>
            <div class="card-value text-orange">4 <span class="card-unit">项</span></div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small" class="summary-card">
          <div class="card-icon icon-red">
            <DollarOutlined />
          </div>
          <div class="card-content">
            <div class="card-label">预估处理费</div>
            <div class="card-value text-red">¥3,200</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small" class="summary-card">
          <div class="card-icon icon-blue">
            <ScheduleOutlined />
          </div>
          <div class="card-content">
            <div class="card-label">当前进度</div>
            <div class="card-value">5/8</div>
            <div class="card-desc">报告生成待执行</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 业务流程 -->
    <a-card class="section-card">
      <div class="section-header">
        <span class="section-title">业务流程</span>
        <a-tag color="blue">进行中 — 第 5/8 步</a-tag>
      </div>
      <div class="process-steps">
        <div v-for="(step, index) in processSteps" :key="index" class="step-item">
          <div class="step-node" :class="{ completed: step.completed, active: step.active }">
            <span v-if="step.completed" class="step-check">✓</span>
            <span v-else class="step-number">{{ index + 1 }}</span>
          </div>
          <div class="step-info">
            <div class="step-name">{{ step.name }}</div>
            <div class="step-time" v-if="step.time">{{ step.time }}</div>
          </div>
          <div v-if="index < processSteps.length - 1" class="step-line" :class="{ completed: step.completed }"></div>
        </div>
      </div>
    </a-card>

    <a-row :gutter="16" class="info-section-row">
      <!-- 基本信息 -->
      <a-col :span="12">
        <a-card class="section-card info-card">
          <div class="section-header">
            <span class="section-title">基本信息</span>
          </div>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">排水户名称</span>
              <span class="info-value">建德市华盛化工厂</span>
            </div>
            <div class="info-row">
              <span class="info-label">统一社会信用代码</span>
              <span class="info-value">91330182MA2EXAMPLE</span>
            </div>
            <div class="info-row">
              <span class="info-label">所属行政区划</span>
              <span class="info-value">建德市 / 洋溪街道</span>
            </div>
            <div class="info-row">
              <span class="info-label">监管网格编号</span>
              <span class="info-value">GRID-JD-YX-003</span>
            </div>
            <div class="info-row">
              <span class="info-label">检测任务编号</span>
              <span class="info-value">JD-WZ-2026-0002</span>
            </div>
            <div class="info-row">
              <span class="info-label">任务来源</span>
              <span class="info-value">系统生成</span>
            </div>
            <div class="info-row">
              <span class="info-label">联系人</span>
              <span class="info-value">张建国 / 138****6789</span>
            </div>
            <div class="info-row">
              <span class="info-label">排水许可证号</span>
              <span class="info-value">JDPK-2025-0156</span>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 采样信息 -->
      <a-col :span="12">
        <a-card class="section-card info-card">
          <div class="section-header">
            <span class="section-title">采样信息</span>
          </div>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">采样时间</span>
              <span class="info-value">2026-06-19 14:15</span>
            </div>
            <div class="info-row">
              <span class="info-label">采样人员</span>
              <span class="info-value">李明、王强</span>
            </div>
            <div class="info-row">
              <span class="info-label">采样单位</span>
              <span class="info-value">建德市环境监测站</span>
            </div>
            <div class="info-row">
              <span class="info-label">点位类型</span>
              <span class="info-value">检查井 B-03</span>
            </div>
            <div class="info-row">
              <span class="info-label">天气/水温</span>
              <span class="info-value">晴 28°C / 水温 22.5°C</span>
            </div>
            <div class="info-row">
              <span class="info-label">现场 pH</span>
              <span class="info-value">7.6</span>
            </div>
            <div class="info-row">
              <span class="info-label">样品编号</span>
              <span class="info-value">JD-SPL-2026-0619-003</span>
            </div>
            <div class="info-row">
              <span class="info-label">运输方式</span>
              <span class="info-value">冷链运输（4°C 恒温箱）</span>
            </div>
          </div>
          <div class="site-description">
            <div class="site-desc-title">现场情况说明</div>
            <div class="site-desc-text">检查井水位正常，水样颜色偏黄，有轻微异味。已拍照存档，附件 3 张。</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 实验室检测结果 -->
    <a-card class="section-card">
      <div class="section-header">
        <span class="section-title">实验室检测结果</span>
        <span class="section-meta">检测实验室：建德市水质检测中心 | 检测人：陈伟 | 审核人：刘芳 | 2026-06-20</span>
      </div>
      <a-table
        :columns="labColumns"
        :data-source="labData"
        :pagination="false"
        row-key="id"
        size="small"
        class="lab-table"
        :row-class-name="getLabRowClassName"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'detectValue'">
            <span :class="record.isOverLimit ? 'value-over' : 'value-normal'">{{ record.detectValue }}</span>
          </template>
          <template v-if="column.key === 'overMultiple'">
            <span v-if="record.overMultiple" class="text-red">{{ record.overMultiple }}</span>
            <span v-else>—</span>
          </template>
          <template v-if="column.key === 'isQualified'">
            <a-tag :color="record.isQualified ? 'green' : 'red'" size="small">
              {{ record.isQualified ? '达标' : '超标' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'testMethod'">
            <span>{{ record.testMethod || '—' }}</span>
          </template>
        </template>
      </a-table>
      <div class="lab-summary">
        检测 9 项指标
        <span class="text-red">超标 4 项（COD/氨氮/总磷/透明度）</span>
        <span class="text-green">达标 5 项</span>
      </div>
    </a-card>

    <!-- 污染评估与价格计算 -->
    <a-card class="section-card">
      <div class="section-header">
        <span class="section-title">污染评估与价格计算</span>
      </div>
      <a-row :gutter="32">
        <a-col :span="12">
          <h4 class="sub-title">污染等级判定</h4>
          <div class="pollution-level">
            <a-tag color="red" class="level-tag">严重超标</a-tag>
            <span class="level-desc">综合污染指数 3.82（阈值 3.0）</span>
          </div>
          <div class="pollution-bar-wrapper">
            <span class="pollution-bar-label">污染程度</span>
            <div class="pollution-bar">
              <div class="pollution-bar-fill" style="width: 76%"></div>
            </div>
            <span class="pollution-bar-value">76%</span>
          </div>
          <div class="over-list-title">超标指标清单（4 项）</div>
          <div class="over-list">
            <a-tag color="red" class="over-item-tag">COD</a-tag>
            <span class="over-item-text">486 mg/L，接近限值 500（临界）</span>
          </div>
          <div class="over-list">
            <a-tag color="red" class="over-item-tag">氨氮</a-tag>
            <span class="over-item-text">52.3 mg/L，超标 1.16 倍</span>
          </div>
          <div class="over-list">
            <a-tag color="red" class="over-item-tag">总磷</a-tag>
            <span class="over-item-text">9.2 mg/L，超标 1.15 倍</span>
          </div>
          <div class="over-list">
            <a-tag color="orange" class="over-item-tag">透明度</a-tag>
            <span class="over-item-text">22 cm，低于标准 ≥30 cm</span>
          </div>
        </a-col>
        <a-col :span="12">
          <h4 class="sub-title">价格计算明细</h4>
          <div class="price-list">
            <div class="price-row">
              <span>基础检测费</span>
              <span>¥800.00</span>
            </div>
            <div class="price-row">
              <span>超标加价 — 氨氮 (x1.16)</span>
              <span class="text-red">+¥1,200.00</span>
            </div>
            <div class="price-row">
              <span>超标加价 — 总磷 (x1.15)</span>
              <span class="text-red">+¥800.00</span>
            </div>
            <div class="price-row">
              <span>严重超标附加费</span>
              <span class="text-red">+¥400.00</span>
            </div>
          </div>
          <div class="price-total-row">
            <span class="price-total-label">预估处理费用</span>
            <span class="price-total-value">¥3,200.00</span>
          </div>
          <div class="price-rule">
            <div class="price-rule-title">计价规则</div>
            <div class="price-rule-text">依据《建德市城镇排水污水处理费征收管理办法》：超标 1~2 倍加价系数 1.5，综合指数 >= 3 附加 ¥400。</div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 检测报告 -->
    <a-card class="section-card">
      <div class="section-header">
        <span class="section-title">检测报告</span>
        <a-tag color="green">已生成</a-tag>
      </div>
      <div class="report-info">
        <div class="info-row">
          <span class="info-label">报告编号</span>
          <span class="info-value">RPT-JD-2026-0002</span>
        </div>
        <div class="info-row">
          <span class="info-label">生成时间</span>
          <span class="info-value">2026-06-22 10:30</span>
        </div>
        <div class="info-row">
          <span class="info-label">页数</span>
          <span class="info-value">4 页</span>
        </div>
        <div class="info-row">
          <span class="info-label">版本</span>
          <span class="info-value">V1.0</span>
        </div>
      </div>
      <div class="report-actions">
        <a-button type="primary" size="small">在线预览</a-button>
        <a-button size="small">导出 PDF</a-button>
        <a-button size="small">历史版本</a-button>
      </div>
      <div class="report-desc">报告包含：基本信息、9 项检测结果表、超标标识、污染等级、参考价格、结论建议</div>
    </a-card>

    <!-- 通知同步 -->
    <a-card class="section-card">
      <div class="section-header">
        <span class="section-title">通知同步</span>
        <div class="notify-header-right">
          <div class="notify-progress">
            <div class="notify-progress-bar">
              <div class="notify-progress-fill" style="width: 60%"></div>
            </div>
            <span class="notify-progress-text">3/5 已送达</span>
          </div>
          <a-button type="primary" size="small">一键发送（2）</a-button>
        </div>
      </div>
      <a-table
        :columns="notifyColumns"
        :data-source="notifyData"
        :pagination="false"
        row-key="id"
        size="small"
        class="notify-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'category'">
            <a-tag :color="getCategoryColor(record.category)" size="small">{{ record.category }}</a-tag>
          </template>
          <template v-if="column.key === 'channel'">
            <a-tag size="small">{{ record.channel }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '已送达' ? 'green' : 'orange'" size="small">{{ record.status }}</a-tag>
          </template>
          <template v-if="column.key === 'time'">
            <span>{{ record.time || '—' }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small">预览</a-button>
              <a-button type="link" size="small" :class="record.status === '待发送' ? 'text-red' : ''">
                {{ record.status === '待发送' ? '立即发送' : '重发' }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      <div class="history-toggle">
        <a-button type="link" size="small">
          <template #icon><RightOutlined /></template>
          历史发送记录
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RightOutlined, ArrowLeftOutlined, ExperimentOutlined, AlertOutlined, DollarOutlined, ScheduleOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  record?: any
}>()

const emit = defineEmits<{
  back: []
}>()

// 业务流程步骤
const processSteps = ref([
  { name: '任务下发', time: '06-14 08:00', completed: true, active: false },
  { name: '现场采样', time: '06-14 13:45', completed: true, active: false },
  { name: '实验室检测', time: '06-15 09:00', completed: true, active: false },
  { name: '数据审核', time: '06-16 10:30', completed: true, active: false },
  { name: '自动计价', time: '06-16 11:00', completed: true, active: false },
  { name: '报告生成', time: '', completed: false, active: false },
  { name: '多端同步', time: '', completed: false, active: false },
  { name: '归档入库', time: '', completed: false, active: false }
])

// 实验室检测列
const labColumns = [
  { title: '检测指标', dataIndex: 'indicator', key: 'indicator', width: 180 },
  { title: '检测值', dataIndex: 'detectValue', key: 'detectValue', width: 100, align: 'center' as const },
  { title: '标准限值', dataIndex: 'standardLimit', key: 'standardLimit', width: 100, align: 'center' as const },
  { title: '单位', dataIndex: 'unit', key: 'unit', width: 70, align: 'center' as const },
  { title: '超标倍数', dataIndex: 'overMultiple', key: 'overMultiple', width: 90, align: 'center' as const },
  { title: '是否达标', dataIndex: 'isQualified', key: 'isQualified', width: 90, align: 'center' as const },
  { title: '检测方法', dataIndex: 'testMethod', key: 'testMethod', width: 110 }
]

// 实验室检测数据
const labData = ref([
  { id: 1, indicator: 'COD（化学需氧量）', detectValue: '486', standardLimit: '500', unit: 'mg/L', overMultiple: '', isQualified: false, testMethod: 'GB/T 11914', isOverLimit: true },
  { id: 2, indicator: 'BOD（生化需氧量）', detectValue: '312', standardLimit: '350', unit: 'mg/L', overMultiple: '', isQualified: true, testMethod: 'GB/T 7488', isOverLimit: false },
  { id: 3, indicator: '氨氮', detectValue: '52.3', standardLimit: '45', unit: 'mg/L', overMultiple: '1.16x', isQualified: false, testMethod: 'HJ 535', isOverLimit: true },
  { id: 4, indicator: '总氮', detectValue: '63.8', standardLimit: '70', unit: 'mg/L', overMultiple: '', isQualified: true, testMethod: 'HJ 636', isOverLimit: false },
  { id: 5, indicator: '总磷', detectValue: '9.2', standardLimit: '8', unit: 'mg/L', overMultiple: '1.15x', isQualified: false, testMethod: 'GB/T 11893', isOverLimit: true },
  { id: 6, indicator: 'pH', detectValue: '7.8', standardLimit: '6.5~9.5', unit: '—', overMultiple: '', isQualified: true, testMethod: 'GB/T 6920', isOverLimit: false },
  { id: 7, indicator: '透明度', detectValue: '22', standardLimit: '≥30', unit: 'cm', overMultiple: '', isQualified: false, testMethod: '—', isOverLimit: true },
  { id: 8, indicator: '氧化还原电位', detectValue: '185', standardLimit: '—', unit: 'mV', overMultiple: '', isQualified: true, testMethod: '—', isOverLimit: false },
  { id: 9, indicator: '溶解氧', detectValue: '3.1', standardLimit: '—', unit: 'mg/L', overMultiple: '', isQualified: true, testMethod: 'GB/T 7489', isOverLimit: false }
])

// 通知同步列
const notifyColumns = [
  { title: '分类', dataIndex: 'category', key: 'category', width: 100 },
  { title: '通知对象', dataIndex: 'target', key: 'target', width: 160 },
  { title: '联系方式', dataIndex: 'contact', key: 'contact', width: 140 },
  { title: '渠道', dataIndex: 'channel', key: 'channel', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90, align: 'center' as const },
  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '操作', key: 'action', width: 140 }
]

// 通知同步数据
const notifyData = ref([
  { id: 1, category: '排水户', target: '李德华（法人）', contact: '138****6789', channel: '短信', status: '已送达', time: '2026-06-22 14:30' },
  { id: 2, category: '排水户', target: '张建国（联系人）', contact: '159****3456', channel: 'APP推送+短信', status: '已送达', time: '2026-06-22 14:30' },
  { id: 3, category: '乡镇/街道', target: '洋溪街道环保办', contact: '系统内通知', channel: '平台通知+短信', status: '已送达', time: '2026-06-22 14:35' },
  { id: 4, category: '区县监管', target: '建德市住建局排水科', contact: '系统内通知', channel: '平台通知', status: '待发送', time: '' },
  { id: 5, category: '区县监管', target: '建德市生态环境局', contact: '系统内通知', channel: '平台通知', status: '待发送', time: '' }
])

// 行样式
const getLabRowClassName = (record: any) => {
  return record.isOverLimit ? 'row-over-limit' : ''
}

const getCategoryColor = (category: string) => {
  const map: Record<string, string> = {
    '排水户': 'blue',
    '乡镇/街道': 'orange',
    '区县监管': 'default'
  }
  return map[category] || 'default'
}
</script>

<style scoped lang="scss">
.water-quality-detail {
  padding: 16px;
  background: #f0f2f5;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 13px;
      color: #999;
      margin: 0;
    }

    .header-right {
      display: flex;
      gap: 8px;
    }
  }

  .summary-cards {
    margin-bottom: 16px;

    :deep(.ant-row) {
      display: flex;
      flex-wrap: wrap;
    }

    :deep(.ant-col) {
      display: flex;
    }

    .summary-card {
      flex: 1;
      height: 100%;

      :deep(.ant-card-body) {
        padding: 20px 16px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
        min-height: 100px;
      }

      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        flex-shrink: 0;

        &.icon-red {
          background: #fff1f0;
          color: #f5222d;
        }

        &.icon-orange {
          background: #fff7e6;
          color: #fa8c16;
        }

        &.icon-blue {
          background: #e6f7ff;
          color: #1890ff;
        }
      }

      .card-content {
        flex: 1;
        min-width: 0;
      }

      .card-label {
        font-size: 13px;
        color: #999;
        margin-bottom: 6px;
      }

      .card-value {
        font-size: 26px;
        font-weight: 700;
        color: #333;
        line-height: 1.2;

        .card-unit {
          font-size: 13px;
          font-weight: 400;
          color: #999;
        }
      }

      .card-desc {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }
  }

  .section-card {
    margin-bottom: 16px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .section-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        padding-left: 10px;
        border-left: 3px solid #1890ff;
      }

      .section-meta {
        font-size: 12px;
        color: #999;
      }
    }
  }

  // 业务流程
  .process-steps {
    display: flex;
    align-items: flex-start;
    padding: 16px 0;

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex: 1;

      .step-node {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        color: #999;
        font-size: 14px;
        font-weight: 600;
        z-index: 1;

        &.completed {
          background: #1890ff;
          color: #fff;
        }

        .step-check {
          font-size: 16px;
        }
      }

      .step-info {
        text-align: center;
        margin-top: 8px;

        .step-name {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .step-time {
          font-size: 11px;
          color: #999;
          margin-top: 2px;
        }
      }

      .step-line {
        position: absolute;
        top: 18px;
        left: calc(50% + 18px);
        width: calc(100% - 36px);
        height: 2px;
        background: #e8e8e8;

        &.completed {
          background: #1890ff;
        }
      }
    }
  }

  // 信息网格
  .info-section-row {
    margin-bottom: 24px;

    :deep(.ant-row) {
      display: flex;
      flex-wrap: wrap;
    }

    :deep(.ant-col) {
      display: flex;
    }

    .info-card {
      flex: 1;
      height: 100%;
    }
  }

  .info-grid {
    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;

      .info-label {
        width: 130px;
        font-size: 13px;
        color: #999;
        flex-shrink: 0;
      }

      .info-value {
        font-size: 13px;
        color: #333;
        flex: 1;
      }
    }
  }

  // 现场说明
  .site-description {
    margin-top: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;

    .site-desc-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }

    .site-desc-text {
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }
  }

  // 实验室表格
  .lab-table {
    :deep(.ant-table-thead > tr > th) {
      background: #fafafa;
      font-weight: 600;
      font-size: 13px;
    }

    :deep(.ant-table-tbody > tr.row-over-limit > td) {
      background-color: #fff1f0;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
      font-size: 13px;
    }
  }

  .lab-summary {
    margin-top: 12px;
    font-size: 13px;
    color: #666;

    span {
      margin-left: 12px;
    }
  }

  // 污染评估
  .sub-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
  }

  .pollution-level {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .level-tag {
      font-size: 13px;
    }

    .level-desc {
      font-size: 13px;
      color: #666;
    }
  }

  .pollution-bar-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .pollution-bar-label {
      font-size: 13px;
      color: #999;
      width: 60px;
    }

    .pollution-bar {
      flex: 1;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;

      .pollution-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff4d4f, #ff7875);
        border-radius: 4px;
      }
    }

    .pollution-bar-value {
      font-size: 13px;
      color: #666;
      width: 40px;
    }
  }

  .over-list-title {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .over-list {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    .over-item-tag {
      font-size: 12px;
    }

    .over-item-text {
      font-size: 13px;
      color: #666;
    }
  }

  // 价格计算
  .price-list {
    .price-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
      color: #666;
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .price-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    margin-top: 8px;
    border-top: 2px solid #f0f0f0;

    .price-total-label {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .price-total-value {
      font-size: 22px;
      font-weight: 700;
      color: #f5222d;
    }
  }

  .price-rule {
    margin-top: 12px;
    padding: 10px 12px;
    background: #f5f5f5;
    border-left: 3px solid #1890ff;
    border-radius: 0 4px 4px 0;

    .price-rule-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .price-rule-text {
      font-size: 12px;
      color: #666;
      line-height: 1.6;
    }
  }

  // 检测报告
  .report-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;

    .info-row {
      display: flex;
      padding: 6px 0;

      .info-label {
        width: 80px;
        font-size: 13px;
        color: #999;
      }

      .info-value {
        font-size: 13px;
        color: #333;
      }
    }
  }

  .report-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .report-desc {
    font-size: 12px;
    color: #999;
  }

  // 通知同步
  .notify-header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .notify-progress {
      display: flex;
      align-items: center;
      gap: 8px;

      .notify-progress-bar {
        width: 120px;
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;

        .notify-progress-fill {
          height: 100%;
          background: #1890ff;
          border-radius: 3px;
        }
      }

      .notify-progress-text {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .notify-table {
    :deep(.ant-table-thead > tr > th) {
      background: #fafafa;
      font-weight: 600;
      font-size: 13px;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 8px;
      font-size: 13px;
    }
  }

  .history-toggle {
    margin-top: 8px;
  }

  // 通用样式
  .text-red {
    color: #f5222d;
  }

  .text-orange {
    color: #fa8c16;
  }

  .text-green {
    color: #52c41a;
  }

  .value-over {
    color: #f5222d;
    font-weight: 600;
  }

  .value-normal {
    font-weight: 600;
    color: #333;
  }
}
</style>
