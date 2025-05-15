<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { reportService, BASE_URL } from '@/services/ReportService'

interface Report {
  id: string;
  filename: string;
  name: string;
  type: string;
  status: string;
  createTime: string;
  size: string;
  downloadUrl: string;
}

interface FileResponse {
  id: string;
  filename: string;
  name: string;
  size: number;
  uploadTime: string;
  url: string;
}

const reports = ref<Report[]>([])
const isUploading = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

// 处理搜索
const handleSearch = () => {
  // 搜索功能通过computed filteredReports自动处理
  console.log('搜索:', searchQuery.value)
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  console.log('已清空搜索')
}

// 获取报告列表
const fetchReports = async () => {
  try {
    const response = await reportService.getReports()
    console.log('获取到的文件列表:', response.data)
    reports.value = response.data.map((file: FileResponse) => ({
      id: file.id,
      filename: file.filename,
      name: file.name,
      type: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'HTML',
      status: '已上传',
      createTime: new Date(file.uploadTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      size: formatFileSize(file.size),
      downloadUrl: `${BASE_URL}/uploads/${file.filename}`
    }))
    console.log('处理后的报告列表:', reports.value)
  } catch (error) {
    console.error('获取报告列表失败:', error)
  }
}

// 搜索报告内输入文字，可以刷新列表
const filteredReports = computed(() => {
  // 首先根据搜索词过滤
  let result = reports.value.filter(report => {
    if (searchQuery.value.trim() === '') return true;
    return report.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
  
  // 再根据类型过滤
  if (selectedType.value) {
    result = result.filter(report => report.type === selectedType.value);
  }
  
  // 再根据状态过滤
  if (selectedStatus.value) {
    result = result.filter(report => report.status === selectedStatus.value);
  }
  
  return result;
});

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 上传报告
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  isUploading.value = true

  try {
    console.log('准备上传文件:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    const response = await reportService.uploadReport(file)
    console.log('上传响应:', response.data)
    
    // 清空文件输入框
    input.value = ''
    
    // 刷新列表
    await fetchReports()
  } catch (error) {
    console.error('上传失败:', error)
    alert('上传失败: ' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    isUploading.value = false
  }
}

// 下载报告
const downloadReport = async (report: Report) => {
  try {
    console.log('开始下载文件:', report.filename)
    const response = await fetch(report.downloadUrl)
    
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = report.name // 使用原始文件名作为下载文件名
    document.body.appendChild(link)
    link.click()
    
    // 清理
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
    console.log('文件下载完成')
  } catch (error) {
    console.error('下载文件时出错:', error)
    alert('下载文件失败，请重试')
  }
}

// 删除报告
const deleteReport = async (report: Report) => {
  if (!confirm('确定要删除这个报告吗？')) return

  try {
    console.log('准备删除文件:', report)
    if (!report.filename) {
      throw new Error('文件名不能为空')
    }
    await reportService.deleteReport(report.filename)
    console.log('文件删除成功')
    await fetchReports() // 刷新列表
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 添加自动刷新功能
const startAutoRefresh = () => {
  setInterval(() => {
    fetchReports()
  }, 5000) // 每5秒刷新一次
}

// 
onMounted(() => {
  fetchReports()
  startAutoRefresh() // 启动自动刷新
})

onUnmounted(() => {
  // 清理定时器的代码会自动处理
})
</script>

<template>
  <div class="reports-page">
    <div class="page-header">
      <h2>测试报告</h2>
      <p>查看和下载测试报告</p>
    </div>

    <div class="reports-container">
      <div class="reports-header">
        <div class="search-filters">
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="搜索报告..."
              @input="handleSearch"
            >
            <button 
              v-if="searchQuery" 
              class="clear-search" 
              @click="clearSearch">
              ✕
            </button>
          </div>
          <div class="filter-group">
            <select v-model="selectedType">
              <option value="">所有类型</option>
              <option value="HTML">HTML</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
        </div>
      </div>

      <div class="upload-section">
        <input
          type="file"
          id="file-upload"
          class="file-input"
          @change="handleFileUpload"
          accept=".html,.pdf"
        >
        <label for="file-upload" class="upload-btn">
          <i class="upload-icon">📤</i>
          上传报告
        </label>
      </div>

      <div class="reports-grid">
        <div v-for="report in filteredReports" 
             :key="report.id" 
             class="report-card">
          <div class="report-icon">
            {{ report.type === 'HTML' ? '📄' : '📑' }}
          </div>
          <div class="report-info">
            <h3>{{ report.name }}</h3>
            <div class="report-meta">
              <span class="type-badge">{{ report.type }}</span>
              <span class="status-badge">{{ report.status }}</span>
            </div>
            <div class="report-details">
              <span>{{ report.createTime }}</span>
              <span>{{ report.size }}</span>
            </div>
          </div>
          <div class="report-actions">
            <button 
              class="action-btn download"
              @click="downloadReport(report)"
              :disabled="report.status === '生成中'">
              下载
            </button>
            <button 
              class="action-btn delete"
              @click="deleteReport(report)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reports-page {
  padding: 2rem;
  min-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
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

.reports-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.reports-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
}

.search-filters {
  display: flex;
  gap: 1rem;
  width: 100%;
  align-items: center;
}

.search-bar {
  flex: 1;
  position: relative;
  min-width: 200px;
  max-width: 400px;
}

.search-bar input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  padding-right: 2.5rem; /* 为清除按钮留出空间 */
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #e2e8f0;
}

.clear-search:hover {
  background-color: #cbd5e0;
  color: #1a202c;
}

.filter-group {
  display: flex;
  gap: 1rem;
  min-width: 150px;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.upload-section {
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.file-input {
  display: none;
}

.upload-btn {
  width: calc(100% - 1.5rem);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.upload-btn:hover {
  background-color: #0052cc;
}

.upload-icon {
  font-size: 1.2rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  width: 100%;
}

/* 美化滚动条 */
.reports-grid::-webkit-scrollbar {
  width: 6px;
}

.reports-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.reports-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.reports-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.report-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.report-icon {
  font-size: 2rem;
  color: #4299e1;
}

.report-info {
  flex: 1;
}

.report-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #2d3748;
}

.report-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.type-badge,
.status-badge {
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.type-badge {
  background-color: #ebf4ff;
  color: #4299e1;
}

.status-badge {
  background-color: #e6fffa;
  color: #38b2ac;
}

.report-details {
  font-size: 0.8rem;
  color: #718096;
  display: flex;
  gap: 1rem;
}

.report-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.action-btn.download {
  background-color: #4299e1;
  color: white;
}

.action-btn.download:hover {
  background-color: #3182ce;
}

.action-btn.delete {
  background-color: #f56565;
  color: white;
}

.action-btn.delete:hover {
  background-color: #e53e3e;
}

.action-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

/* 确保搜索栏和过滤器在小屏幕上也能正常显示 */
/* @media (max-width: 1024px) {
  .reports-header {
    flex-direction: column;
    gap: 1rem;
  }

  .search-filters {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .search-bar {
    max-width: none;
  }

  .filter-group {
    width: auto;
    display: flex;
    gap: 1rem;
  }

  .upload-section {
    margin-left: 0;
    width: 100%;
  }

  .upload-btn {
    width: 100%;
    justify-content: center;
  }
} */

/* @media (max-width: 768px) {
  .reports-page {
    padding: 1rem;
  }

  .reports-container {
    padding: 1rem;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }
} */
</style> 