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

// 修改为新的服务器地址
export const BASE_URL = 'https://smartproject.onrender.com'

export const reportService = {
  // 生成HTML报告
  async generateReport(data: ReportData): Promise<string> {
    try {
      const response = await axios.post(`${BASE_URL}/api/generate`, data)
      return response.data.reportUrl
    } catch (error) {
      console.error('生成报告失败:', error)
      throw error
    }
  },

  // 获取报告列表
  getReports: () => {
    return axios.get(`${BASE_URL}/api/files`)
  },

  // 上传报告
  uploadReport: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${BASE_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 下载报告
  async downloadReport(fileId: string) {
    const response = await axios.get(`${BASE_URL}/api/files/${fileId}`, {
      responseType: 'blob'
    })
    return response.data
  },

  // 删除报告
  deleteReport: (filename: string) => {
    return axios.delete(`${BASE_URL}/api/files/${filename}`)
  }
}