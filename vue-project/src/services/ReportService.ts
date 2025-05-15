import axios from 'axios'

interface ReportData {
  id: string;
  name: string;
  type: string;
  content: any;
  createTime: Date;
}

export interface FileData {
  id: string;
  name: string;
  size: number;
  uploadTime: string;
}

// 使用局域网 IP 地址，确保手机可以访问
const API_URL = 'http://192.168.2.144:3000/api'

// 导出 API 基础 URL，用于文件下载
export const BASE_URL = 'http://192.168.2.144:3000'

export const reportService = {
  // 生成HTML报告
  async generateReport(data: ReportData): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/generate`, data)
      return response.data.reportUrl
    } catch (error) {
      console.error('生成报告失败:', error)
      throw error
    }
  },

  // 获取报告列表
  async getReports() {
    return axios.get(`${API_URL}/files`)
  },

  // 上传报告
  async uploadReport(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      console.log('发送上传请求:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
      
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('上传响应:', response.data)
      return response
    } catch (error) {
      console.error('上传请求失败:', error)
      throw error
    }
  },

  // 下载报告
  async downloadReport(fileId: string) {
    const response = await axios.get(`${API_URL}/files/${fileId}`, {
      responseType: 'blob'
    })
    return response.data
  },

  // 删除报告
  async deleteReport(filename: string) {
    if (!filename) {
      throw new Error('文件名不能为空')
    }
    
    try {
      console.log('发送删除请求，文件名:', filename)
      const response = await axios.delete(`${API_URL}/files/${encodeURIComponent(filename)}`)
      console.log('删除文件响应:', response.data)
      return response.data
    } catch (error) {
      console.error('删除文件失败:', error)
      throw error
    }
  }
}