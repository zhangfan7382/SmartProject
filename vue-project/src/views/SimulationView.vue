<script setup lang="ts">
import { ref } from 'vue'

interface SimulationTask {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  type: string;
  createTime: string;
  results?: {
    accuracy: number;
    responseTime: number;
    coverage: number;
  };
}

const tasks = ref<SimulationTask[]>([
  {
    id: 1,
    name: '感知模块响应测试',
    status: 'completed',
    progress: 100,
    type: '功能仿真',
    createTime: '2024-03-26 10:30',
    results: {
      accuracy: 95.5,
      responseTime: 150,
      coverage: 88.2
    }
  },
  {
    id: 2,
    name: '决策系统评估',
    status: 'running',
    progress: 65,
    type: '响应识别',
    createTime: '2024-03-26 11:15'
  },
  {
    id: 3,
    name: '控制模块测试',
    status: 'pending',
    progress: 0,
    type: '评估报告',
    createTime: '2024-03-26 11:45'
  }
])

const newTaskName = ref('')
const selectedType = ref('功能仿真')

const taskTypes = ['功能仿真', '响应识别', '评估报告']

const createNewTask = () => {
  if (!newTaskName.value) return

  const newTask: SimulationTask = {
    id: tasks.value.length + 1,
    name: newTaskName.value,
    status: 'pending',
    progress: 0,
    type: selectedType.value,
    createTime: new Date().toLocaleString()
  }

  tasks.value.unshift(newTask)
  newTaskName.value = ''
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: '#718096',
    running: '#4299e1',
    completed: '#48bb78',
    failed: '#f56565'
  }
  return colors[status as keyof typeof colors]
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '等待中',
    running: '运行中',
    completed: '已完成',
    failed: '失败'
  }
  return texts[status as keyof typeof texts]
}
</script>

<template>
  <div class="simulation-page">
    <div class="page-header">
      <h2>离线仿真模块</h2>
      <p>对所有功能模块进行离线仿真、响应识别和功能评估</p>
    </div>

    <div class="control-panel">
      <div class="new-task-form">
        <input 
          v-model="newTaskName"
          type="text"
          placeholder="输入新任务名称"
          @keyup.enter="createNewTask"
        >
        <select v-model="selectedType">
          <option v-for="type in taskTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <button @click="createNewTask" class="create-btn">创建任务</button>
      </div>
    </div>

    <div class="tasks-container">
      <div v-for="task in tasks" 
           :key="task.id" 
           class="task-card">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <span class="task-type">{{ task.type }}</span>
        </div>
        
        <div class="task-info">
          <div class="progress-bar">
            <div class="progress" 
                 :style="{ width: task.progress + '%', backgroundColor: getStatusColor(task.status) }">
            </div>
          </div>
          <span class="progress-text">{{ task.progress }}%</span>
        </div>

        <div class="task-details">
          <span class="status" :style="{ backgroundColor: getStatusColor(task.status) }">
            {{ getStatusText(task.status) }}
          </span>
          <span class="create-time">{{ task.createTime }}</span>
        </div>

        <div v-if="task.results" class="task-results">
          <div class="result-item">
            <span class="label">准确率</span>
            <span class="value">{{ task.results.accuracy }}%</span>
          </div>
          <div class="result-item">
            <span class="label">响应时间</span>
            <span class="value">{{ task.results.responseTime }}ms</span>
          </div>
          <div class="result-item">
            <span class="label">覆盖率</span>
            <span class="value">{{ task.results.coverage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.simulation-page {
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

.control-panel {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-task-form {
  display: flex;
  gap: 1rem;
}

.new-task-form input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.new-task-form select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.create-btn {
  padding: 0.5rem 1.5rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-btn:hover {
  background-color: #3182ce;
}

.tasks-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.task-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.task-type {
  padding: 0.2rem 0.8rem;
  background-color: #ebf4ff;
  color: #4299e1;
  border-radius: 15px;
  font-size: 0.8rem;
}

.task-info {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background-color: #edf2f7;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #718096;
}

.task-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status {
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  color: white;
  font-size: 0.8rem;
}

.create-time {
  font-size: 0.8rem;
  color: #718096;
}

.task-results {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.result-item {
  text-align: center;
}

.result-item .label {
  display: block;
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.3rem;
}

.result-item .value {
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
}

@media (max-width: 768px) {
  .new-task-form {
    flex-direction: column;
  }

  .tasks-container {
    grid-template-columns: 1fr;
  }
}
</style> 