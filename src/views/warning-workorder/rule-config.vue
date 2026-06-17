<template>
  <div class="warning-rule-config-page">
    <!-- 左侧侧边栏 -->
    <div class="sidebar">
      <a-menu
        v-model:selectedKeys="selectedMenu"
        mode="vertical"
        @click="handleMenuClick"
        class="side-menu"
      >
        <a-menu-item key="warning-management">
          <span>预警管理</span>
        </a-menu-item>
        <a-menu-item key="rule-config">
          <span>预警规则配置</span>
        </a-menu-item>
        <a-menu-item key="workflow-tracking">
          <span>工单全流程跟踪</span>
        </a-menu-item>
        <a-menu-item key="overdue-supervision">
          <span>逾期督办</span>
        </a-menu-item>
        <a-menu-item key="statistics-review">
          <span>工单统计复盘</span>
        </a-menu-item>
      </a-menu>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">预警规则配置</h2>
      </div>

      <!-- 标签页 -->
      <a-tabs v-model:activeKey="activeTab" class="config-tabs">
        <a-tab-pane key="water-level" tab="管网水位预警"></a-tab-pane>
        <a-tab-pane key="road-flooding" tab="道路积水预警"></a-tab-pane>
        <a-tab-pane key="rainfall" tab="雨情雨量预警"></a-tab-pane>
        <a-tab-pane key="pump-equipment" tab="泵站设备预警"></a-tab-pane>
        <a-tab-pane key="water-quality" tab="水质排污预警"></a-tab-pane>
        <a-tab-pane key="manhole-safety" tab="井盖安全预警"></a-tab-pane>
      </a-tabs>

      <!-- 基础通用规则配置 -->
      <a-card :bordered="false" class="config-section">
        <div class="section-title">
          <setting-outlined />
          <span>基础通用规则配置（全局统一，所有预警共用）</span>
        </div>
        
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="预警防抖时长（避免瞬时波动误报）">
              <a-select v-model:value="baseConfig.shakeDuration">
                <a-select-option value="30">30 秒</a-select-option>
                <a-select-option value="60">1 分钟</a-select-option>
                <a-select-option value="120">2 分钟</a-select-option>
              </a-select>
              <div class="form-hint">水位超限需持续设置时长才触发预警，瞬时波动不告警</div>
            </a-form-item>
          </a-col>
          
          <a-col :span="12">
            <a-form-item label="预警重复抑制间隔（同一设备同一种预警冷却时间）">
              <a-select v-model:value="baseConfig.suppressInterval">
                <a-select-option value="10">10 分钟</a-select-option>
                <a-select-option value="30">30 分钟</a-select-option>
                <a-select-option value="60">1 小时</a-select-option>
              </a-select>
              <div class="form-hint">冷却期内不再重复推送相同预警</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="预警自动关闭条件（数据回归安全阈值后）">
              <a-select v-model:value="baseConfig.autoCloseCondition">
                <a-select-option value="5min">延时 5 分钟关闭</a-select-option>
                <a-select-option value="10min">延时 10 分钟关闭</a-select-option>
                <a-select-option value="manual">手动确认关闭</a-select-option>
              </a-select>
              <div class="form-hint">防止数据反复波动导致预警反复开关</div>
            </a-form-item>
          </a-col>
          
          <a-col :span="12">
            <a-form-item label="预警状态默认流转">
              <a-select v-model:value="baseConfig.defaultStatus">
                <a-select-option value="pending">未派发（不可自动办结）</a-select-option>
                <a-select-option value="auto">自动派发给运维人员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <!-- 四级分级阀值配置 -->
      <a-card :bordered="false" class="config-section">
        <div class="section-title">
          <sliders-outlined />
          <span>四级分级阀值配置（核心指标）</span>
        </div>

        <a-table 
          :columns="thresholdColumns" 
          :data-source="thresholdData" 
          :pagination="false"
          bordered
          class="threshold-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'blue'">
              <a-input-number 
                v-model:value="record.blue.value" 
                :min="0"
                size="small"
                style="width: 80px"
              />
              <span v-if="record.blue.unit">{{ record.blue.unit }}</span>
              <span v-if="record.blue.desc" class="value-desc">{{ record.blue.desc }}</span>
            </template>
            
            <template v-else-if="column.key === 'yellow'">
              <a-input-number 
                v-model:value="record.yellow.value" 
                :min="0"
                size="small"
                style="width: 80px"
              />
              <span v-if="record.yellow.unit">{{ record.yellow.unit }}</span>
              <span v-if="record.yellow.desc" class="value-desc">{{ record.yellow.desc }}</span>
            </template>
            
            <template v-else-if="column.key === 'orange'">
              <a-input-number 
                v-model:value="record.orange.value" 
                :min="0"
                size="small"
                style="width: 80px"
              />
              <span v-if="record.orange.unit">{{ record.orange.unit }}</span>
              <span v-if="record.orange.desc" class="value-desc">{{ record.orange.desc }}</span>
            </template>
            
            <template v-else-if="column.key === 'red'">
              <a-input-number 
                v-model:value="record.red.value" 
                :min="0"
                size="small"
                style="width: 80px"
              />
              <span v-if="record.red.unit">{{ record.red.unit }}</span>
              <span v-if="record.red.desc" class="value-desc">{{ record.red.desc }}</span>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- 分级督办时效配置 -->
      <a-card :bordered="false" class="config-section">
        <div class="section-title">
          <clock-circle-outlined />
          <span>分级督办时效配置</span>
        </div>

        <a-row :gutter="16">
          <a-col :span="6">
            <a-card :bordered="false" class="time-limit-card blue-card">
              <div class="card-badge blue-badge">蓝色预警</div>
              <a-form layout="vertical">
                <a-form-item label="处置时限">
                  <a-input-group compact>
                    <a-input-number v-model:value="timeLimit.blue.hours" :min="0" style="width: 70%" />
                    <a-input disabled value="小时" style="width: 30%; text-align: center" />
                  </a-input-group>
                </a-form-item>
                <a-form-item label="到期提醒方式">
                  <a-input v-model:value="timeLimit.blue.reminder" />
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>

          <a-col :span="6">
            <a-card :bordered="false" class="time-limit-card yellow-card">
              <div class="card-badge yellow-badge">黄色预警</div>
              <a-form layout="vertical">
                <a-form-item label="处置时限">
                  <a-input-group compact>
                    <a-input-number v-model:value="timeLimit.yellow.hours" :min="0" style="width: 70%" />
                    <a-input disabled value="小时" style="width: 30%; text-align: center" />
                  </a-input-group>
                </a-form-item>
                <a-form-item label="到期提醒方式">
                  <a-input v-model:value="timeLimit.yellow.reminder" />
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>

          <a-col :span="6">
            <a-card :bordered="false" class="time-limit-card orange-card">
              <div class="card-badge orange-badge">橙色预警</div>
              <a-form layout="vertical">
                <a-form-item label="处置时限">
                  <a-input-group compact>
                    <a-input-number v-model:value="timeLimit.orange.hours" :min="0" style="width: 70%" />
                    <a-input disabled value="小时" style="width: 30%; text-align: center" />
                  </a-input-group>
                </a-form-item>
                <a-form-item label="到期提醒方式">
                  <a-input v-model:value="timeLimit.orange.reminder" />
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>

          <a-col :span="6">
            <a-card :bordered="false" class="time-limit-card red-card">
              <div class="card-badge red-badge">红色预警</div>
              <a-form layout="vertical">
                <a-form-item label="响应时限">
                  <a-input-group compact>
                    <a-input-number v-model:value="timeLimit.red.minutes" :min="0" style="width: 70%" />
                    <a-input disabled value="分钟" style="width: 30%; text-align: center" />
                  </a-input-group>
                </a-form-item>
                <a-form-item label="到期提醒方式">
                  <a-input v-model:value="timeLimit.red.reminder" />
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>
        </a-row>
      </a-card>

      <!-- 消息推送渠道配置 -->
      <a-card :bordered="false" class="config-section">
        <div class="section-title">
          <notification-outlined />
          <span>消息推送渠道配置（分等级精准推送）</span>
        </div>

        <div class="push-channels">
          <div class="channel-row">
            <span class="level-badge blue-badge">蓝色预警</span>
            <a-checkbox-group v-model:value="pushChannels.blue">
              <a-checkbox value="站内消息">站内消息推送</a-checkbox>
              <a-checkbox value="短信">短信推送</a-checkbox>
              <a-checkbox value="电话">电话通知</a-checkbox>
              <a-checkbox value="工作台置顶">工作台置顶</a-checkbox>
            </a-checkbox-group>
          </div>

          <div class="channel-row">
            <span class="level-badge yellow-badge">黄色预警</span>
            <a-checkbox-group v-model:value="pushChannels.yellow">
              <a-checkbox value="站内消息">站内消息推送</a-checkbox>
              <a-checkbox value="运维人员短信">运维人员短信</a-checkbox>
              <a-checkbox value="电话">电话通知</a-checkbox>
              <a-checkbox value="工作台置顶">工作台置顶</a-checkbox>
            </a-checkbox-group>
          </div>

          <div class="channel-row">
            <span class="level-badge orange-badge">橙色预警</span>
            <a-checkbox-group v-model:value="pushChannels.orange">
              <a-checkbox value="站内消息">站内消息推送</a-checkbox>
              <a-checkbox value="运维人员短信">运维人员短信</a-checkbox>
              <a-checkbox value="监管人员短信">监管人员短信</a-checkbox>
              <a-checkbox value="电话">电话通知</a-checkbox>
              <a-checkbox value="工作台置顶">工作台置顶</a-checkbox>
            </a-checkbox-group>
          </div>

          <div class="channel-row">
            <span class="level-badge red-badge">红色预警</span>
            <a-checkbox-group v-model:value="pushChannels.red">
              <a-checkbox value="站内弹窗">站内弹窗</a-checkbox>
              <a-checkbox value="全员短信">全员短信</a-checkbox>
              <a-checkbox value="领导电话语音">领导电话语音</a-checkbox>
              <a-checkbox value="工作台强制置顶">工作台强制置顶</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </a-card>

      <!-- 区域差异化规则配置 -->
      <a-card :bordered="false" class="config-section">
        <div class="section-title">
          <environment-outlined />
          <span>区域差异化规则配置（适配建德属地管理）</span>
        </div>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-card :bordered="false" class="area-config-card">
              <div class="card-header">
                <environment-outlined />
                <span>按街道/片区单独配置</span>
              </div>
              <a-list size="small" bordered>
                <a-list-item>新安江街道（核心易涝片区）</a-list-item>
                <a-list-item>洋溪街道</a-list-item>
                <a-list-item>更楼街道</a-list-item>
                <a-list-item>寿昌镇</a-list-item>
              </a-list>
              <div class="form-hint">选中片区应启用严苛阈值标准，提升预警灵敏度</div>
              <a-checkbox checked>核心片区阈值整体下调 10%</a-checkbox>
            </a-card>
          </a-col>

          <a-col :span="8">
            <a-card :bordered="false" class="flood-config-card">
              <div class="card-header">
                <cloud-outlined />
                <span>汛期预案切换</span>
              </div>
              <div class="status-info">
                <span>当前状态</span>
                <a-tag color="green">常规阈值已启用</a-tag>
              </div>
              <a-button type="primary" block>一键启用汛期预案</a-button>
              <div class="form-hint">梅雨季、台风季一键切换严苛阈值，非汛期恢复常规设置</div>
            </a-card>
          </a-col>

          <a-col :span="8">
            <a-card :bordered="false" class="facility-config-card">
              <div class="card-header">
                <plus-circle-outlined />
                <span>重点设施单独规则</span>
              </div>
              <a-checkbox-group>
                <a-checkbox checked>城区第一泵站</a-checkbox>
                <a-checkbox checked>建德大桥下穿通道</a-checkbox>
                <a-checkbox>洋溪街道积水点</a-checkbox>
              </a-checkbox-group>
              <a-button type="dashed" block style="margin-top: 12px">
                <plus-outlined /> 添加重点设施
              </a-button>
            </a-card>
          </a-col>
        </a-row>
      </a-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <a-space>
          <a-button type="primary">
            <save-outlined /> 保存配置
          </a-button>
          <a-button>
            <rollback-outlined /> 重置修改
          </a-button>
          <a-button>
            <download-outlined /> 导出配置
          </a-button>
        </a-space>
      </div>

      <!-- 历史版本日志 -->
      <a-card :bordered="false" class="history-section">
        <div class="section-header">
          <div class="section-title">
            <history-outlined />
            <span>历史版本日志</span>
          </div>
          <a-button type="link">查看全部</a-button>
        </div>

        <a-table 
          :columns="historyColumns" 
          :data-source="historyData" 
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a>查看详情</a>
                <a>回滚到此版本</a>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- 底部批量操作 -->
      <div class="bottom-actions">
        <span class="selected-count">已选择 <strong>0</strong> 条规则</span>
        <a-space>
          <a-button type="primary" style="background-color: #52c41a; border-color: #52c41a">
            <check-outlined /> 批量启用
          </a-button>
          <a-button type="primary" danger>
            <stop-outlined /> 批量禁用
          </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  SettingOutlined,
  SlidersOutlined,
  ClockCircleOutlined,
  NotificationOutlined,
  EnvironmentOutlined,
  CloudOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  RollbackOutlined,
  DownloadOutlined,
  HistoryOutlined,
  CheckOutlined,
  StopOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 左侧菜单
const selectedMenu = ref<string[]>(['rule-config'])

const handleMenuClick = (e: any) => {
  const routeMap: Record<string, string> = {
    'warning-management': '/warning-workorder',
    'rule-config': '/warning-workorder/rule-config',
    'workflow-tracking': '/warning-workorder/workflow-tracking',
    'overdue-supervision': '/warning-workorder/overdue-supervision',
    'statistics-review': '/warning-workorder/statistics-review'
  }
  
  if (routeMap[e.key]) {
    router.push(routeMap[e.key])
  }
}

// 标签页
const activeTab = ref('water-level')

// 基础配置
const baseConfig = reactive({
  shakeDuration: '30',
  suppressInterval: '10',
  autoCloseCondition: '5min',
  defaultStatus: 'pending'
})

// 阀值表格列定义
const thresholdColumns = [
  { title: '监测指标', dataIndex: 'indicator', key: 'indicator', width: 150 },
  { title: '蓝色(提示)', key: 'blue', align: 'center' as const },
  { title: '黄色(较重)', key: 'yellow', align: 'center' as const },
  { title: '橙色(严重)', key: 'orange', align: 'center' as const },
  { title: '红色(特急)', key: 'red', align: 'center' as const }
]

// 阀值数据
const thresholdData = ref([
  {
    indicator: '管网井下水位\n(占管深百分比)',
    blue: { value: 50, unit: '%' },
    yellow: { value: 65, unit: '%' },
    orange: { value: 80, unit: '%' },
    red: { value: 90, unit: '%', desc: '临近溢流' }
  },
  {
    indicator: '道路积水深度\n(单位:厘米)',
    blue: { value: 5, unit: 'cm' },
    yellow: { value: 10, unit: 'cm' },
    orange: { value: 15, unit: 'cm' },
    red: { value: 25, unit: 'cm', desc: '阻断通行' }
  },
  {
    indicator: '小时降雨量\n(单位:mm/h)',
    blue: { value: 8 },
    yellow: { value: 16 },
    orange: { value: 30 },
    red: { value: 50, desc: '暴雨红色' }
  },
  {
    indicator: '污水COD浓度\n(单位:mg/L)',
    blue: { value: 50, desc: '超标' },
    yellow: { value: 80, desc: '超标' },
    orange: { value: 120, desc: '超标' },
    red: { value: 200, desc: '严重超标' }
  },
  {
    indicator: '泵站停机离线',
    blue: { value: '', desc: '单辅机离线' },
    yellow: { value: '', desc: '单主机故障' },
    orange: { value: '', desc: '双辅机停机' },
    red: { value: '', desc: '整机全部停机' }
  }
])

// 时效配置
const timeLimit = reactive({
  blue: { hours: 24, reminder: '站内信提醒' },
  yellow: { hours: 12, reminder: '短信提醒责任人' },
  orange: { hours: 4, reminder: '工作台督办弹窗' },
  red: { minutes: 30, reminder: '全局弹窗+电话语音通知' }
})

// 推送渠道
const pushChannels = reactive({
  blue: ['站内消息'],
  yellow: ['站内消息', '运维人员短信'],
  orange: ['站内消息', '运维人员短信', '监管人员短信'],
  red: ['站内弹窗', '全员短信', '领导电话语音', '工作台强制置顶']
})

// 历史版本表格列
const historyColumns = [
  { title: '版本号', dataIndex: 'version', key: 'version', width: 80 },
  { title: '修改人', dataIndex: 'modifier', key: 'modifier', width: 100 },
  { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime', width: 180 },
  { title: '修改说明', dataIndex: 'description', key: 'description' },
  { title: '操作', key: 'action', width: 150, align: 'center' as const }
]

// 历史版本数据
const historyData = ref([
  {
    version: 'v1.8',
    modifier: '张管理员',
    modifyTime: '2024-05-12 14:30',
    description: '调整新安江街道核心片区管网水位阈值'
  },
  {
    version: 'v1.7',
    modifier: '李管理员',
    modifyTime: '2024-04-28 09:15',
    description: '新增汛期临时预案规则'
  },
  {
    version: 'v1.6',
    modifier: '王管理员',
    modifyTime: '2024-03-15 16:45',
    description: '优化道路积水深度分级阈值'
  }
])
</script>

<style scoped lang="scss">
.warning-rule-config-page {
  display: flex;
  height: calc(100vh - 64px);
  background: #f0f2f5;

  // 左侧侧边栏
  .sidebar {
    width: 200px;
    background: #fff;
    border-right: 1px solid #e8e8e8;
    padding: 16px 0;

    .side-menu {
      border-right: none;

      :deep(.ant-menu-item) {
        margin: 0;
        padding: 0 24px;
        height: 48px;
        line-height: 48px;
        font-size: 14px;

        &.ant-menu-item-selected {
          background-color: #e6f7ff;
          color: #1890ff;
          border-left: 3px solid #1890ff;
          padding-left: 21px;
        }

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }

  // 右侧内容区域
  .main-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .page-header {
      margin-bottom: 16px;

      .page-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }

    .config-tabs {
      margin-bottom: 16px;
    }

    .config-section {
      margin-bottom: 16px;

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e8e8e8;
      }

      .form-hint {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }

      .value-desc {
        display: block;
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }

      .threshold-table {
        :deep(.ant-table-thead > tr > th) {
          background-color: #fafafa;
          font-weight: 600;
        }
      }

      .time-limit-card {
        position: relative;
        padding: 16px;

        &.blue-card { background-color: #f0f5ff; }
        &.yellow-card { background-color: #fffbe6; }
        &.orange-card { background-color: #fff7e6; }
        &.red-card { background-color: #fff1f0; }

        .card-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;

          &.blue-badge { background-color: #1890ff; color: #fff; }
          &.yellow-badge { background-color: #faad14; color: #fff; }
          &.orange-badge { background-color: #fa8c16; color: #fff; }
          &.red-badge { background-color: #ff4d4f; color: #fff; }
        }
      }

      .push-channels {
        .channel-row {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e8e8e8;

          &:last-child {
            border-bottom: none;
          }

          .level-badge {
            min-width: 80px;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
            margin-right: 16px;

            &.blue-badge { background-color: #e6f7ff; color: #1890ff; }
            &.yellow-badge { background-color: #fffbe6; color: #faad14; }
            &.orange-badge { background-color: #fff7e6; color: #fa8c16; }
            &.red-badge { background-color: #fff1f0; color: #ff4d4f; }
          }
        }
      }

      .area-config-card,
      .flood-config-card,
      .facility-config-card {
        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .status-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          margin-bottom: 12px;
        }
      }
    }

    .action-buttons {
      margin-bottom: 16px;
    }

    .history-section {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
      }
    }

    .bottom-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #fff;
      border-radius: 4px;
      margin-top: 16px;

      .selected-count {
        font-size: 14px;
        color: #666;

        strong {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
