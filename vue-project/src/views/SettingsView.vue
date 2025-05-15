<script setup lang="ts">
import { ref } from 'vue'

interface SystemSettings {
  serverUrl: string;
  apiKey: string;
  maxConcurrentTasks: number;
  notificationEnabled: boolean;
  autoSaveInterval: number;
  theme: string;
  language: string;
}

const settings = ref<SystemSettings>({
  serverUrl: 'http://localhost:8080',
  apiKey: '********',
  maxConcurrentTasks: 5,
  notificationEnabled: true,
  autoSaveInterval: 5,
  theme: 'light',
  language: 'zh'
})

const saveSettings = () => {
  console.log('保存设置:', settings.value)
  // 实现保存设置的逻辑
}
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h2>系统设置</h2>
      <p>配置系统参数和个性化选项</p>
    </div>

    <div class="settings-container">
      <form @submit.prevent="saveSettings">
        <div class="settings-section">
          <h3>基本设置</h3>
          <div class="form-group">
            <label>服务器地址</label>
            <input type="text" v-model="settings.serverUrl">
          </div>
          <div class="form-group">
            <label>API密钥</label>
            <input type="password" v-model="settings.apiKey">
          </div>
        </div>

        <div class="settings-section">
          <h3>任务配置</h3>
          <div class="form-group">
            <label>最大并发任务数</label>
            <input type="number" v-model="settings.maxConcurrentTasks" min="1" max="10">
          </div>
          <div class="form-group">
            <label>启用通知</label>
            <div class="toggle-switch">
              <input type="checkbox" v-model="settings.notificationEnabled" id="notification">
              <label for="notification"></label>
            </div>
          </div>
          <div class="form-group">
            <label>自动保存间隔（分钟）</label>
            <input type="number" v-model="settings.autoSaveInterval" min="1" max="60">
          </div>
        </div>

        <div class="settings-section">
          <h3>界面设置</h3>
          <div class="form-group">
            <label>主题</label>
            <select v-model="settings.theme">
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>
          <div class="form-group">
            <label>语言</label>
            <select v-model="settings.language">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn">保存设置</button>
          <button type="button" class="reset-btn">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
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

.settings-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section h3 {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.form-group label {
  width: 200px;
  color: #4a5568;
  font-size: 1rem;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group input[type="number"],
.form-group select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  max-width: 400px;
}

.toggle-switch {
  position: relative;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: .4s;
  border-radius: 34px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #4299e1;
}

.toggle-switch input:checked + label:before {
  transform: translateX(26px);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.save-btn,
.reset-btn {
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn {
  background-color: #4299e1;
  color: white;
  border: none;
}

.save-btn:hover {
  background-color: #3182ce;
}

.reset-btn {
  background-color: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.reset-btn:hover {
  background-color: #f7fafc;
}

@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-group label {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .form-group input[type="text"],
  .form-group input[type="password"],
  .form-group input[type="number"],
  .form-group select {
    width: 100%;
    max-width: none;
  }
}
</style> 