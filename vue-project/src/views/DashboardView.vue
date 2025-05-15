<script setup lang="ts">
import { ref } from 'vue'

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  successRate: number;
}

const stats = ref<DashboardStats>({
  totalTasks: 156,
  completedTasks: 124,
  pendingTasks: 32,
  successRate: 92.5
})
</script>

<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h2>系统仪表盘</h2>
      <p>实时监控系统运行状态和测试数据</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>总任务数</h3>
          <div class="stat-value">{{ stats.totalTasks }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>已完成任务</h3>
          <div class="stat-value">{{ stats.completedTasks }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>待处理任务</h3>
          <div class="stat-value">{{ stats.pendingTasks }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>成功率</h3>
          <div class="stat-value">{{ stats.successRate }}%</div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="chart-section">
        <h3>测试任务统计</h3>
        <div class="chart-placeholder">
          图表区域（后续集成echarts）
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #718096;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  color: #4299e1;
}

.stat-content h3 {
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.stat-value {
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 600;
}

.dashboard-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-section h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.chart-placeholder {
  background: #f7fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 