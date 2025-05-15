<template>
  <div class="roadtest-eval">
    <h1>路试回灌仿真与事件评估</h1>
    <div class="section card">
      <h2>1. 提测管理（Jira集成）</h2>
      <form class="jira-form" @submit.prevent="submitJira">
        <label>Jira项目：<input v-model="jira.project" required></label>
        <label>Issue编号：<input v-model="jira.issue" required></label>
        <label>版本号：<input v-model="jira.version" required></label>
        <label>上传bag包：<input type="file" @change="handleBagUpload" required></label>
        <button class="btn" type="submit">一键提测</button>
      </form>
      <div v-if="jiraStatus" class="status-tip">{{ jiraStatus }}</div>
    </div>

    <div class="section card">
      <h2>2. 待测模块配置与软件包生成</h2>
      <div class="module-list">
        <label v-for="mod in modules" :key="mod.key" class="module-item">
          <input type="checkbox" v-model="mod.selected"> {{ mod.name }}
        </label>
      </div>
      <button class="btn" @click="generatePackage">生成待测软件包</button>
      <div v-if="packageStatus" class="status-tip">{{ packageStatus }}</div>
    </div>

    <div class="section card">
      <h2>3. 路试bag包回灌仿真</h2>
      <div class="bag-info">当前bag包：{{ bagFileName || '未选择' }}</div>
      <button class="btn" :disabled="!bagFileName" @click="startReplay">启动仿真</button>
      <div v-if="replayStatus" class="status-tip">{{ replayStatus }}</div>
      <div v-if="replayLog.length" class="log-box">
        <div v-for="(log, idx) in replayLog" :key="idx" class="log-line">{{ log }}</div>
      </div>
    </div>

    <div class="section card">
      <h2>4. 信号监测与事件提取</h2>
      <label>选择关键信号：
        <select v-model="selectedSignal" class="select">
          <option v-for="sig in signals" :key="sig" :value="sig">{{ sig }}</option>
        </select>
      </label>
      <button class="btn" :disabled="!selectedSignal" @click="extractEvents">提取事件</button>
      <div v-if="events.length" class="event-list">
        <div v-for="(evt, idx) in events" :key="idx" class="event-item">
          事件{{ idx+1 }}：时间戳 {{ evt }}
        </div>
      </div>
    </div>

    <div class="section card">
      <h2>5. 事件分割与bag导出</h2>
      <div v-if="events.length">
        <div v-for="(evt, idx) in events" :key="idx" class="split-item">
          事件{{ idx+1 }}（{{ evt }}）
          <button class="btn btn-small" @click="exportBag(evt)">导出事件bag（±30s）</button>
        </div>
      </div>
      <div v-else class="empty-tip">暂无事件，请先提取</div>
    </div>

    <div class="section card">
      <h2>6. 报告生成与推送</h2>
      <button class="btn" @click="generateReport">生成评估报告</button>
      <button class="btn" :disabled="!reportReady" @click="pushToJira">推送至Jira</button>
      <div v-if="reportStatus" class="status-tip">{{ reportStatus }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Jira提测管理
const jira = ref({ project: '', issue: '', version: '', bag: null as File | null })
const jiraStatus = ref('')
const submitJira = () => {
  jiraStatus.value = '提测信息已提交，等待处理...（此处可对接Jira API）'
}
const handleBagUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) {
    jira.value.bag = files[0]
    bagFileName.value = files[0].name
  }
}

// 待测模块配置
const modules = ref([
  { key: 'perception', name: '感知（Perception）', selected: true },
  { key: 'roadmodel', name: '道路建模（Road Model）', selected: true },
  { key: 'prediction', name: '预测（Prediction）', selected: true },
  { key: 'planning', name: '规划（Planning）', selected: true },
  { key: 'control', name: '控制（Control）', selected: true },
  { key: 'obsl', name: 'OBSL', selected: false },
  { key: 'activesafety', name: '主动安全（Active Safety）', selected: false }
])
const packageStatus = ref('')
const generatePackage = () => {
  packageStatus.value = '已生成待测软件包（此处可对接CI/CD或构建API）'
}

// bag回灌仿真
const bagFileName = ref('')
const replayStatus = ref('')
const replayLog = ref<string[]>([])
const startReplay = () => {
  replayStatus.value = '仿真进行中...（此处可对接仿真API）'
  replayLog.value = ['仿真启动', '模块加载', '数据回灌', '仿真完成']
}

// 信号监测与事件提取
const signals = ref(['信号A', '信号B', '信号C'])
const selectedSignal = ref('')
const events = ref<number[]>([])
const extractEvents = () => {
  // 模拟事件时间戳
  events.value = [1680001234, 1680002345, 1680003456]
}

// 事件分割与bag导出
const exportBag = (evt: number) => {
  alert(`导出事件时间戳${evt}的bag包（±30s）——此处可对接后端分割API`)
}

// 报告生成与推送
const reportReady = ref(false)
const reportStatus = ref('')
const generateReport = () => {
  reportReady.value = true
  reportStatus.value = '报告已生成，可推送至Jira（此处可对接报告生成API）'
}
const pushToJira = () => {
  reportStatus.value = '报告已推送至Jira issue comment（此处可对接Jira API）'
}
</script>

<style scoped>
.roadtest-eval {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 26px;
  margin-bottom: 18px;
}

.section {
  margin-bottom: 28px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  padding: 18px 20px 20px 20px;
}

.jira-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: center;
  margin-bottom: 10px;
}
.jira-form label {
  font-size: 15px;
}

.btn {
  padding: 7px 18px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #f5f5f5;
  color: #333;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  margin-right: 8px;
}
.btn:hover {
  background: #e6e6e6;
  border-color: #b3b3b3;
}
.btn-small {
  padding: 4px 12px;
  font-size: 13px;
}

.status-tip {
  color: #409eff;
  margin-top: 8px;
  font-size: 14px;
}

.module-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-bottom: 10px;
}
.module-item {
  font-size: 15px;
}

.bag-info {
  margin-bottom: 10px;
  font-size: 15px;
}

.log-box {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 10px 14px;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
.log-line {
  margin-bottom: 2px;
}

.select {
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 15px;
  margin-left: 4px;
}

.event-list {
  margin-top: 10px;
}
.event-item {
  background: #f8f8f8;
  border-radius: 4px;
  padding: 6px 12px;
  margin-bottom: 6px;
  font-size: 14px;
}
.split-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
}
.empty-tip {
  color: #aaa;
  font-size: 15px;
  margin: 10px 0;
}
</style> 