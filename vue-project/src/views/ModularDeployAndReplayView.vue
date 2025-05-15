<template>
  <div class="modular-deploy-replay">
    <h1>模块化部署与回灌测试</h1>

    <div class="section card">
      <h2>1. 代码模块化编译与部署</h2>
      <form class="deploy-form" @submit.prevent="deployCode">
        <label>上传代码包：<input type="file" @change="handleCodeUpload" required></label>
        <label>部署方式：
          <select v-model="deployMode" class="select">
            <option value="full">整包部署</option>
            <option value="module">单独模块部署</option>
          </select>
        </label>
        <label v-if="deployMode==='module'">选择模块：
          <select v-model="selectedModule" class="select">
            <option v-for="mod in modules" :key="mod" :value="mod">{{ mod }}</option>
          </select>
        </label>
        <button class="btn" type="submit">一键部署</button>
      </form>
      <div v-if="deployStatus" class="status-tip">{{ deployStatus }}</div>
    </div>

    <div class="section card">
      <h2>2. 移植库与第三方通信中间件支持</h2>
      <form class="lib-form" @submit.prevent="deployLib">
        <label>上传移植库文件：<input type="file" @change="handleLibUpload"></label>
        <label>第三方通信中间件：
          <select v-model="selectedMiddleware" class="select">
            <option value="">无</option>
            <option value="custom">定制开发</option>
            <option value="ros">ROS</option>
            <option value="dds">DDS</option>
          </select>
        </label>
        <button class="btn" type="submit">部署中间件/库</button>
      </form>
      <div v-if="libStatus" class="status-tip">{{ libStatus }}</div>
    </div>

    <div class="section card">
      <h2>3. 回灌测试（视频流/结构化数据）</h2>
      <div class="replay-block">
        <div class="replay-col">
          <h3>视频流回灌</h3>
          <label>云端视频流路径：<input v-model="videoPath" placeholder="如：oss://bucket/video.mp4"></label>
          <button class="btn" @click="startVideoReplay">云端回放</button>
          <div class="video-player-box" v-if="videoUrl">
            <video :src="videoUrl" controls class="video-player"></video>
          </div>
        </div>
        <div class="replay-col">
          <h3>结构化数据播包</h3>
          <label>上传结构化数据包：<input type="file" @change="handleStructDataUpload"></label>
          <button class="btn" :disabled="!structDataFile" @click="startStructReplay">开始播包</button>
          <div v-if="structReplayStatus" class="status-tip">{{ structReplayStatus }}</div>
        </div>
      </div>
      <div class="replay-block">
        <div class="replay-col">
          <h3>感知替代模型驱动</h3>
          <label>选择驱动模型：
            <select v-model="selectedModel" class="select">
              <option value="default">默认模型</option>
              <option value="custom">自定义模型</option>
            </select>
          </label>
          <button class="btn" @click="applyModel">应用模型</button>
          <div v-if="modelStatus" class="status-tip">{{ modelStatus }}</div>
        </div>
        <div class="replay-col">
          <h3>数据详情</h3>
          <div class="data-detail-box">
            <div>整车数据：{{ structDataFile ? structDataFile.name : '未上传' }}</div>
            <div>传感器数据：{{ structDataFile ? '已包含' : '未上传' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section card">
      <h2>4. 操作日志</h2>
      <div class="log-box">
        <div v-for="(log, idx) in logs" :key="idx" class="log-line">{{ log }}</div>
        <div v-if="!logs.length" class="empty-tip">暂无操作日志</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 代码模块化编译与部署
const deployMode = ref('full')
const selectedModule = ref('perception')
const modules = ref(['perception', 'roadmodel', 'prediction', 'planning', 'control', 'obsl', 'activesafety'])
const codeFile = ref<File|null>(null)
const deployStatus = ref('')
const handleCodeUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) codeFile.value = files[0]
}
const deployCode = () => {
  deployStatus.value = `已${deployMode.value==='full'?'整包':'模块'}部署${deployMode.value==='module'?('（'+selectedModule.value+'）'):''}，可对接部署API`
  logs.value.push(deployStatus.value)
}

// 移植库与中间件
const selectedMiddleware = ref('')
const libFile = ref<File|null>(null)
const libStatus = ref('')
const handleLibUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) libFile.value = files[0]
}
const deployLib = () => {
  libStatus.value = `已部署${libFile.value?libFile.value.name:'库'}，中间件：${selectedMiddleware.value||'无'}（可对接API）`
  logs.value.push(libStatus.value)
}

// 回灌测试
const videoPath = ref('')
const videoUrl = ref('')
const startVideoReplay = () => {
  videoUrl.value = videoPath.value || ''
  logs.value.push('已启动云端视频流回放')
}
const structDataFile = ref<File|null>(null)
const structReplayStatus = ref('')
const handleStructDataUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) structDataFile.value = files[0]
}
const startStructReplay = () => {
  structReplayStatus.value = '结构化数据播包已启动（可对接播包API）'
  logs.value.push(structReplayStatus.value)
}

// 感知替代模型
const selectedModel = ref('default')
const modelStatus = ref('')
const applyModel = () => {
  modelStatus.value = `已应用${selectedModel.value==='default'?'默认':'自定义'}模型（可对接模型API）`
  logs.value.push(modelStatus.value)
}

// 日志
const logs = ref<string[]>([])
</script>

<style scoped>
.modular-deploy-replay {
  max-width: 1200px;
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

.deploy-form, .lib-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: center;
  margin-bottom: 10px;
}
.deploy-form label, .lib-form label {
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

.replay-block {
  display: flex;
  gap: 32px;
  margin-bottom: 18px;
}
.replay-col {
  flex: 1;
  min-width: 260px;
}
.video-player-box {
  margin-top: 10px;
}
.video-player {
  width: 100%;
  max-width: 400px;
  border-radius: 6px;
  background: #000;
}
.data-detail-box {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  color: #666;
}
.log-box {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  color: #666;
}
.log-line {
  margin-bottom: 2px;
}
.empty-tip {
  color: #aaa;
  font-size: 15px;
  margin: 10px 0;
}
.select {
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 15px;
  margin-left: 4px;
}
</style> 