<template>
  <div class="visualization-tools">
    <h1>可视化工具模块</h1>
    <div class="content">
      <div class="row">
        <div class="col col-16">
          <div class="box-card">
            <div class="card-header">
              <span>数据可视化</span>
              <div class="header-actions">
                <select v-model="chartType" class="select">
                  <option value="line">折线图</option>
                  <option value="bar">柱状图</option>
                  <option value="pie">饼图</option>
                </select>
                <button class="btn btn-primary btn-small" @click="handleRefresh">刷新数据</button>
              </div>
            </div>
            <div class="card-content">
              <div class="chart-container">
                <div ref="chartRef" class="echart-demo"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-8">
          <div class="box-card">
            <div class="card-header">
              <span>数据筛选</span>
            </div>
            <div class="card-content">
              <form class="form">
                <div class="form-item">
                  <label>时间范围</label>
                  <input type="date" v-model="dateRangeStart" />
                  <span style="margin: 0 8px;">至</span>
                  <input type="date" v-model="dateRangeEnd" />
                </div>
                <div class="form-item">
                  <label>数据类型</label>
                  <select v-model="dataType" class="select">
                    <option value="">请选择</option>
                    <option value="performance">性能数据</option>
                    <option value="test">测试数据</option>
                    <option value="system">系统数据</option>
                  </select>
                </div>
                <div class="form-item">
                  <button class="btn btn-primary" type="button" @click="handleFilter">应用筛选</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartType = ref('line')
const dateRangeStart = ref('')
const dateRangeEnd = ref('')
const dataType = ref('')
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const demoData = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [120, 200, 150, 80, 70, 110, 130],
  pie: [
    { value: 1048, name: 'A' },
    { value: 735, name: 'B' },
    { value: 580, name: 'C' },
    { value: 484, name: 'D' },
    { value: 300, name: 'E' }
  ]
}

const renderChart = () => {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  let option: echarts.EChartsOption = {}
  if (chartType.value === 'line') {
    option = {
      title: { text: '折线图 Demo', left: 'center' },
      tooltip: {},
      xAxis: { type: 'category', data: demoData.xAxis },
      yAxis: { type: 'value' },
      series: [{ data: demoData.values, type: 'line', smooth: true }]
    }
  } else if (chartType.value === 'bar') {
    option = {
      title: { text: '柱状图 Demo', left: 'center' },
      tooltip: {},
      xAxis: { type: 'category', data: demoData.xAxis },
      yAxis: { type: 'value' },
      series: [{ data: demoData.values, type: 'bar' }]
    }
  } else if (chartType.value === 'pie') {
    option = {
      title: { text: '饼图 Demo', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '60%',
          data: demoData.pie,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }
  chartInstance.setOption(option)
}

watch(chartType, () => {
  nextTick(() => {
    renderChart()
  })
})

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resizeChart)
})

function resizeChart() {
  chartInstance && chartInstance.resize()
}

// 销毁时移除监听
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance && chartInstance.dispose()
  chartInstance = null
})

const handleRefresh = () => {
  renderChart()
}

const handleFilter = () => {
  console.log('应用筛选', {
    dateRange: [dateRangeStart.value, dateRangeEnd.value],
    dataType: dataType.value
  })
}
</script>

<style scoped>
.visualization-tools {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  margin-top: 20px;
  width: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  width: 100%;
}

.col {
  min-width: 320px;
  box-sizing: border-box;
}
.col-16 {
  flex: 1 1 600px;
  min-width: 400px;
  max-width: 900px;
}
.col-8 {
  flex: 0 0 400px;
  max-width: 400px;
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
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.card-content {
  min-height: 120px;
}
.chart-container {
  width: 100%;
  height: 400px;
  background-color: #f5f7fa;
  border-radius: 4px;
  position: relative;
}
.echart-demo {
  width: 100%;
  height: 100%;
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
  flex-shrink: 0;
}
.form-item input[type="date"] {
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;
  flex-shrink: 0;
}
.form-item span {
  flex-shrink: 0;
}
.select {
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
.btn-small {
  font-size: 13px;
  padding: 4px 10px;
}
.btn:hover {
  filter: brightness(0.95);
}
</style> 