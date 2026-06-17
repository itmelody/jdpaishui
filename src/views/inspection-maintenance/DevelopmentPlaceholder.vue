<template>
  <div class="development-placeholder">
    <a-result
      status="info"
      title="功能开发中"
      sub-title="该功能正在开发中，敬请期待..."
    >
      <template #icon>
        <tool-outlined style="font-size: 64px; color: #1890ff;" />
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { ToolOutlined } from '@ant-design/icons-vue'
</script>

<style scoped lang="scss">
.development-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 4px;
}
</style>
