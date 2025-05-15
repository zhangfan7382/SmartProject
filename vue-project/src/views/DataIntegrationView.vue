<template>
  <div class="data-integration">
    <h1>数据链路与平台集成</h1>
    <div class="content">
      <div class="row">
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>数据上传/下载管理</span>
            </div>
            <div class="card-content">
              <div class="upload-section">
                <div class="upload-area">
                  <input type="file" id="file-upload" class="file-input" multiple @change="handleFileUpload">
                  <label for="file-upload" class="upload-btn">
                    <i class="upload-icon">📤</i>
                    选择文件上传
                  </label>
                  <p class="upload-tip">支持批量上传，最大文件大小：2GB</p>
                </div>
                <div class="upload-list" v-if="uploadedFiles.length > 0">
                  <div v-for="(file, index) in uploadedFiles" :key="index" class="upload-item">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ formatFileSize(file.size) }}</span>
                    <span class="upload-status" :class="file.status">{{ file.statusText }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>云端平台对接</span>
            </div>
            <div class="card-content">
              <div class="platform-section">
                <div class="platform-list">
                  <div class="platform-item">
                    <div class="platform-icon">☁️</div>
                    <div class="platform-info">
                      <h4>阿里云 OSS</h4>
                      <p>状态：{{ platformStatus.aliyun ? '已连接' : '未连接' }}</p>
                    </div>
                    <button class="btn" :class="{ 'btn-success': platformStatus.aliyun }" @click="togglePlatform('aliyun')">
                      {{ platformStatus.aliyun ? '断开连接' : '连接' }}
                    </button>
                  </div>
                  <div class="platform-item">
                    <div class="platform-icon">☁️</div>
                    <div class="platform-info">
                      <h4>AWS S3</h4>
                      <p>状态：{{ platformStatus.aws ? '已连接' : '未连接' }}</p>
                    </div>
                    <button class="btn" :class="{ 'btn-success': platformStatus.aws }" @click="togglePlatform('aws')">
                      {{ platformStatus.aws ? '断开连接' : '连接' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>场景库管理</span>
            </div>
            <div class="card-content">
              <div class="scenario-section">
                <div class="scenario-filters">
                  <div class="filter-item">
                    <label>标签筛选：</label>
                    <select v-model="selectedTags" multiple>
                      <option value="urban">城市道路</option>
                      <option value="highway">高速公路</option>
                      <option value="parking">停车场</option>
                      <option value="intersection">交叉路口</option>
                    </select>
                  </div>
                  <div class="filter-item">
                    <label>场景类型：</label>
                    <select v-model="selectedType">
                      <option value="all">全部</option>
                      <option value="normal">常规场景</option>
                      <option value="corner">极端场景</option>
                    </select>
                  </div>
                </div>
                <div class="scenario-list">
                  <div v-for="scenario in filteredScenarios" :key="scenario.id" class="scenario-item">
                    <div class="scenario-info">
                      <h4>{{ scenario.name }}</h4>
                      <div class="scenario-tags">
                        <span v-for="tag in scenario.tags" :key="tag" class="tag">{{ tag }}</span>
                      </div>
                    </div>
                    <div class="scenario-actions">
                      <button class="btn btn-small" @click="viewScenario(scenario)">查看</button>
                      <button class="btn btn-small" @click="downloadScenario(scenario)">下载</button>
                    </div>
                  </div>
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

// 文件上传相关
const uploadedFiles = ref<Array<{name: string, size: number, status: string, statusText: string}>>([])

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    Array.from(input.files).forEach(file => {
      uploadedFiles.value.push({
        name: file.name,
        size: file.size,
        status: 'uploading',
        statusText: '上传中...'
      })
    })
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 平台状态
const platformStatus = ref({
  aliyun: false,
  aws: false
})

const togglePlatform = (platform: 'aliyun' | 'aws') => {
  platformStatus.value[platform] = !platformStatus.value[platform]
}

// 场景库管理
const selectedTags = ref<string[]>([])
const selectedType = ref('all')

const scenarios = ref([
  {
    id: 1,
    name: '城市道路跟车场景',
    tags: ['urban', 'following'],
    type: 'normal'
  },
  {
    id: 2,
    name: '高速公路变道场景',
    tags: ['highway', 'lane_change'],
    type: 'normal'
  },
  {
    id: 3,
    name: '停车场泊车场景',
    tags: ['parking', 'parking'],
    type: 'corner'
  }
])

const filteredScenarios = computed(() => {
  return scenarios.value.filter(scenario => {
    const matchTags = selectedTags.value.length === 0 || 
      selectedTags.value.some(tag => scenario.tags.includes(tag))
    const matchType = selectedType.value === 'all' || scenario.type === selectedType.value
    return matchTags && matchType
  })
})

const viewScenario = (scenario: any) => {
  console.log('查看场景:', scenario)
}

const downloadScenario = (scenario: any) => {
  console.log('下载场景:', scenario)
}
</script>

<style scoped>
.data-integration {
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
  align-items: center;
  gap: 12px;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.card-content {
  min-height: 120px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
}

.file-input {
  display: none;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.upload-btn:hover {
  background: #66b1ff;
}

.upload-tip {
  margin-top: 8px;
  color: #909399;
  font-size: 13px;
}

.upload-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.file-name {
  flex: 1;
  font-size: 14px;
}

.file-size {
  color: #909399;
  font-size: 13px;
}

.upload-status {
  font-size: 13px;
}

.upload-status.uploading {
  color: #e6a23c;
}

.upload-status.success {
  color: #67c23a;
}

.upload-status.error {
  color: #f56c6c;
}

.platform-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.platform-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.platform-icon {
  font-size: 24px;
}

.platform-info {
  flex: 1;
}

.platform-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.platform-info p {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

.btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: #f5f5f5;
  color: #333;
  transition: background 0.2s;
}

.btn-success {
  background: #67c23a;
  color: white;
}

.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}

.scenario-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scenario-filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #606266;
}

.filter-item select {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.scenario-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scenario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.scenario-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.scenario-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 2px 6px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 3px;
  font-size: 12px;
}

.scenario-actions {
  display: flex;
  gap: 8px;
}
</style> 