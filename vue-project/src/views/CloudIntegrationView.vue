<template>
  <div class="closed-loop-sim">
    <h1>闭环回归仿真模块</h1>
    <div class="content">
      <div class="row">
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>仿真参数设置</span>
            </div>
            <div class="card-content">
              <form class="form">
                <div class="form-item">
                  <label>动力学模型</label>
                  <select v-model="simConfig.model">
                    <option value="bicycle">自行车模型</option>
                    <option value="point">质点模型</option>
                    <option value="full">全车模型</option>
                  </select>
                </div>
                <div class="form-item">
                  <label>仿真时长（秒）</label>
                  <input type="number" v-model="simConfig.duration" min="1" max="600" />
                </div>
                <div class="form-item">
                  <label>步长（ms）</label>
                  <input type="number" v-model="simConfig.step" min="1" max="100" />
                </div>
                <div class="form-item">
                  <button class="btn btn-primary" type="button" @click="handleStartSim" :disabled="simStatus==='running'">启动仿真</button>
                  <button class="btn" type="button" @click="handlePauseSim" :disabled="simStatus!=='running'">暂停</button>
                  <button class="btn" type="button" @click="handleStopSim" :disabled="simStatus==='idle'">停止</button>
                </div>
              </form>
              <div class="sim-status-info">
                <p>仿真状态：<span :class="['status-badge', simStatus]">{{ simStatusLabel }}</span></p>
                <p>仿真进度：{{ simProgress }}%</p>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: simProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>实时反馈与轨迹分析</span>
              <button class="btn btn-primary btn-small" @click="exportResult" :disabled="simStatus!=='completed'">导出结果</button>
            </div>
            <div class="card-content">
              <div class="feedback-section">
                <h4>控制信号</h4>
                <div class="signal-list">
                  <div v-for="(signal, idx) in controlSignals" :key="idx" class="signal-item">
                    <span>{{ signal.time }}s</span> | <span>转向: {{ signal.steer }}</span> | <span>加速度: {{ signal.acc }}</span>
                  </div>
                </div>
                <h4>车辆状态反馈</h4>
                <div class="state-list">
                  <div v-for="(state, idx) in vehicleStates" :key="idx" class="state-item">
                    <span>{{ state.time }}s</span> | <span>位置: ({{ state.x }}, {{ state.y }})</span> | <span>速度: {{ state.v }} m/s</span> | <span>偏差: {{ state.error }} m</span>
                  </div>
                </div>
              </div>
              <div class="analysis-section">
                <h4>轨迹追踪分析</h4>
                <div class="analysis-table">
                  <table>
                    <thead>
                      <tr>
                        <th>指标</th>
                        <th>数值</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>最大偏差</td>
                        <td>{{ analysis.maxError }} m</td>
                      </tr>
                      <tr>
                        <td>平均偏差</td>
                        <td>{{ analysis.avgError }} m</td>
                      </tr>
                      <tr>
                        <td>轨迹追踪成功率</td>
                        <td>{{ analysis.successRate }}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const simConfig = ref({
  model: 'bicycle',
  duration: 60,
  step: 10
})
const simStatus = ref<'idle'|'running'|'paused'|'completed'>('idle')
const simProgress = ref(0)
const simStatusLabel = computed(() => {
  if (simStatus.value === 'idle') return '就绪'
  if (simStatus.value === 'running') return '运行中'
  if (simStatus.value === 'paused') return '已暂停'
  if (simStatus.value === 'completed') return '已完成'
  return ''
})
let simTimer: any = null

const controlSignals = ref<any[]>([])
const vehicleStates = ref<any[]>([])
const analysis = ref({
  maxError: 0.25,
  avgError: 0.12,
  successRate: 98.5
})

const handleStartSim = () => {
  simStatus.value = 'running'
  simProgress.value = 0
  controlSignals.value = []
  vehicleStates.value = []
  let t = 0
  simTimer = setInterval(() => {
    if (simStatus.value !== 'running') return
    t += simConfig.value.step / 1000
    simProgress.value = Math.min(100, Math.round((t / simConfig.value.duration) * 100))
    // 模拟信号和状态
    controlSignals.value.push({ time: t.toFixed(2), steer: (Math.sin(t)*10).toFixed(2), acc: (Math.cos(t)*2).toFixed(2) })
    vehicleStates.value.push({ time: t.toFixed(2), x: (t*2).toFixed(2), y: (Math.sin(t)*5).toFixed(2), v: (10+Math.cos(t)).toFixed(2), error: (Math.abs(Math.sin(t)/4)).toFixed(3) })
    if (simProgress.value >= 100) {
      simStatus.value = 'completed'
      clearInterval(simTimer)
    }
  }, simConfig.value.step)
}
const handlePauseSim = () => {
  if (simStatus.value === 'running') simStatus.value = 'paused'
}
const handleStopSim = () => {
  simStatus.value = 'idle'
  simProgress.value = 0
  clearInterval(simTimer)
}
const exportResult = () => {
  alert('导出仿真结果（可扩展为下载CSV/JSON等）')
}
</script>

<style scoped>
.closed-loop-sim {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.content {
  margin-top: 20px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}
.col {
  min-width: 320px;
  box-sizing: border-box;
}
.col-12 {
  flex: 1 1 400px;
  max-width: 48%;
}
.box-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  padding: 18px 20px 20px 20px;
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
.card-content {
  min-height: 120px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}
.form-item label {
  font-size: 14px;
  color: #666;
}
.btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  background: #f5f5f5;
  color: #333;
  transition: background 0.2s;
  margin-right: 8px;
}
.btn-primary {
  background: #409eff;
  color: #fff;
}
.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}
.btn:hover {
  filter: brightness(0.95);
}
.status-badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 13px;
  color: #fff;
  background: #909399;
}
.status-badge.running {
  background: #409eff;
}
.status-badge.completed {
  background: #67c23a;
}
.status-badge.paused {
  background: #e6a23c;
}
.progress-bar {
  width: 100%;
  height: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  margin: 18px 0 8px 0;
  overflow: hidden;
}
.progress {
  height: 100%;
  background: #409eff;
  border-radius: 8px;
  transition: width 0.3s;
}
.sim-status-info {
  margin-top: 10px;
  color: #666;
}
.feedback-section {
  margin-bottom: 18px;
}
.signal-list, .state-list {
  max-height: 120px;
  overflow-y: auto;
  font-size: 13px;
  margin-bottom: 10px;
}
.signal-item, .state-item {
  margin-bottom: 4px;
}
.analysis-section {
  margin-top: 18px;
}
.analysis-table table {
  width: 100%;
  border-collapse: collapse;
}
.analysis-table th, .analysis-table td {
  border: 1px solid #ebeef5;
  padding: 8px 10px;
  text-align: left;
  font-size: 14px;
}
.analysis-table th {
  background: #f5f7fa;
  color: #333;
}
</style> 