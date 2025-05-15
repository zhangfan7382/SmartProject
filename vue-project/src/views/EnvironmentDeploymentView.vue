<template>
  <div class="environment-deployment">
    <h1>环境部署模块</h1>
    <div class="content">
      <div class="row">
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>环境配置</span>
              <button class="btn btn-primary btn-small" @click="handleSave">保存配置</button>
            </div>
            <div class="card-content">
              <form class="form">
                <div class="form-item">
                  <label>环境名称</label>
                  <input v-model="envConfig.name" placeholder="请输入环境名称" />
                </div>
                <div class="form-item">
                  <label>部署路径</label>
                  <input v-model="envConfig.path" placeholder="请输入部署路径" />
                </div>
                <div class="form-item">
                  <label>运行模式</label>
                  <select v-model="envConfig.mode">
                    <option value="">请选择运行模式</option>
                    <option value="dev">开发模式</option>
                    <option value="test">测试模式</option>
                    <option value="prod">生产模式</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>部署状态</span>
              <button class="btn btn-success btn-small" @click="handleDeploy">开始部署</button>
            </div>
            <div class="card-content">
              <div class="steps">
                <div v-for="(step, idx) in stepTitles" :key="idx" class="step" :class="{active: idx < deployStep, current: idx === deployStep}">
                  <span class="step-index">{{ idx + 1 }}</span>
                  <span class="step-title">{{ step }}</span>
                  <span v-if="idx < stepTitles.length - 1" class="step-line"></span>
                </div>
              </div>
              <div class="deploy-log">
                <p v-for="(log, index) in deployLogs" :key="index">{{ log }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const envConfig = ref({
  name: '',
  path: '',
  mode: ''
})

const deployStep = ref(0)
const deployLogs = ref<string[]>([])
const stepTitles = [
  '环境检查',
  '文件部署',
  '服务启动',
  '部署完成'
]

const handleSave = () => {
  console.log('保存配置', envConfig.value)
}

const handleDeploy = () => {
  deployStep.value = 0
  deployLogs.value = []
  const steps = [
    '开始环境检查...',
    '环境检查完成',
    '开始文件部署...',
    '文件部署完成',
    '启动服务...',
    '服务启动成功',
    '部署完成'
  ]
  let currentStep = 0
  const timer = setInterval(() => {
    if (currentStep < steps.length) {
      deployLogs.value.push(steps[currentStep])
      if (currentStep % 2 === 1) {
        deployStep.value++
      }
      currentStep++
    } else {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
.environment-deployment {
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
  flex: 1 1 480px;
  min-width: 480px;
  max-width: 100%;
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
.form-item input, .form-item select {
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
}
.btn-primary {
  background: #409eff;
  color: #fff;
}
.btn-success {
  background: #67c23a;
  color: #fff;
}
.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}
.btn:hover {
  filter: brightness(0.95);
}
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  margin-top: 10px;
  padding: 0 20px;
}
.step {
  display: flex;
  align-items: center;
  position: relative;
  flex-shrink: 0;
}
.step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ebeef5;
  color: #909399;
  font-size: 13px;
  font-weight: bold;
  margin-right: 4px;
  border: 2px solid #ebeef5;
  transition: all 0.2s;
}
.step.active .step-index {
  background: #67c23a;
  color: #fff;
  border-color: #67c23a;
}
.step.current .step-index {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.step-title {
  font-size: 13px;
  color: #666;
  margin-right: 5px;
  white-space: nowrap;
}
.step-line {
  width: 25px;
  height: 2px;
  background: #ebeef5;
  margin: 0 4px;
  border-radius: 1px;
}
.step.active .step-line {
  background: #67c23a;
}
.step.current .step-line {
  background: #409eff;
}
.deploy-log {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow-y: auto;
}
.deploy-log p {
  margin: 5px 0;
  font-family: monospace;
  color: #666;
}
</style> 