<template>
  <div class="road-test-simulation">
    <h1>路试回灌模块</h1>
    <div class="content">
      <div class="row">
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>数据回放</span>
              <div class="action-btns">
                <button class="btn btn-primary btn-small" @click="handleStart" :disabled="!bagFile">开始回放</button>
                <button class="btn btn-small" @click="handlePause" :disabled="!isPlaying">暂停</button>
                <button class="btn btn-small" @click="handleStop" :disabled="!isPlaying">停止</button>
              </div>
            </div>
            <div class="card-content">
              <form class="form">
                <div class="form-item">
                  <label>数据文件（bag包）</label>
                  <input type="file" @change="onBagFileChange" />
                  <span v-if="bagFile" style="margin-top: 4px; color: #409eff;">{{ bagFile.name }}</span>
                </div>
                <div class="form-item">
                  <label>选择回放topic</label>
                  <div class="topic-list">
                    <label v-for="topic in allTopics" :key="topic" class="topic-checkbox">
                      <input type="checkbox" v-model="selectedTopics" :value="topic" />
                      {{ topic }}
                    </label>
                  </div>
                </div>
                <div class="form-item">
                  <label>回放速度</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    v-model="playbackSpeed"
                    style="width: 100px; vertical-align: middle;"
                  />
                  <span style="margin-left: 10px;">{{ playbackSpeed }}x</span>
                </div>
                <div class="form-item">
                  <label>回放进度</label>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                  </div>
                  <span>{{ progress }}%</span>
                </div>
              </form>
              <div class="alert-info" style="margin-top: 18px;">
                <span class="alert-icon">🚧</span>
                <span>支持按topic回灌仿真，关键事件可手动添加、打tag与分割</span>
              </div>
              <!-- 输出记录区块 -->
              <div class="output-record-box">
                <label>输出记录（所选topic实时输出）</label>
                <div class="output-list">
                  <div v-for="topic in selectedTopics" :key="topic" class="output-item">
                    <span class="output-topic">{{ topic }}</span>
                    <span class="output-value">{{ getTopicOutput(topic) }}</span>
                  </div>
                </div>
                <button class="btn btn-small" @click="saveOutputRecord" :disabled="!selectedTopics.length">保存输出记录</button>
                <span v-if="outputSaved" style="color: #67c23a; margin-left: 10px;">已保存</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>关键事件提取与分割</span>
              <button class="btn btn-primary btn-small" @click="addEvent">添加事件</button>
            </div>
            <div class="card-content">
              <div v-if="events.length === 0" class="event-extract-placeholder">
                <p>暂无关键事件，请手动添加</p>
              </div>
              <div v-else>
                <table class="event-table">
                  <thead>
                    <tr>
                      <th>事件类型</th>
                      <th>时间戳</th>
                      <th>tag</th>
                      <th>描述</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(event, idx) in events" :key="idx">
                      <td><input v-model="event.type" class="tag-input" placeholder="类型" /></td>
                      <td><input v-model="event.timestamp" class="tag-input" placeholder="时间戳" /></td>
                      <td><input v-model="event.tag" class="tag-input" placeholder="输入tag" /></td>
                      <td><input v-model="event.desc" class="tag-input" placeholder="描述" /></td>
                      <td>
                        <button class="btn btn-small" @click="downloadEventBag(event)">分割提取bag片段（±30s）</button>
                        <button class="btn btn-small btn-danger" @click="removeEvent(idx)">删除</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const playbackSpeed = ref(1)
const bagFile = ref<File|null>(null)
const allTopics = ref([
  '/camera/front',
  '/lidar/points',
  '/can_bus',
  '/imu/data',
  '/gps/fix',
  '/radar/objects',
  '/perception/obstacles'
])
const selectedTopics = ref<string[]>(['/camera/front', '/lidar/points'])
const isPlaying = ref(false)
const progress = ref(0)
const events = ref<any[]>([{ type: '', timestamp: '', tag: '', desc: '' }])
const outputSaved = ref(false)

function onBagFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    bagFile.value = input.files[0]
  }
}

function handleStart() {
  isPlaying.value = true
  progress.value = 0
  outputSaved.value = false
  // 仅模拟进度，不自动生成事件
  const interval = setInterval(() => {
    if (!isPlaying.value) {
      clearInterval(interval)
      return
    }
    if (progress.value < 100) {
      progress.value += 2
    } else {
      isPlaying.value = false
      clearInterval(interval)
    }
  }, 300)
}

function handlePause() {
  isPlaying.value = false
}

function handleStop() {
  isPlaying.value = false
  progress.value = 0
}

function addEvent() {
  events.value.push({ type: '', timestamp: '', tag: '', desc: '' })
}

function removeEvent(idx: number) {
  events.value.splice(idx, 1)
}

function downloadEventBag(event: any) {
  alert(`已导出事件"${event.tag || event.type}"的bag片段（${event.timestamp}，前后30s）`)
}

function getTopicOutput(topic: string) {
  return `示例输出：${topic} 数据...`
}
function saveOutputRecord() {
  outputSaved.value = true
  setTimeout(() => { outputSaved.value = false }, 1500)
}
</script>

<style scoped>
.road-test-simulation {
  padding: 20px;
  max-width: 1200px;
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
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
.card-content {
  min-height: 200px;
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
.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
}
.topic-checkbox {
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 6px 0;
}
.progress-fill {
  height: 100%;
  background: #409eff;
  transition: width 0.3s;
}
.action-btns {
  display: flex;
  gap: 8px;
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
}
.btn-primary {
  background: #409eff;
  color: #fff;
}
.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}
.btn:disabled {
  background: #c0c4cc;
  color: #fff;
  cursor: not-allowed;
}
.btn:hover:not(:disabled) {
  filter: brightness(0.95);
}
.btn-danger {
  background: #f56c6c;
  color: #fff;
}
.alert-info {
  display: flex;
  align-items: center;
  background: #f4f4f5;
  color: #909399;
  border-radius: 4px;
  padding: 8px 14px;
  font-size: 15px;
  border-left: 5px solid #909399;
  gap: 8px;
  margin-top: 10px;
}
.alert-icon {
  font-size: 20px;
}
.event-extract-placeholder {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #bbb;
  font-size: 16px;
}
.event-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  table-layout: fixed;
}
.event-table th, .event-table td {
  border: 1px solid #ebeef5;
  padding: 8px 10px;
  text-align: left;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.event-table th {
  background: #f5f7fa;
  color: #333;
}
.event-table th:nth-child(1), .event-table td:nth-child(1) { width: 90px; }
.event-table th:nth-child(2), .event-table td:nth-child(2) { width: 100px; }
.event-table th:nth-child(3), .event-table td:nth-child(3) { width: 90px; }
.event-table th:nth-child(4), .event-table td:nth-child(4) { width: 160px; }
.event-table th:nth-child(5), .event-table td:nth-child(5) { width: 170px; }
.tag-input {
  width: 100%;
  max-width: 140px;
  min-width: 60px;
  box-sizing: border-box;
  padding: 2px 6px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.output-record-box {
  margin-top: 24px;
  background: #f8f8f8;
  border-radius: 6px;
  padding: 12px 16px;
}
.output-record-box label {
  font-size: 15px;
  color: #333;
  font-weight: bold;
}
.output-list {
  margin: 10px 0 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
}
.output-item {
  font-size: 13px;
  color: #555;
  background: #fff;
  border-radius: 4px;
  padding: 4px 10px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  gap: 8px;
}
.output-topic {
  color: #409eff;
  font-weight: bold;
}
.output-value {
  color: #666;
}
</style> 