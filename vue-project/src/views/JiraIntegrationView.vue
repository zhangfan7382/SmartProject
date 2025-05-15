<template>
  <div class="jira-integration">
    <!-- <h1 style="display: flex; align-items: center; gap: 10px;">
      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jira.svg" alt="Jira" style="height: 32px; vertical-align: middle;" />
      Jira集成模块
    </h1> -->
    <h1>Jira集成模块</h1>
    <div class="desc">
      <div class="alert-info">
        <span class="alert-icon">ℹ️</span>
        <span>通过Jira进行提测管理，记录版本和bag信息，自动将HTML测试报告推送至对应Issue</span>
      </div>
    </div>
    <div class="row">
      <div class="col col-8">
        <div class="box-card">
          <div class="card-header">
            <span style="font-size: 18px;">🔗</span>
            <span style="margin-left: 8px;">Jira账号绑定</span>
          </div>
          <div class="card-content">
            <form class="form" @submit.prevent="handleBind">
              <div class="form-item">
                <label>用户名</label>
                <input v-model="jiraUser.username" placeholder="Jira用户名" />
              </div>
              <div class="form-item">
                <label>API Token</label>
                <input v-model="jiraUser.token" placeholder="Jira API Token" type="password" />
              </div>
              <div class="form-item">
                <label>Jira域名</label>
                <input v-model="jiraUser.domain" placeholder="如 your-domain.atlassian.net" />
              </div>
              <div class="form-item">
                <button class="btn btn-primary" type="submit">绑定账号</button>
              </div>
            </form>
          </div>
        </div>
        <div class="box-card" style="margin-top: 20px;">
          <div class="card-header">
            <span style="font-size: 18px;">ℹ️</span>
            <span style="margin-left: 8px;">提测管理流程</span>
          </div>
          <div class="card-content">
            <div class="process-diagram">
              <div class="process-step">
                <div class="step-icon">1</div>
                <div class="step-text">绑定Jira账号</div>
              </div>
              <div class="process-arrow">→</div>
              <div class="process-step">
                <div class="step-icon">2</div>
                <div class="step-text">创建提测Issue</div>
              </div>
              <div class="process-arrow">→</div>
              <div class="process-step">
                <div class="step-icon">3</div>
                <div class="step-text">执行自动化测试</div>
              </div>
              <div class="process-arrow">→</div>
              <div class="process-step">
                <div class="step-icon">4</div>
                <div class="step-text">结果自动回传</div>
              </div>
            </div>
            <div class="feature-list">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>支持版本与bag信息自动记录</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>HTML报告自动推送至Jira评论区</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>提测状态实时追踪与反馈</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>与场景库和数据管理系统集成</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col col-16">
        <div class="box-card">
          <div class="card-header">
            <span style="font-size: 18px;">🎫</span>
            <span style="margin-left: 8px;">Jira Issue 管理</span>
            <div style="margin-left:auto; display:flex; gap:10px;">
              <button class="btn btn-default btn-small" @click="showCreateIssue = true">创建Issue</button>
              <button class="btn btn-primary btn-small" @click="handleSync">同步Jira</button>
            </div>
          </div>
          <div class="card-content">
            <div class="filter-bar">
              <div class="filter-item">
                <label>项目:</label>
                <select v-model="filterOptions.project">
                  <option value="">全部</option>
                  <option value="SADP">SADP</option>
                  <option value="AUTO">AUTO</option>
                </select>
              </div>
              <div class="filter-item">
                <label>状态:</label>
                <select v-model="filterOptions.status">
                  <option value="">全部</option>
                  <option value="待测试">待测试</option>
                  <option value="测试中">测试中</option>
                  <option value="已完成">已完成</option>
                </select>
              </div>
              <div class="filter-item">
                <label>模块:</label>
                <select v-model="filterOptions.module">
                  <option value="">全部</option>
                  <option value="perception">Perception</option>
                  <option value="planning">Planning</option>
                  <option value="control">Control</option>
                  <option value="prediction">Prediction</option>
                </select>
              </div>
              <button class="btn btn-small" @click="applyFilter">筛选</button>
            </div>
            
            <div v-if="issues.length === 0" class="empty">暂无Issue数据，点击同步Jira获取最新Issue。</div>
            <table v-else class="table">
              <thead>
                <tr>
                  <th style="width: 100px;">Key</th>
                  <th>标题</th>
                  <th style="width: 100px;">状态</th>
                  <th style="width: 100px;">模块</th>
                  <th style="width: 100px;">版本</th>
                  <th style="width: 150px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="issue in issues" :key="issue.key">
                  <td>{{ issue.key }}</td>
                  <td>{{ issue.summary }}</td>
                  <td>
                    <span :class="['status-badge', issue.status.toLowerCase().replace(' ', '-')]">{{ issue.status }}</span>
                  </td>
                  <td>{{ issue.module }}</td>
                  <td>{{ issue.version }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-small" title="查看详情" @click="viewIssueDetail(issue)">查看</button>
                    <button class="btn btn-success btn-small" title="推送测试报告到该Issue" @click="handlePush(issue)">推送报告</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="box-card" style="margin-top: 20px;">
          <div class="card-header">
            <span style="font-size: 18px;">📊</span>
            <span style="margin-left: 8px;">测试报告管理</span>
          </div>
          <div class="card-content">
            <div v-if="reports.length === 0" class="empty">暂无测试报告数据</div>
            <table v-else class="table">
              <thead>
                <tr>
                  <th>报告名称</th>
                  <th style="width: 120px;">关联Issue</th>
                  <th style="width: 120px;">测试模块</th>
                  <th style="width: 150px;">生成时间</th>
                  <th style="width: 150px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(report, index) in reports" :key="index">
                  <td>{{ report.name }}</td>
                  <td>{{ report.issueKey }}</td>
                  <td>{{ report.module }}</td>
                  <td>{{ report.createdAt }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-small" title="查看报告" @click="viewReport(report)">查看</button>
                      <button class="btn btn-primary btn-small" title="推送到Jira" @click="pushReport(report)">推送</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建Issue弹窗 -->
    <div v-if="showCreateIssue" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>创建提测Issue</h3>
          <button class="close-btn" @click="showCreateIssue = false">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form">
            <div class="form-item">
              <label>项目</label>
              <select v-model="newIssue.project">
                <option value="SADP">SADP</option>
                <option value="AUTO">AUTO</option>
              </select>
            </div>
            <div class="form-item">
              <label>标题</label>
              <input v-model="newIssue.summary" placeholder="请输入Issue标题" />
            </div>
            <div class="form-item">
              <label>测试模块</label>
              <select v-model="newIssue.module">
                <option value="perception">Perception</option>
                <option value="planning">Planning</option>
                <option value="control">Control</option>
                <option value="prediction">Prediction</option>
                <option value="road_model">Road Model</option>
                <option value="obsl">OBSL</option>
                <option value="active_safety">Active Safety</option>
              </select>
            </div>
            <div class="form-item">
              <label>软件版本</label>
              <input v-model="newIssue.version" placeholder="如 v1.2.3" />
            </div>
            <div class="form-item">
              <label>Bag信息</label>
              <textarea v-model="newIssue.bagInfo" placeholder="请输入Bag ID或描述" rows="3"></textarea>
            </div>
            <div class="form-item">
              <label>描述</label>
              <textarea v-model="newIssue.description" placeholder="请详细描述测试内容" rows="4"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showCreateIssue = false">取消</button>
          <button class="btn btn-primary" @click="createIssue">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const jiraUser = ref({
  username: '',
  token: '',
  domain: ''
})

const filterOptions = ref({
  project: '',
  status: '',
  module: ''
})

const issues = ref([
  { 
    key: 'SADP-101', 
    summary: 'Perception模块路标检测功能测试', 
    status: '待测试', 
    module: 'perception',
    version: 'v2.5.0',
    assignee: '张三',
    bagInfo: 'bag-20230615-101, bag-20230615-102',
    description: '测试路标检测功能在不同光照条件下的准确性'
  },
  { 
    key: 'SADP-102', 
    summary: 'Planning模块避障功能测试', 
    status: '测试中', 
    module: 'planning',
    version: 'v2.5.0',
    assignee: '李四',
    bagInfo: 'bag-20230620-305, bag-20230620-306',
    description: '验证动态避障功能在复杂场景下的表现'
  },
  { 
    key: 'AUTO-103', 
    summary: 'Control模块弯道控制精度测试', 
    status: '已完成', 
    module: 'control',
    version: 'v2.4.8',
    assignee: '王五',
    bagInfo: 'bag-20230610-201',
    description: '测试在不同弯道半径下的控制精度'
  }
])

const reports = ref([
  {
    name: 'Perception模块路标检测测试报告',
    issueKey: 'SADP-101',
    module: 'perception',
    createdAt: '2023-06-20 15:30:45',
    url: '#'
  },
  {
    name: 'Planning模块避障功能中期报告',
    issueKey: 'SADP-102',
    module: 'planning',
    createdAt: '2023-06-22 10:15:22',
    url: '#'
  },
  {
    name: 'Control模块弯道控制测试报告',
    issueKey: 'AUTO-103',
    module: 'control',
    createdAt: '2023-06-18 09:45:37',
    url: '#'
  }
])

const showCreateIssue = ref(false)
const newIssue = ref({
  project: 'SADP',
  summary: '',
  module: '',
  version: '',
  bagInfo: '',
  description: ''
})

const handleBind = () => {
  // 这里可以调用后端API进行Jira账号绑定
  console.log('绑定Jira账号', jiraUser.value)
}

const handleSync = () => {
  // 这里可以调用后端API同步Jira issue
  console.log('同步Jira issue')
}

const applyFilter = () => {
  // 应用筛选逻辑
  console.log('应用筛选', filterOptions.value)
}

const viewIssueDetail = (issue: any) => {
  console.log('查看Issue详情', issue)
}

const handlePush = (issue: any) => {
  // 这里可以调用后端API推送报告到Jira
  console.log('推送报告到Jira issue', issue)
}

const viewReport = (report: any) => {
  console.log('查看报告', report)
}

const pushReport = (report: any) => {
  console.log('推送报告至Jira', report)
}

const createIssue = () => {
  console.log('创建Issue', newIssue.value)
  // 提交后关闭弹窗
  showCreateIssue.value = false
}
</script>

<style scoped>
.jira-integration {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.desc {
  margin-bottom: 20px;
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
  justify-content: center;
}

.col {
  min-width: 320px;
  box-sizing: border-box;
}

.col-8 {
  flex: 0 0 380px;
  max-width: 380px;
}

.col-16 {
  flex: 1 1 600px;
  min-width: 400px;
  max-width: 900px;
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
  gap: 8px;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 15px;
}

.card-content {
  min-height: 120px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-item label {
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
}

.form-item input, .form-item select, .form-item textarea {
  padding: 8px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
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

.btn-primary {
  background: #409eff;
  color: #fff;
}

.btn-success {
  background: #67c23a;
  color: #fff;
}

.btn-default {
  background: #f0f2f5;
  color: #606266;
}

.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}

.btn:hover {
  filter: brightness(0.95);
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

.empty {
  color: #bbb;
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
}

.action-btns {
  display: flex;
  gap: 4px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 15px;
  align-items: center;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.filter-item select {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: white;
}

.status-badge.待测试 {
  background-color: #909399;
}

.status-badge.测试中 {
  background-color: #e6a23c;
}

.status-badge.已完成 {
  background-color: #67c23a;
}

.process-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  font-weight: bold;
}

.step-text {
  font-size: 13px;
  color: #333;
  text-align: center;
}

.process-arrow {
  color: #409eff;
  font-weight: bold;
  margin: 0 2px;
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
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #67c23a;
  color: white;
  font-size: 12px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}
</style> 