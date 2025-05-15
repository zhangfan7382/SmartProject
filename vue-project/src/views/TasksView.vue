<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: number;
  name: string;
  type: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  createTime: string;
}

const tasks = ref<Task[]>([
  {
    id: 1,
    name: 'Jira任务自动同步',
    type: '系统任务',
    status: '进行中',
    priority: 'high',
    assignee: '张三',
    createTime: '2024-03-26 10:00'
  },
  {
    id: 2,
    name: '测试报告生成',
    type: '报告任务',
    status: '待处理',
    priority: 'medium',
    assignee: '李四',
    createTime: '2024-03-26 11:30'
  }
])

const taskTypes = ['系统任务', '报告任务', '测试任务', '部署任务']
const priorities = ['high', 'medium', 'low']
const statuses = ['待处理', '进行中', '已完成', '已取消']

const getPriorityColor = (priority: string) => {
  const colors = {
    high: '#f56565',
    medium: '#ed8936',
    low: '#48bb78'
  }
  return colors[priority as keyof typeof colors]
}

const getPriorityText = (priority: string) => {
  const texts = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return texts[priority as keyof typeof texts]
}
</script>

<template>
  <div class="tasks-page">
    <div class="page-header">
      <h2>任务管理</h2>
      <p>管理所有测试相关任务</p>
    </div>

    <div class="tasks-container">
      <div class="tasks-header">
        <div class="search-bar">
          <input type="text" placeholder="搜索任务...">
        </div>
        <button class="create-btn">新建任务</button>
      </div>

      <table class="tasks-table">
        <thead>
          <tr>
            <th>任务名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>优先级</th>
            <th>负责人</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.name }}</td>
            <td>
              <span class="type-badge">{{ task.type }}</span>
            </td>
            <td>
              <span class="status-badge">{{ task.status }}</span>
            </td>
            <td>
              <span class="priority-badge" 
                    :style="{ backgroundColor: getPriorityColor(task.priority) }">
                {{ getPriorityText(task.priority) }}
              </span>
            </td>
            <td>{{ task.assignee }}</td>
            <td>{{ task.createTime }}</td>
            <td>
              <button class="action-btn">编辑</button>
              <button class="action-btn delete">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tasks-page {
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

.tasks-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-bar input {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;
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

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th,
.tasks-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.tasks-table th {
  color: #4a5568;
  font-weight: 600;
  background-color: #f7fafc;
}

.type-badge {
  background-color: #ebf4ff;
  color: #4299e1;
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.status-badge {
  background-color: #e6fffa;
  color: #38b2ac;
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.priority-badge {
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.action-btn {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  margin-right: 0.5rem;
  cursor: pointer;
  background-color: #4299e1;
  color: white;
  font-size: 0.8rem;
}

.action-btn.delete {
  background-color: #f56565;
}

.action-btn:hover {
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .tasks-table {
    display: block;
    overflow-x: auto;
  }

  .search-bar input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .tasks-header {
    flex-direction: column;
    gap: 1rem;
  }

  .search-bar input {
    width: 100%;
  }
}
</style> 