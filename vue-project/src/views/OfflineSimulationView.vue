<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义评估结果详情接口
interface EvaluationDetail {
  name: string;
  passed: number;
  failed: number;
}

// 定义评估结果接口
interface EvaluationResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  details: EvaluationDetail[];
}

// 仿真状态
const simulationStatus = ref('idle') // idle, running, completed, error
const simulationProgress = ref(0)
const currentTask = ref('')

// 仿真配置
const simulationConfig = ref({
  duration: 60,
  interval: 1,
  autoStart: false,
  saveResults: true
})

// 评估结果
const evaluationResults = ref<EvaluationResult>({
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  successRate: 0,
  details: []
})

// 开始仿真
const startSimulation = async () => {
  try {
    simulationStatus.value = 'running'
    simulationProgress.value = 0
    currentTask.value = '初始化仿真环境...'
    
    // TODO: 实现实际的仿真逻辑
    
    // 模拟进度更新
    const interval = setInterval(() => {
      if (simulationProgress.value < 100) {
        simulationProgress.value += 10
        currentTask.value = `执行仿真任务 ${simulationProgress.value}%...`
      } else {
        clearInterval(interval)
        simulationStatus.value = 'completed'
        currentTask.value = '仿真完成'
        // 更新评估结果
        updateEvaluationResults()
      }
    }, 1000)
  } catch (error) {
    simulationStatus.value = 'error'
    currentTask.value = '仿真过程出错'
    console.error('仿真错误:', error)
  }
}

// 更新评估结果
const updateEvaluationResults = () => {
  // TODO: 实现实际的评估逻辑
  evaluationResults.value = {
    totalTests: 100,
    passedTests: 85,
    failedTests: 15,
    successRate: 85,
    details: [
      { name: '功能测试', passed: 45, failed: 5 },
      { name: '响应测试', passed: 30, failed: 8 },
      { name: '性能测试', passed: 10, failed: 2 }
    ]
  }
}

// 导出报告
const exportReport = () => {
  // TODO: 实现报告导出逻辑
  console.log('导出评估报告')
}

// 重置仿真
const resetSimulation = () => {
  simulationStatus.value = 'idle'
  simulationProgress.value = 0
  currentTask.value = ''
  evaluationResults.value = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    successRate: 0,
    details: []
  }
}

onMounted(() => {
  // 初始化组件
  console.log('离线仿真模块已加载')
})
</script>

<template>
  <div class="simulation-container">
    <div class="page-header">
      <h2>离线仿真模块</h2>
      <p>对所有功能模块进行离线仿真、响应识别和功能评估</p>
    </div>

    <div class="simulation-content">
      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="config-section">
          <h3>仿真配置</h3>
          <div class="config-form">
            <div class="form-group">
              <label>仿真时长（秒）</label>
              <input type="number" v-model="simulationConfig.duration" min="1" max="3600">
            </div>
            <div class="form-group">
              <label>采样间隔（秒）</label>
              <input type="number" v-model="simulationConfig.interval" min="0.1" max="10" step="0.1">
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="simulationConfig.autoStart">
                自动开始仿真
              </label>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="simulationConfig.saveResults">
                保存结果
              </label>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            class="primary-btn"
            @click="startSimulation"
            :disabled="simulationStatus === 'running'">
            开始仿真
          </button>
          <button 
            class="secondary-btn"
            @click="resetSimulation"
            :disabled="simulationStatus === 'running'">
            重置
          </button>
          <button 
            class="secondary-btn"
            @click="exportReport"
            :disabled="simulationStatus !== 'completed'">
            导出报告
          </button>
        </div>
      </div>

      <!-- 仿真状态 -->
      <div class="status-panel">
        <div class="status-header">
          <h3>仿真状态</h3>
          <span :class="['status-badge', simulationStatus]">
            {{ 
              simulationStatus === 'idle' ? '就绪' :
              simulationStatus === 'running' ? '运行中' :
              simulationStatus === 'completed' ? '已完成' : '错误'
            }}
          </span>
        </div>
        
        <div class="progress-section" v-if="simulationStatus === 'running'">
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: simulationProgress + '%' }">
            </div>
          </div>
          <div class="progress-text">
            {{ simulationProgress }}%
          </div>
        </div>

        <div class="current-task" v-if="currentTask">
          {{ currentTask }}
        </div>
      </div>

      <!-- 评估结果 -->
      <div class="evaluation-panel" v-if="simulationStatus === 'completed'">
        <h3>评估结果</h3>
        <div class="results-summary">
          <div class="result-item">
            <div class="result-value">{{ evaluationResults.totalTests }}</div>
            <div class="result-label">总测试数</div>
          </div>
          <div class="result-item">
            <div class="result-value">{{ evaluationResults.passedTests }}</div>
            <div class="result-label">通过</div>
          </div>
          <div class="result-item">
            <div class="result-value">{{ evaluationResults.failedTests }}</div>
            <div class="result-label">失败</div>
          </div>
          <div class="result-item">
            <div class="result-value">{{ evaluationResults.successRate }}%</div>
            <div class="result-label">成功率</div>
          </div>
        </div>

        <div class="results-details">
          <h4>详细结果</h4>
          <div class="details-table">
            <div class="table-header">
              <div class="header-cell">测试类型</div>
              <div class="header-cell">通过</div>
              <div class="header-cell">失败</div>
              <div class="header-cell">通过率</div>
            </div>
            <div 
              v-for="detail in evaluationResults.details" 
              :key="detail.name"
              class="table-row">
              <div class="table-cell">{{ detail.name }}</div>
              <div class="table-cell">{{ detail.passed }}</div>
              <div class="table-cell">{{ detail.failed }}</div>
              <div class="table-cell">
                {{ Math.round((detail.passed / (detail.passed + detail.failed)) * 100) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.simulation-container {
  padding: 2rem;
  min-height: calc(100vh - 4rem);
  background-color: #f5f5f5;
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

.simulation-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-panel {
  border-right: 1px solid #e2e8f0;
  padding-right: 1.5rem;
}

.config-section {
  margin-bottom: 2rem;
}

.config-section h3 {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4a5568;
  font-size: 0.9rem;
}

.form-group input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-btn {
  background-color: var(--primary-color);
  color: white;
}

.primary-btn:hover {
  background-color: #0052cc;
}

.secondary-btn {
  background-color: #e2e8f0;
  color: #4a5568;
}

.secondary-btn:hover {
  background-color: #cbd5e0;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-panel {
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-header h3 {
  font-size: 1.2rem;
  color: #2d3748;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.status-badge.idle {
  background-color: #e2e8f0;
  color: #4a5568;
}

.status-badge.running {
  background-color: #ebf8ff;
  color: #2b6cb0;
}

.status-badge.completed {
  background-color: #f0fff4;
  color: #2f855a;
}

.status-badge.error {
  background-color: #fff5f5;
  color: #c53030;
}

.progress-section {
  margin: 1rem 0;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.9rem;
  color: #4a5568;
}

.current-task {
  font-size: 0.9rem;
  color: #4a5568;
  margin-top: 1rem;
}

.evaluation-panel {
  margin-top: 2rem;
}

.evaluation-panel h3 {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-item {
  text-align: center;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.result-label {
  font-size: 0.9rem;
  color: #718096;
}

.results-details h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.details-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background-color: #f8fafc;
  padding: 0.75rem;
  font-weight: 600;
  color: #4a5568;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.table-row:hover {
  background-color: #f8fafc;
}

.header-cell,
.table-cell {
  padding: 0.5rem;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .simulation-content {
    grid-template-columns: 1fr;
  }

  .control-panel {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding-right: 0;
    padding-bottom: 1.5rem;
  }

  .results-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .simulation-container {
    padding: 1rem;
  }

  .results-summary {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr;
  }

  .header-cell:nth-child(3),
  .header-cell:nth-child(4),
  .table-cell:nth-child(3),
  .table-cell:nth-child(4) {
    display: none;
  }
}
</style> 