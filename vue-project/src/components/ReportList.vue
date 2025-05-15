<template>
  <div class="report-list">
    <div class="upload-section">
      <input type="file" ref="fileInput" @change="handleFileChange" accept=".html,.pdf" style="display: none">
      <button @click="triggerFileInput" class="upload-btn">上传报告</button>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>文件名</th>
            <th>类型</th>
            <th>大小</th>
            <th>上传时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.id">
            <td>{{ file.name }}</td>
            <td>{{ file.name.endsWith('.html') ? 'HTML' : 'PDF' }}</td>
            <td>{{ formatFileSize(file.size) }}</td>
            <td>{{ new Date(file.uploadTime).toLocaleString() }}</td>
            <td>
              <button @click="downloadFile(file.id)" class="action-btn">下载</button>
              <button @click="deleteFile(file.id)" class="action-btn delete">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { reportService, FileData } from '../services/ReportService'

export default defineComponent({
  name: 'ReportList',
  setup() {
    const files = ref<FileData[]>([])
    const fileInput = ref<HTMLInputElement | null>(null)

    const loadFiles = async () => {
      try {
        files.value = await reportService.getReports()
      } catch (error) {
        console.error('加载文件列表失败:', error)
      }
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileChange = async (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        try {
          await reportService.uploadReport(input.files[0])
          await loadFiles()
        } catch (error) {
          console.error('上传文件失败:', error)
        }
      }
    }

    const downloadFile = async (fileId: string) => {
      try {
        await reportService.downloadReport(fileId)
      } catch (error) {
        console.error('下载文件失败:', error)
      }
    }

    const deleteFile = async (fileId: string) => {
      if (confirm('确定要删除这个文件吗？')) {
        try {
          await reportService.deleteReport(fileId)
          await loadFiles()
        } catch (error) {
          console.error('删除文件失败:', error)
        }
      }
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    onMounted(() => {
      loadFiles()
    })

    return {
      files,
      fileInput,
      triggerFileInput,
      handleFileChange,
      downloadFile,
      deleteFile,
      formatFileSize
    }
  }
})
</script>

<style scoped>
.report-list {
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn:hover {
  background-color: #45a049;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

.action-btn {
  padding: 6px 12px;
  margin-right: 8px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #0b7dda;
}

.action-btn.delete {
  background-color: #f44336;
}

.action-btn.delete:hover {
  background-color: #da190b;
}
</style> 