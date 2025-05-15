<script setup lang="ts">
import { useRouter } from 'vue-router'
// import SidebarLogin from '../components/SidebarLogin.vue'

interface Module {
  id: number;
  name: string;
  description: string;
  icon: string;
  status: 'ready' | 'developing' | 'testing';
  features: string[];
  count?: {
    total: number;
    done: number;
  };
}

const modules: Module[] = [
  {
    id: 1,
    name: 'Jira集成模块',
    description: '通过Jira进行提测管理，自动推送报告结果至对应issue',
    icon: '📊',
    status: 'developing',
    features: ['提测管理', '自动推送', '报告跟踪'],
    count: {
      total: 68,
      done: 45
    }
  },
  {
    id: 2,
    name: '配置管理模块',
    description: '自动修改配置并生成待测软件包',
    icon: '⚙️',
    status: 'developing',
    features: ['配置修改', '软件打包', '版本管理'],
    count: {
      total: 92,
      done: 70
    }
  },
  {
    id: 3,
    name: '路试回灌模块',
    description: '进行路试bag包的回灌仿真，提取和分割关键事件',
    icon: '🚗',
    status: 'developing',
    features: ['数据回灌', '事件提取', '场景分割'],
    count: {
      total: 156,
      done: 120
    }
  },
  {
    id: 4,
    name: '路试回灌仿真与事件评估',
    description: '对路试数据进行回灌仿真和事件评估分析',
    icon: '📈',
    status: 'developing',
    features: ['回灌仿真', '事件评估', '数据分析'],
    count: {
      total: 89,
      done: 65
    }
  },
  {
    id: 5,
    name: '模块化部署与回灌测试',
    description: '支持模块化部署和回灌测试流程',
    icon: '🔄',
    status: 'developing',
    features: ['模块部署', '回灌测试', '流程管理'],
    count: {
      total: 78,
      done: 52
    }
  },
  {
    id: 6,
    name: '报告管理模块',
    description: '生成HTML报告并自动上传至数据存储服务器',
    icon: '📝',
    status: 'developing',
    features: ['报告生成', '自动上传', '数据存储'],
    count: {
      total: 89,
      done: 76
    }
  },
  {
    id: 7,
    name: '数据链路与平台集成',
    description: '管理数据上传、下载和对接云端仿真平台',
    icon: '☁️',
    status: 'developing',
    features: ['数据同步', '云端对接', '平台管理'],
    count: {
      total: 45,
      done: 30
    }
  },
  {
    id: 8,
    name: '可视化工具与播包观测',
    description: '提供可视化工具观测和录制播包数据',
    icon: '👁️',
    status: 'developing',
    features: ['数据可视化', '录制功能', '播放控制'],
    count: {
      total: 67,
      done: 45
    }
  }
]

const router = useRouter()

const navigateToModule = (moduleId: number) => {
  const routes = {
    1: '/jira-integration',           // Jira集成模块
    2: '/config-management',          // 配置管理模块
    3: '/road-test-simulation',       // 路试回灌模块
    4: '/roadtest-replay-eval',       // 路试回灌仿真与事件评估
    5: '/modular-deploy-replay',      // 模块化部署与回灌测试
    6: '/report-management',          // 报告管理模块
    7: '/data-integration',           // 数据链路与平台集成
    8: '/visualization-playback'      // 可视化工具与播包观测
  }
  const route = routes[moduleId as keyof typeof routes]
  if (route) {
    router.push(route)
  }
}

// 跳转到报告管理界面
const goToReportManagement = () => {
  router.push('/report-management')
}
</script>

<template>
  <div class="home-container">
      <div class="home-page">
        <div class="welcome-section">
          <div class="welcome-header">
            <h2>欢迎使用自动化测试平台</h2>
            <div class="quick-actions">
              <button class="action-btn">
                <i class="action-icon">➕</i>
                新建任务
              </button>
              <button class="action-btn" @click="goToReportManagement">
                <i class="action-icon">📊</i>
                查看报告
              </button>
            </div>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-value">{{ modules.reduce((sum, m) => sum + (m.count?.total || 0), 0) }}</div>
              <div class="stat-label">总任务数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ modules.reduce((sum, m) => sum + (m.count?.done || 0), 0) }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ Math.round(modules.reduce((sum, m) => sum + ((m.count?.done || 0) / (m.count?.total || 1) * 100), 0) / modules.length) }}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </div>
        </div>

        <div class="modules-section">
          <h3 class="section-title">功能模块</h3>
          <div class="modules-grid">
            <div v-for="module in modules" 
                 :key="module.id" 
                 class="module-card"
                 @click="navigateToModule(module.id)">
              <div class="module-header">
                <div class="module-icon">{{ module.icon }}</div>
                <h4>{{ module.name }}</h4>
              </div>
              <p class="module-desc">{{ module.description }}</p>
              <div class="module-progress">
                <div class="progress-bar">
                  <div class="progress" 
                       :style="{ width: `${Math.round((module.count?.done || 0) / (module.count?.total || 1) * 100)}%` }">
                  </div>
                </div>
                <div class="progress-text">
                  {{ module.count?.done || 0 }}/{{ module.count?.total || 0 }}
                </div>
              </div>
              <div class="module-features">
                <span v-for="feature in module.features" 
                      :key="feature" 
                      class="feature-tag">
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  width: 100%;
  box-sizing: border-box;
}

.home-page {
  width: 100%;
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.welcome-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.welcome-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1a1a1a;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #0052cc;
}

.overview-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

.stat-item {
  flex: 1 1 200px;
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  min-width: 150px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.modules-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 24px 0;
  font-size: 20px;
  color: #1a1a1a;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}

.module-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  min-width: 400px;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.module-icon {
  font-size: 24px;
}

.module-header h4 {
  margin: 0;
  font-size: 16px;
  color: #1a1a1a;
}

.module-desc {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.module-progress {
  margin-bottom: 16px;
}

.progress-bar {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.module-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

/* 响应式布局增强 */
@media screen and (max-width: 900px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .module-card {
    min-width: 0;
  }
}

@media screen and (min-width: 901px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 1920px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .home-page {
    padding: 0 40px;
  }
}

@media screen and (min-width: 2560px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    gap: 20px;
  }
  
  .welcome-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .quick-actions {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .welcome-header h2 {
    font-size: 20px;
  }
  
  .action-btn {
    font-size: 14px;
    padding: 6px 12px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .module-header h4 {
    font-size: 14px;
  }
  
  .module-desc {
    font-size: 12px;
  }
}
</style>

