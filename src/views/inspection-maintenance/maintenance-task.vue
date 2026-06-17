<template>
  <div class="maintenance-task-page">
    <MaintenanceTaskContent />
  </div>
</template>

<script setup lang="ts">
import MaintenanceTaskContent from './MaintenanceTaskContent.vue'
</script>

<style scoped lang="scss">
.maintenance-task-page {
  padding: 16px;
  background: #f0f2f5;
  min-height: 100%;
}
</style>
