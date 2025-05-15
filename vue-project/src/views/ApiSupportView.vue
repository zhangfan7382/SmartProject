<template>
  <div class="api-support">
    <h1>接口支持模块</h1>
    <div class="content">
      <div class="row">
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>接口列表</span>
              <select v-model="filterType" class="select-type">
                <option value="">全部类型</option>
                <option v-for="type in apiTypes" :key="type" :value="type">{{ type }}</option>
              </select>
              <button class="btn btn-primary btn-small" @click="handleAdd">添加接口</button>
            </div>
            <div class="card-content">
              <table class="table">
                <thead>
                  <tr>
                    <th>接口名称</th>
                    <th style="width: 120px;">接口类型</th>
                    <th style="width: 100px;">请求方法</th>
                    <th style="width: 220px;">接口说明</th>
                    <th style="width: 100px;">状态</th>
                    <th style="width: 260px;">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(api, idx) in filteredApiList" :key="idx">
                    <td>{{ api.name }}</td>
                    <td>{{ api.type }}</td>
                    <td>
                      <span :class="['tag', 'tag-' + api.method.toLowerCase()]">{{ api.method }}</span>
                    </td>
                    <td>{{ api.desc }}</td>
                    <td>
                      <span :class="['tag', api.status === 'active' ? 'tag-success' : 'tag-info']">
                        {{ api.status === 'active' ? '启用' : '禁用' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-small" @click="handleEdit(api)">编辑</button>
                      <button class="btn btn-danger btn-small" @click="handleDelete(api)">删除</button>
                      <button class="btn btn-primary btn-small" @click="handleTest(api)">测试</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col col-12">
          <div class="box-card">
            <div class="card-header">
              <span>接口详情</span>
            </div>
            <div class="card-content">
              <form class="form" v-if="selectedApi">
                <div class="form-item">
                  <label>接口名称</label>
                  <input v-model="selectedApi.name" />
                </div>
                <div class="form-item">
                  <label>接口类型</label>
                  <select v-model="selectedApi.type">
                    <option v-for="type in apiTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
                <div class="form-item">
                  <label>请求方法</label>
                  <select v-model="selectedApi.method">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div class="form-item">
                  <label>接口地址</label>
                  <input v-model="selectedApi.url" />
                </div>
                <div class="form-item">
                  <label>接口说明</label>
                  <input v-model="selectedApi.desc" />
                </div>
                <div class="form-item">
                  <label>状态</label>
                  <label class="switch">
                    <input type="checkbox" v-model="selectedApi.status" true-value="active" false-value="inactive">
                    <span class="slider"></span>
                  </label>
                  <span class="switch-label">{{ selectedApi.status === 'active' ? '启用' : '禁用' }}</span>
                </div>
                <div class="form-item">
                  <button class="btn btn-primary" type="button" @click="handleSave">保存</button>
                </div>
              </form>
              <div v-else class="empty-state">
                <p>请选择一个接口进行编辑</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 自动化集成说明区块 -->
      <div class="automation-section card">
        <h2>自动化回灌测试接口说明</h2>
        <ul>
          <li>数据获取接口：支持自动化下载、读取、解构测试数据，适用于数据流转与自动化分析。</li>
          <li>回灌控制接口：支持自动化启动、暂停、停止仿真，便于流程编排与CI集成。</li>
          <li>可视化窗口截屏接口：支持自动化获取仿真画面，便于结果归档与对比。</li>
          <li>所有接口均可通过RESTful方式集成到自动化测试系统、pipeline或CI/CD流程。</li>
        </ul>
      </div>
      <div v-if="testDialogVisible" class="test-dialog-mask">
        <div class="test-dialog">
          <h3>接口测试结果</h3>
          <pre>{{ testResult }}</pre>
          <button class="btn btn-primary btn-small" @click="testDialogVisible=false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Api {
  name: string
  type: string
  method: string
  url: string
  desc: string
  status: 'active' | 'inactive'
}

const apiTypes = [
  '数据获取',
  '回灌控制',
  '可视化截屏',
  '其他'
]

const apiList = ref<Api[]>([
  {
    name: '获取测试数据',
    type: '数据获取',
    method: 'GET',
    url: '/api/test-data',
    desc: '自动化获取测试数据，支持下载、读取、解构',
    status: 'active'
  },
  {
    name: '提交测试结果',
    type: '数据获取',
    method: 'POST',
    url: '/api/test-results',
    desc: '自动化提交测试结果，支持数据归档',
    status: 'active'
  },
  {
    name: '回灌仿真启动',
    type: '回灌控制',
    method: 'POST',
    url: '/api/replay/start',
    desc: '自动化启动回灌仿真',
    status: 'active'
  },
  {
    name: '回灌仿真暂停',
    type: '回灌控制',
    method: 'POST',
    url: '/api/replay/pause',
    desc: '自动化暂停回灌仿真',
    status: 'active'
  },
  {
    name: '回灌仿真停止',
    type: '回灌控制',
    method: 'POST',
    url: '/api/replay/stop',
    desc: '自动化停止回灌仿真',
    status: 'active'
  },
  {
    name: '回灌进度查询',
    type: '回灌控制',
    method: 'GET',
    url: '/api/replay/progress',
    desc: '自动化查询回灌仿真进度',
    status: 'active'
  },
  {
    name: '可视化窗口截屏',
    type: '可视化截屏',
    method: 'GET',
    url: '/api/visualization/screenshot',
    desc: '自动化获取仿真可视化窗口截图',
    status: 'active'
  }
])

const filterType = ref('')
const filteredApiList = computed(() => {
  if (!filterType.value) return apiList.value
  return apiList.value.filter(api => api.type === filterType.value)
})

const selectedApi = ref<Api | null>(null)

const handleAdd = () => {
  selectedApi.value = {
    name: '',
    type: apiTypes[0],
    method: 'GET',
    url: '',
    desc: '',
    status: 'active'
  }
}

const handleEdit = (api: Api) => {
  selectedApi.value = { ...api }
}

const handleDelete = (api: Api) => {
  apiList.value = apiList.value.filter(item => item !== api)
}

const handleSave = () => {
  if (selectedApi.value) {
    const idx = apiList.value.findIndex(api => api.name === selectedApi.value!.name)
    if (idx > -1) {
      apiList.value[idx] = { ...selectedApi.value }
    } else {
      apiList.value.push({ ...selectedApi.value })
    }
    selectedApi.value = null
  }
}

// 接口测试弹窗
const testDialogVisible = ref(false)
const testResult = ref('')
const handleTest = (api: Api) => {
  testResult.value = `接口名称: ${api.name}\n类型: ${api.type}\n方法: ${api.method}\n地址: ${api.url}\n说明: ${api.desc}\n状态: ${api.status}\n\n返回示例: {\n  code: 0,\n  msg: 'success',\n  data: {...}\n}`
  testDialogVisible.value = true
}
</script>

<style scoped>
.api-support {
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
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
.card-content {
  min-height: 120px;
}
.table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  margin-top: 10px;
}
.table th, .table td {
  border: 1px solid #ebeef5;
  padding: 8px 10px;
  text-align: left;
  font-size: 14px;
}
.table th {
  background: #f5f7fa;
  color: #333;
}
.tag {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: #fff;
}
.tag-get {
  background: #67c23a;
}
.tag-post {
  background: #409eff;
}
.tag-put {
  background: #e6a23c;
}
.tag-delete {
  background: #f56c6c;
}
.tag-success {
  background: #67c23a;
}
.tag-info {
  background: #909399;
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
.form-item input, .form-item select {
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 15px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  border-radius: 22px;
  transition: .4s;
}
.switch input:checked + .slider {
  background-color: #409eff;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}
.switch input:checked + .slider:before {
  transform: translateX(18px);
}
.switch-label {
  min-width: 48px;
  color: #409eff;
  font-size: 14px;
}
.empty-state {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}
.select-type {
  margin: 0 12px;
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 15px;
}
.automation-section {
  margin-top: 30px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 18px 24px;
}
.automation-section h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
.automation-section ul {
  padding-left: 20px;
  color: #555;
  font-size: 15px;
}
.test-dialog-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.test-dialog {
  background: #fff;
  border-radius: 8px;
  padding: 28px 36px 18px 36px;
  min-width: 340px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.13);
  text-align: left;
}
.test-dialog h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
}
.test-dialog pre {
  background: #f7f7f7;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
  max-height: 220px;
  overflow: auto;
}
</style> 