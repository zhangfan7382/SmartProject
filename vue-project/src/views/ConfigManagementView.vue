<template>
  <div class="config-management">
    <!-- <h1 style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 22px;">⚙️</span>
      配置管理模块
    </h1> -->
    <h1>配置管理模块</h1>
    <div class="alert-info">
      <span class="alert-icon">ℹ️</span>
      <span>自动对待测模块进行配置修改，并生成可运行的软件包</span>
    </div>
    <div class="row">
      <div class="col col-16">
        <div class="box-card">
          <div class="card-header">
            <span>模块选择与配置</span>
            <div class="action-btns">
              <button class="btn btn-success" @click="handleSaveConfig">保存配置</button>
              <button class="btn btn-primary" @click="handleGenerate">生成软件包</button>
            </div>
          </div>
          <div class="card-content">
            <div class="config-tabs">
              <div class="tab-nav">
                <div 
                  v-for="tab in tabs" 
                  :key="tab.key" 
                  class="tab-item" 
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                >
                  {{ tab.name }}
                </div>
              </div>
              
              <!-- 基础配置 -->
              <div v-if="activeTab === 'base'" class="tab-content">
                <div class="form-section">
                  <h3>基础配置</h3>
                  
                  <div class="form-item">
                    <label>构建类型</label>
                    <div class="radio-group">
                      <label class="radio">
                        <input type="radio" v-model="buildType" value="full" />
                        <span>整包构建</span>
                      </label>
                      <label class="radio">
                        <input type="radio" v-model="buildType" value="module" />
                        <span>模块级构建</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="form-item">
                    <label>构建环境</label>
                    <select v-model="config.environment">
                      <option value="dev">开发环境</option>
                      <option value="test">测试环境</option>
                      <option value="prod">生产环境</option>
                    </select>
                  </div>
                  
                  <div class="form-item">
                    <label>版本标识</label>
                    <input v-model="config.version" placeholder="例如: v1.2.3" />
                  </div>
                  
                  <div class="form-item">
                    <label>日志级别</label>
                    <select v-model="config.logLevel">
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warn">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- 模块选择 -->
              <div v-if="activeTab === 'modules'" class="tab-content">
                <div class="form-section">
                  <h3>模块选择</h3>
                  <p class="section-desc">选择需要构建的模块，构建类型为模块级时生效</p>
                  
                  <div class="module-selection">
                    <div v-for="module in modules" :key="module.key" class="module-item">
                      <div class="checkbox-wrapper">
                        <input type="checkbox" :id="module.key" v-model="module.selected" />
                        <label :for="module.key">{{ module.name }}</label>
                      </div>
                      <span class="module-desc">{{ module.description }}</span>
                    </div>
                  </div>
                  
                  <div class="form-item">
                    <button class="btn" @click="selectAllModules">全选</button>
                    <button class="btn" @click="deselectAllModules">取消全选</button>
                  </div>
                </div>
              </div>
              
              <!-- 高级配置 -->
              <div v-if="activeTab === 'advanced'" class="tab-content">
                <div class="form-section">
                  <h3>高级配置</h3>
                  <p class="section-desc">配置模块间依赖关系和自定义参数</p>
                  
                  <div class="form-item">
                    <label>模块依赖关系</label>
                    <div class="dependency-graph">
                      <div v-for="module in modules.filter(m => m.selected)" :key="module.key" class="dependency-module">
                        <div class="module-name">{{ module.name }}</div>
                        <div class="dependency-select">
                          <select v-model="module.dependency" multiple>
                            <option v-for="dep in modules.filter(m => m.key !== module.key)" :key="dep.key" :value="dep.key">
                              {{ dep.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-item">
                    <label>环境变量设置</label>
                    <div class="env-vars">
                      <div v-for="(env, index) in environmentVars" :key="index" class="env-var-item">
                        <input v-model="env.key" placeholder="变量名" />
                        <input v-model="env.value" placeholder="变量值" />
                        <button class="btn btn-small btn-danger" @click="removeEnvVar(index)">删除</button>
                      </div>
                      <button class="btn btn-small" @click="addEnvVar">添加环境变量</button>
                    </div>
                  </div>
                  
                  <div class="form-item">
                    <label>自定义配置文件</label>
                    <div class="file-upload">
                      <label class="upload-btn">
                        <input type="file" @change="handleFileUpload" hidden />
                        <span>选择文件</span>
            </label>
                      <span v-if="uploadedFile" class="file-name">{{ uploadedFile }}</span>
                      <span v-else class="file-name">未选择文件</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 配置预览 -->
        <div class="box-card" v-if="configPreview">
          <div class="card-header">
            <span>配置预览</span>
            <button class="btn btn-small" @click="toggleJsonView">{{ showJson ? '表格视图' : 'JSON视图' }}</button>
          </div>
          <div class="card-content">
            <div v-if="showJson" class="json-preview">
              <pre>{{ JSON.stringify(configPreview, null, 2) }}</pre>
            </div>
            <div v-else class="table-preview">
              <table class="config-table">
                <thead>
                  <tr>
                    <th>配置项</th>
                    <th>值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in configPreview" :key="key">
                    <td>{{ key }}</td>
                    <td>{{ typeof value === 'object' ? JSON.stringify(value) : value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col col-8">
        <!-- 生成的软件包 -->
        <div class="box-card">
          <div class="card-header">
            <span>软件包</span>
          </div>
          <div class="card-content">
            <div v-if="packageUrl" class="package-info">
              <div class="package-status success">
                <span class="status-icon">✓</span>
                <span>软件包生成成功</span>
              </div>
              <div class="package-details">
                <div class="detail-item">
                  <span class="detail-label">版本:</span>
                  <span class="detail-value">{{ config.version }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">构建时间:</span>
                  <span class="detail-value">{{ buildTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">大小:</span>
                  <span class="detail-value">{{ packageSize }}</span>
                </div>
              </div>
              <div class="package-actions">
                <button class="btn btn-primary" @click="handleDownload">下载软件包</button>
                <button class="btn" @click="copyPackageUrl">复制下载链接</button>
              </div>
            </div>
            <div v-else class="empty-package">
              <div class="empty-icon">📦</div>
              <div class="empty-text">尚未生成软件包</div>
              <div class="empty-desc">配置完成后点击"生成软件包"按钮</div>
            </div>
          </div>
        </div>
        
        <!-- 操作流程 -->
        <div class="box-card" style="margin-top: 20px;">
          <div class="card-header">
            <span>操作流程</span>
          </div>
          <div class="card-content">
            <div class="process-steps">
              <div class="process-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <div class="step-title">选择模块和配置</div>
                  <div class="step-desc">选择需要构建的模块并设置相关配置参数</div>
                </div>
              </div>
              <div class="process-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <div class="step-title">设置模块依赖</div>
                  <div class="step-desc">配置模块间依赖关系和环境变量</div>
                </div>
              </div>
              <div class="process-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <div class="step-title">生成软件包</div>
                  <div class="step-desc">系统自动编译并生成可运行的软件包</div>
                </div>
              </div>
              <div class="process-step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <div class="step-title">下载与部署</div>
                  <div class="step-desc">下载软件包并部署到目标环境</div>
                </div>
              </div>
            </div>
            <div class="feature-list">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>支持整包或模块级编译与部署</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>模块配置项动态化管理</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>自动处理模块间依赖关系</span>
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

const activeTab = ref('base')
const buildType = ref('full')
const showJson = ref(false)
const uploadedFile = ref('')

const config = ref({
  environment: 'dev',
  version: 'v1.0.0',
  logLevel: 'info',
  buildType: 'full'
})

const modules = ref([
  { 
    key: 'perception', 
    name: 'Perception 感知', 
    selected: true, 
    description: '识别和分类周围环境的对象和特征',
    dependency: []
  },
  { 
    key: 'road_model', 
    name: 'Road Model 道路模型', 
    selected: true, 
    description: '构建道路环境的高精度模型',
    dependency: ['perception']
  },
  { 
    key: 'prediction', 
    name: 'Prediction 预测', 
    selected: true, 
    description: '预测其他道路使用者的行为和意图',
    dependency: ['perception', 'road_model']
  },
  { 
    key: 'planning', 
    name: 'Planning 规划', 
    selected: true, 
    description: '生成安全、平稳的行驶轨迹',
    dependency: ['prediction', 'road_model']
  },
  { 
    key: 'control', 
    name: 'Control 控制', 
    selected: true, 
    description: '执行规划轨迹的车辆控制',
    dependency: ['planning']
  },
  { 
    key: 'obsl', 
    name: 'OBSL 系统', 
    selected: false, 
    description: '车载行为语义学习系统',
    dependency: ['perception']
  },
  { 
    key: 'active_safety', 
    name: 'Active Safety 主动安全', 
    selected: false, 
    description: '紧急情况的安全干预系统',
    dependency: ['perception', 'prediction']
  }
])

const environmentVars = ref([
  { key: 'DEBUG_MODE', value: 'true' },
  { key: 'LOG_PATH', value: '/var/log/sadp' }
])

const packageUrl = ref('')
const buildTime = ref('')
const packageSize = ref('')

const tabs = [
  { key: 'base', name: '基础配置' },
  { key: 'modules', name: '模块选择' },
  { key: 'advanced', name: '高级配置' }
]

const configPreview = computed(() => {
  if (!config.value) return null
  
  const selectedModules = modules.value
    .filter(m => m.selected)
    .map(m => ({
      key: m.key,
      name: m.name,
      dependencies: m.dependency
    }))
  
  return {
    buildType: buildType.value,
    environment: config.value.environment,
    version: config.value.version,
    logLevel: config.value.logLevel,
    modules: selectedModules,
    environmentVariables: environmentVars.value.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {}),
    customConfigFile: uploadedFile.value || null
  }
})

const selectAllModules = () => {
  modules.value.forEach(module => module.selected = true)
}

const deselectAllModules = () => {
  modules.value.forEach(module => module.selected = false)
}

const addEnvVar = () => {
  environmentVars.value.push({ key: '', value: '' })
}

const removeEnvVar = (index: number) => {
  environmentVars.value.splice(index, 1)
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    uploadedFile.value = input.files[0].name
  }
}

const toggleJsonView = () => {
  showJson.value = !showJson.value
}

const handleSaveConfig = () => {
  // 这里可以调用后端API保存配置
  console.log('保存配置', configPreview.value)
}

const handleGenerate = () => {
  // 这里可以调用后端API生成软件包
  console.log('生成软件包', configPreview.value)
  
  // 模拟生成软件包
  setTimeout(() => {
    packageUrl.value = 'https://example.com/download/sadp-package-v1.0.0.zip'
    buildTime.value = new Date().toLocaleString()
    packageSize.value = '256.4 MB'
  }, 1500)
}

const handleDownload = () => {
  window.open(packageUrl.value, '_blank')
}

const copyPackageUrl = () => {
  navigator.clipboard.writeText(packageUrl.value)
  alert('下载链接已复制到剪贴板')
}
</script>

<style scoped>
.config-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.alert-info {
  display: flex;
  align-items: center;
  background: #f0f7ff;
  color: #0068d9;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 15px;
  border-left: 5px solid #0068d9;
  gap: 8px;
}

.alert-icon {
  font-size: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.col {
  min-width: 300px;
  box-sizing: border-box;
}

.col-16 {
  flex: 1 1 600px;
  min-width: 500px;
  max-width: 750px;
}

.col-8 {
  flex: 0 0 350px;
  max-width: 350px;
}

.box-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  padding: 18px 20px 20px 20px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 15px;
}

.card-content {
  min-height: 100px;
}

.action-btns {
  display: flex;
  gap: 10px;
}

.config-tabs {
  display: flex;
  flex-direction: column;
}

.tab-nav {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 15px;
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #606266;
  transition: all 0.3s;
}

.tab-item.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.tab-content {
  flex: 1;
}

.form-section {
  margin-bottom: 20px;
}

.form-section h3 {
  font-size: 16px;
  margin: 0 0 10px 0;
  color: #333;
}

.section-desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 15px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.form-item input, .form-item select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio input {
  margin-right: 5px;
}

.module-selection {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.module-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px dashed #f0f0f0;
  padding-bottom: 8px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}

.module-desc {
  font-size: 13px;
  color: #909399;
  margin-left: 20px;
  margin-top: 3px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: #f5f5f5;
  color: #333;
  transition: background 0.2s;
}

.btn-primary {
  background: #409eff;
  color: #fff;
}

.btn-success {
  background: #67c23a;
  color: #fff;
}

.btn-danger {
  background: #f56c6c;
  color: #fff;
}

.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}

.btn:hover {
  filter: brightness(0.95);
}

.dependency-graph {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.dependency-module {
  margin-bottom: 15px;
}

.module-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.dependency-select select {
  width: 100%;
  min-height: 80px;
}

.env-vars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.env-var-item {
  display: flex;
  gap: 10px;
}

.env-var-item input {
  flex: 1;
}

.upload-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}

.file-name {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
}

.json-preview {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  overflow: auto;
  max-height: 300px;
}

.json-preview pre {
  margin: 0;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.config-table {
  width: 100%;
  border-collapse: collapse;
}

.config-table th, .config-table td {
  border: 1px solid #ebeef5;
  padding: 8px 10px;
  text-align: left;
  font-size: 14px;
}

.config-table th {
  background: #f5f7fa;
  color: #333;
}

.package-info {
  padding: 15px;
  border: 1px solid #e1f3d8;
  border-radius: 4px;
  background: #f0f9eb;
}

.package-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #67c23a;
  margin-bottom: 15px;
  font-size: 16px;
}

.package-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  margin-bottom: 5px;
}

.detail-label {
  width: 80px;
  color: #909399;
  font-size: 14px;
}

.detail-value {
  color: #333;
  font-size: 14px;
}

.package-actions {
  display: flex;
  gap: 10px;
}

.empty-package {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  color: #c0c4cc;
}

.empty-text {
  font-size: 16px;
  color: #909399;
  margin-bottom: 5px;
}

.empty-desc {
  font-size: 14px;
  color: #c0c4cc;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.process-step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: bold;
  margin-bottom: 3px;
  font-size: 14px;
}

.step-desc {
  font-size: 13px;
  color: #606266;
}

.feature-list {
  margin-top: 20px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #67c23a;
  color: white;
  font-size: 12px;
}
</style> 