<template>
  <div class="warning-workorder">
    <a-card title="预警工单" :bordered="false">
      <div class="empty-state">
        <a-empty description="预警工单内容待开发" />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 预警工单页面
</script>

<style scoped lang="scss">
.warning-workorder {
  .empty-state {
    padding: 60px 0;
    text-align: center;
  }
}
</style>
