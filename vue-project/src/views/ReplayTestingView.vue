<template>
  <div class="replay-testing">
    <h1>回灌测试模块</h1>
    <div class="content">
      <div class="row">
        <div class="col col-16">
          <div class="box-card">
            <div class="card-header">
              <span>测试回放</span>
              <div class="header-actions">
                <button class="btn btn-primary btn-small" @click="handleStart">开始回放</button>
                <button class="btn btn-warning btn-small" @click="handlePause">暂停</button>
                <button class="btn btn-info btn-small" @click="handleStop">停止</button>
              </div>
            </div>
            <div class="card-content">
              <div class="video-container">
                <!-- 这里将添加视频播放器 -->
                <div class="video-placeholder">
                  <span class="video-icon">🎥</span>
                  <p>视频播放区域</p>
                </div>
              </div>
              <div class="playback-controls">
                <input type="range" min="0" max="100" v-model="playbackProgress" class="slider" />
                <div class="time-info">
                  <span>{{ currentTime }}</span>
                  <span>/</span>
                  <span>{{ totalTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-8">
          <div class="box-card">
            <div class="card-header">
              <span>测试数据</span>
            </div>
            <div class="card-content">
              <form class="form">
                <div class="form-item">
                  <label>测试文件</label>
                  <input type="file" />
                </div>
                <div class="form-item">
                  <label>回放速度</label>
                  <select v-model="playbackSpeed" class="select">
                    <option value="0.5">0.5x</option>
                    <option value="1.0">1.0x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2.0">2.0x</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const playbackProgress = ref(0)
const playbackSpeed = ref('1.0')
const currentTime = ref('00:00:00')
const totalTime = ref('00:10:00')

const handleStart = () => {
  console.log('开始回放')
}

const handlePause = () => {
  console.log('暂停回放')
}

const handleStop = () => {
  console.log('停止回放')
}
</script>

<style scoped>
.replay-testing {
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
.col-16 {
  flex: 1 1 600px;
  min-width: 400px;
  max-width: 900px;
}
.col-8 {
  flex: 0 0 340px;
  max-width: 340px;
}
.box-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  padding: 18px 20px 20px 20px;
  margin-bottom: 20px;
  min-height: 320px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.card-content {
  min-height: 180px;
}
.video-container {
  width: 100%;
  height: 400px;
  background-color: #000;
  margin-bottom: 20px;
}
.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.video-icon {
  font-size: 48px;
  margin-bottom: 10px;
}
.playback-controls {
  padding: 0 20px;
}
.slider {
  width: 100%;
  margin: 10px 0;
}
.time-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #666;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.form-item label {
  font-size: 14px;
  color: #666;
  min-width: 70px;
}
.select {
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 15px;
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
.btn-warning {
  background: #e6a23c;
  color: #fff;
}
.btn-info {
  background: #909399;
  color: #fff;
}
.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}
.btn:hover {
  filter: brightness(0.95);
}
</style> 