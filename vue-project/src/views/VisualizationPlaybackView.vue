<template>
  <div class="visualization-playback">
    <h1>可视化工具与播包观测</h1>
    
    <!-- 代码部署与中间件区块 -->
    <!-- <div class="deploy-section card">
      <h2>代码部署与中间件</h2>
      <form class="deploy-form" @submit.prevent="deployCode">
        <label>上传代码包：<input type="file" @change="handleCodeUpload"></label>
        <label>部署方式：
          <select v-model="deployMode" class="select">
            <option value="full">整包部署</option>
            <option value="module">单独模块部署</option>
          </select>
        </label>
        <label v-if="deployMode==='module'">选择模块：
          <select v-model="selectedModule" class="select">
            <option v-for="mod in modules" :key="mod" :value="mod">{{ mod }}</option>
          </select>
        </label>
        <label>上传移植库/中间件：<input type="file" @change="handleLibUpload"></label>
        <button class="btn" type="submit">一键部署</button>
      </form>
      <div v-if="deployStatus" class="status-tip">{{ deployStatus }}</div>
    </div> -->

    <!-- 视频流回放区块 -->
    <div class="video-replay-section card">
      <h2>视频流回放（云端）</h2>
      <label>云端视频流路径：<input v-model="videoPath" placeholder="如：oss://bucket/video.mp4" class="input-path"></label>
      <button class="btn" @click="startVideoReplay">云端回放</button>
    </div>

    <!-- 结构化数据播包区块 -->
    <div class="struct-data-section card">
      <h2>结构化数据播包</h2>
      <label>上传整车/传感器数据包：<input type="file" @change="handleStructDataUpload"></label>
      <button class="btn" :disabled="!structDataFile" @click="startStructReplay">开始播包</button>
      <div v-if="structReplayStatus" class="status-tip">{{ structReplayStatus }}</div>
    </div>

    <div class="content">
      <div class="main-view">
        <!-- 视频播放区域 -->
        <div class="video-section card">
          <div class="video-container">
            <video 
              ref="videoPlayer" 
              class="video-player" 
              controls
              autoplay
              crossorigin="anonymous"
              @play="handleVideoPlay"
              @pause="handleVideoPause"
              @error="handleVideoError"
            >
              <source :src="currentVideo" type="video/mp4">
              您的浏览器不支持视频播放。
            </video>
            <div v-if="!currentVideo" class="empty-tip">
              <div class="empty-content">
                <div class="empty-icon">🎥</div>
                <div class="empty-text">暂无视频数据</div>
                <div class="empty-desc">请选择或上传数据包，或选择示例视频</div>
                <div class="empty-actions">
                  <div class="sample-videos">
                    <button 
                      v-for="video in sampleVideos" 
                      :key="video.name"
                      class="btn btn-small sample-btn"
                      @click="switchSampleVideo(video)"
                    >
                      {{ video.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- 播放控制面板 -->
      <div class="control-panel card">
        <div class="playback-controls">
          <button class="btn control-btn" @click="stepBackward" title="后退一帧">⏪</button>
          <button class="btn control-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="btn control-btn" @click="stepForward" title="前进一帧">⏩</button>
          <div class="speed-controls">
            <label class="speed-label">速度:
              <select v-model="playbackSpeed" class="select">
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
              </select>
            </label>
            <label class="speed-label">降频:
              <select v-model="downsampleRate" class="select">
                <option value="1">无</option>
                <option value="2">1/2</option>
                <option value="4">1/4</option>
                <option value="8">1/8</option>
              </select>
            </label>
          </div>
        </div>

        <div class="recording-controls">
          <button class="btn record" :class="{ 'recording': isRecording }" @click="toggleRecording">
            {{ isRecording ? '停止录制' : '开始录制' }}
          </button>
          <button class="btn screenshot" @click="takeScreenshot">
            截取画面
          </button>
          <div class="recording-info" v-if="isRecording">
            <span class="recording-time">{{ formatRecordingTime }}</span>
            <span class="recording-size">{{ recordingSize }}</span>
          </div>
        </div>

        <div class="log-section">
          <div class="log-header">
            <h3>测试数据日志</h3>
            <button class="btn btn-small" @click="exportLog">导出日志</button>
          </div>
          <div class="log-content">
            <div v-for="(log, index) in testLogs" :key="index" class="log-item">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-type" :class="log.type">{{ log.type }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

// 代码部署相关
const deployMode = ref('full')
const selectedModule = ref('perception')
const modules = ref(['perception', 'roadmodel', 'prediction', 'planning', 'control', 'obsl', 'activesafety'])
const codeFile = ref<File|null>(null)
const libFile = ref<File|null>(null)
const deployStatus = ref('')
const handleCodeUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) codeFile.value = files[0]
}
const handleLibUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) libFile.value = files[0]
}
const deployCode = () => {
  deployStatus.value = `已${deployMode.value==='full'?'整包':'模块'}部署${deployMode.value==='module'?('（'+selectedModule.value+'）'):''}，可对接部署API`
}

// 视频流回放相关
const videoPath = ref('')
const startVideoReplay = () => {
  if (videoPath.value) {
    currentVideo.value = videoPath.value
    if (videoPlayer.value) {
      videoPlayer.value.load()
      videoPlayer.value.play().catch(error => {
        console.error('播放视频失败:', error)
      })
    }
  }
}

// 结构化数据播包相关
const structDataFile = ref<File|null>(null)
const structReplayStatus = ref('')
const handleStructDataUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) structDataFile.value = files[0]
}
const startStructReplay = () => {
  structReplayStatus.value = '结构化数据播包已启动（可对接播包API）'
}

// 视频播放相关
const videoPlayer = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const playbackSpeed = ref('1')
// const currentVideo = ref('http://vjs.zencdn.net/v/oceans.mp4')

// https://www.w3schools.com/html/movie.mp4
const currentVideo = ref('http://vjs.zencdn.net/v/oceans.mp4')

// 示例视频列表
const sampleVideos = [
  {
    name: 'TED演讲：自动驾驶中的AI挑战',
    url: 'https://embed.ted.com/talks/jaerock_kwon_artificial_intelligence_challenges_in_connected_autonomous_vehicles',
    description: '探讨自动驾驶汽车中的人工智能挑战和解决方案'
  },
  {
    name: 'TED演讲：自动驾驶技术',
    url: 'https://embed.ted.com/talks/waymo_ceo_john_krafcik_the_road_to_a_self_driving_future',
    description: 'Waymo CEO 分享自动驾驶技术的未来展望'
  },
  {
    name: 'TED演讲：机器学习入门',
    url: 'https://embed.ted.com/talks/kevin_slavin_how_algorithms_shape_our_world',
    description: '算法如何塑造我们的世界'
  },
  {
    name: 'TED演讲：数据可视化',
    url: 'https://embed.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen',
    description: '数据可视化的艺术与科学'
  },
  {
    name: 'TED演讲：编程思维',
    url: 'https://embed.ted.com/talks/linda_liukas_a_delightful_way_to_teach_kids_about_computers',
    description: '用有趣的方式教孩子编程'
  }
]

// 处理视频错误
const handleVideoError = (error: Event) => {
  console.error('视频播放错误:', error)
  const video = error.target as HTMLVideoElement
  console.log('错误详情:', {
    error: video.error,
    networkState: video.networkState,
    readyState: video.readyState
  })
}

// 切换示例视频
const switchSampleVideo = (video: typeof sampleVideos[0]) => {
  currentVideo.value = video.url
  if (videoPlayer.value) {
    videoPlayer.value.load()
    videoPlayer.value.play().catch(error => {
      console.error('播放视频失败:', error)
    })
  }
}

// 视图模式
const viewMode = ref('single')
const toggleViewMode = (mode: 'single' | 'compare') => {
  viewMode.value = mode
}

// 降频控制
const downsampleRate = ref('1')

// 录制相关
const isRecording = ref(false)
const recordingStartTime = ref(0)
const recordingSize = ref('0 MB')
const recordingInterval = ref<number | null>(null)

const formatRecordingTime = computed(() => {
  if (!isRecording.value) return '00:00:00'
  const duration = Date.now() - recordingStartTime.value
  const hours = Math.floor(duration / 3600000)
  const minutes = Math.floor((duration % 3600000) / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const toggleRecording = () => {
  isRecording.value = !isRecording.value
  if (isRecording.value) {
    recordingStartTime.value = Date.now()
    recordingInterval.value = window.setInterval(() => {
      // 模拟录制大小增长
      const size = Math.floor((Date.now() - recordingStartTime.value) / 1000)
      recordingSize.value = `${(size / 1024).toFixed(2)} MB`
    }, 1000)
  } else {
    if (recordingInterval.value) {
      clearInterval(recordingInterval.value)
      recordingInterval.value = null
    }
  }
}

// 测试日志
const testLogs = ref<Array<{time: string, type: string, message: string}>>([])

const addLog = (type: string, message: string) => {
  const now = new Date()
  testLogs.value.push({
    time: now.toLocaleTimeString(),
    type,
    message
  })
}

const exportLog = () => {
  const logContent = testLogs.value.map(log => 
    `[${log.time}] ${log.type}: ${log.message}`
  ).join('\n')
  
  const blob = new Blob([logContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `test-log-${new Date().toISOString()}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

// 监听播放速度变化
watch([playbackSpeed, downsampleRate], ([newSpeed, newRate]) => {
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = parseFloat(newSpeed) / parseFloat(newRate)
  }
})

// 监听视频播放状态
const handleVideoPlay = () => {
  isPlaying.value = true
  console.log('视频开始播放')
}

const handleVideoPause = () => {
  isPlaying.value = false
  console.log('视频暂停播放')
}

// 图层控制
const layers = ref([
  { id: 'camera', name: '摄像头视图', visible: true },
  { id: 'lidar', name: '激光雷达点云', visible: true },
  { id: 'radar', name: '毫米波雷达', visible: true },
  { id: 'gps', name: 'GPS轨迹', visible: true },
  { id: 'imu', name: 'IMU数据', visible: true }
])

// 图层控制方法
const toggleAllLayers = (value: boolean) => {
  layers.value.forEach(layer => {
    layer.visible = value
  })
}

// 播放控制方法
const togglePlay = () => {
  if (videoPlayer.value) {
    if (isPlaying.value) {
      videoPlayer.value.pause()
    } else {
      videoPlayer.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const stepForward = () => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime += 1
  }
}

const stepBackward = () => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime -= 1
  }
}

// 截图方法
const takeScreenshot = () => {
  if (videoPlayer.value) {
    try {
      // 创建 canvas 元素
      const canvas = document.createElement('canvas')
      const video = videoPlayer.value
      
      // 设置 canvas 尺寸与视频一致
      canvas.width = video.videoWidth || video.clientWidth
      canvas.height = video.videoHeight || video.clientHeight
      
      // 获取 canvas 上下文
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('无法获取 canvas 上下文')
        return
      }
      
      // 绘制当前视频帧
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // 添加时间戳水印
      const timestamp = new Date().toLocaleString()
      ctx.font = '16px Arial'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillText(timestamp, 10, 30)
      
      // 添加视频信息
      const videoInfo = `帧率: ${playbackData.value.fps}fps | 延迟: ${playbackData.value.latency}ms`
      ctx.fillText(videoInfo, 10, 50)
      
      // 转换为图片并下载
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const fileName = `screenshot-${new Date().toISOString().replace(/[:.]/g, '-')}.png`
      
      link.href = dataUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 添加到日志
      addLog('info', `已保存截图: ${fileName}`)
    } catch (error: any) {
      console.error('截图失败:', error)
      addLog('error', '截图失败: ' + (error.message || '未知错误'))
    }
  } else {
    addLog('error', '视频播放器未初始化')
  }
}

// 数据对比相关
const originalData = ref({
  fps: 30,
  latency: 16
})
const playbackData = ref({
  fps: 30,
  latency: 16
})

onMounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.addEventListener('play', handleVideoPlay)
    videoPlayer.value.addEventListener('pause', handleVideoPause)
    videoPlayer.value.addEventListener('error', handleVideoError)
    // 默认自动播放
    videoPlayer.value.play().catch(error => {
      console.error('自动播放失败:', error)
    })
  }
})

onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.removeEventListener('play', handleVideoPlay)
    videoPlayer.value.removeEventListener('pause', handleVideoPause)
    videoPlayer.value.removeEventListener('error', handleVideoError)
  }
})
</script>

<style scoped>
.visualization-playback {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.deploy-section, .video-replay-section, .struct-data-section {
  margin-bottom: 18px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  padding: 18px 20px 20px 20px;
}
.deploy-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: center;
  margin-bottom: 10px;
}
.deploy-form label {
  font-size: 15px;
}
.input-path {
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 15px;
  margin-left: 4px;
  min-width: 260px;
}
.status-tip {
  color: #409eff;
  margin-top: 8px;
  font-size: 14px;
}
.video-player-box {
  margin-top: 10px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.main-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  padding: 18px 20px 20px 20px;
  position: relative;
}

.video-section {
  width: 100%;
  padding: 0;
  overflow: hidden;
}

.video-container {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 16/9;
}

.video-player {
  width: 100%;
  height: 100%;
  max-height: none;
  object-fit: contain;
  background: #000;
}

.visualization-section {
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.visualization-content {
  min-height: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.single-view .chart-container {
  height: 300px;
}

.compare-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.compare-col {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.compare-col h4 {
  margin-bottom: 12px;
  color: #333;
}

.data-metrics {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.speed-controls {
  display: flex;
  gap: 16px;
  margin-left: 16px;
}

.recording-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
  color: #666;
}

.recording-time {
  font-family: monospace;
  font-size: 16px;
}

.log-section {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 8px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 4px 8px;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}

.log-time {
  color: #666;
  font-family: monospace;
}

.log-type {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.log-type.info {
  background: #e1f3d8;
  color: #67c23a;
}

.log-type.warning {
  background: #fdf6ec;
  color: #e6a23c;
}

.log-type.error {
  background: #fef0f0;
  color: #f56c6c;
}

.log-message {
  flex: 1;
  color: #333;
}

.layer-section {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  padding: 20px;
}

.layer-controls {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 8px;
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.layer-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.layer-actions {
  display: flex;
  gap: 8px;
}

.layer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 8px 0;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.layer-item:hover {
  background: #e9ecef;
}

.layer-name {
  font-size: 14px;
  color: #333;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  aspect-ratio: 16/9;
}

.empty-content {
  text-align: center;
  padding: 40px;
  max-width: 400px;
  width: 100%;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.empty-text {
  font-size: 20px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.empty-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
}

.empty-actions {
  margin-top: 24px;
}

.btn-small {
  padding: 8px 20px;
  font-size: 15px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-small:hover {
  background: #66b1ff;
}

.btn-small:not([class*="btn-"]) {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #dcdfe6;
}

.btn-small:not([class*="btn-"]):hover {
  background: #e6e6e6;
  border-color: #b3b3b3;
}

.control-panel {
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  background: #fff;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.control-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:hover {
  background: #f5f7fa;
  border-color: #c6c8cb;
}

.control-btn:active {
  background: #e6e8eb;
}

.screenshot {
  background: #409eff;
  color: white;
  border: none;
}

.screenshot:hover {
  background: #66b1ff;
}

.record {
  background: #f56c6c;
  color: white;
  border: none;
}

.record:hover {
  background: #f78989;
}

.recording {
  background: #67c23a !important;
}

.recording:hover {
  background: #85ce61 !important;
}

.speed-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
}

.select {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 15px;
  color: #333;
  background: #fff;
  cursor: pointer;
}

.select:hover {
  border-color: #c6c8cb;
}
</style> 