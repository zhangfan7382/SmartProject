<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const router = useRouter()
const showUserDropdown = ref(false)
const isModuleExpanded = ref(true)
const currentUser = ref({
  username: '',
  userType: 'user' // 默认设置为普通用户
})

// 检查用户登录状态
const checkUserLogin = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const userData = JSON.parse(userStr)
      currentUser.value = {
        username: userData.username || '',
        userType: userData.userType || 'user' // 如果userType不存在，默认为普通用户
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
      currentUser.value = { username: '', userType: 'user' }
    }
  } else {
    currentUser.value = { username: '', userType: 'user' }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  checkUserLogin() // 组件挂载时检查登录状态
})

// 监听路由变化，每次路由变化时检查登录状态
watch(() => router.currentRoute.value, () => {
  checkUserLogin()
}, { immediate: true })

const toggleDropdown = (event: Event) => {
  event.stopPropagation()
  showUserDropdown.value = !showUserDropdown.value
}

const toggleModule = () => {
  isModuleExpanded.value = !isModuleExpanded.value
  router.push('/home')
}

const closeDropdown = () => {
  showUserDropdown.value = false
}

// 点击页面其他区域时关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const userInfo = document.querySelector('.user-info')
  if (userInfo && !userInfo.contains(event.target as Node)) {
    closeDropdown()
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = () => {
  localStorage.removeItem('user')
  currentUser.value = { username: '', userType: 'user' }
  router.push('/login')
}
</script>

<template>
  <div class="app-container">
    <header class="main-header">
      <div class="header-brand">
        <h1>自动化测试平台</h1>
        <span class="version">V1.0</span>
      </div>
      <div class="header-nav">
        <a href="#" class="header-nav-item">
          <i class="nav-icon">🔔</i>
          <span class="badge">3</span>
        </a>
        <a href="#" class="header-nav-item">
          <i class="nav-icon">📅</i>
          <span>待办</span>
        </a>
        <a href="#" class="header-nav-item">
          <i class="nav-icon">❓</i>
          <span>帮助</span>
        </a>
      </div>
      <div class="header-right">
        <div class="user-info" @click="toggleDropdown">
          <img src="/src/assets/avatar.jpg" alt="avatar" class="user-avatar">
          <div class="user-details">
            <span class="user-name">{{ currentUser.username || '未登录' }}</span>
            <span class="user-type" v-if="currentUser.userType">
              {{ currentUser.userType === 'admin' ? '管理员' : '普通用户' }}
            </span>
          </div>
          <div class="user-dropdown" v-show="showUserDropdown">
            <a href="#" class="dropdown-item" @click.stop>
              <i class="icon">👤</i>
              <span>个人信息</span>
            </a>
            <a href="#" class="dropdown-item" @click.stop>
              <i class="icon">🔑</i>
              <span>修改密码</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" @click.stop="handleLogout">
              <i class="icon">🚪</i>
              <span>退出</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <div class="main-container">
      <nav class="main-nav">
        <div class="nav-item module-header" @click="toggleModule">
          <i class="nav-icon">🏠</i>
          <span>功能模块</span>
          <i class="toggle-icon" :class="{ 'expanded': isModuleExpanded }">▼</i>
        </div>
        <div class="sub-tabs" :class="{ 'expanded': isModuleExpanded }">
          <!-- <RouterLink to="/offline-simulation" class="sub-tab-item">离线仿真模块</RouterLink> -->
          <RouterLink to="/jira-integration" class="sub-tab-item">Jira集成模块</RouterLink>
          <RouterLink to="/config-management" class="sub-tab-item">配置管理模块</RouterLink>
          <RouterLink to="/road-test-simulation" class="sub-tab-item">路试回灌模块</RouterLink>
          <RouterLink to="/roadtest-replay-eval" class="sub-tab-item">路试回灌仿真与事件评估</RouterLink>
          <RouterLink to="/modular-deploy-replay" class="sub-tab-item">模块化部署与回灌测试</RouterLink>
          <RouterLink to="/report-management" class="sub-tab-item">报告管理模块</RouterLink>
          <RouterLink to="/data-integration" class="sub-tab-item">数据链路与平台集成</RouterLink>
          <!-- <RouterLink to="/cloud-integration" class="sub-tab-item">闭环回归仿真模块</RouterLink> -->
          <RouterLink to="/visualization-playback" class="sub-tab-item">可视化工具与播包观测</RouterLink>
          <!-- <RouterLink to="/replay-testing" class="sub-tab-item">回灌测试模块</RouterLink>
          <RouterLink to="/environment-deployment" class="sub-tab-item">环境部署模块</RouterLink>
          <RouterLink to="/visualization-tools" class="sub-tab-item">可视化工具模块</RouterLink>
          <RouterLink to="/api-support" class="sub-tab-item">接口支持模块</RouterLink> -->
        </div>
        <RouterLink to="/login" class="nav-item">
          <i class="nav-icon">📋</i>
          <span>登录</span>
        </RouterLink>
        <!-- <RouterLink to="/reports" class="nav-item">
          <i class="nav-icon">📄</i>
          <span>测试报告</span>
        </RouterLink> -->
      </nav>

      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #006AF1;
  --nav-bg-color: #1E1E1E;
  --header-height: 50px;
  --header-height1: 200px;
  --nav-width: 240px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  height: var(--header-height);
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: var(--nav-width);
}

.header-brand h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.version {
  font-size: 12px;
  opacity: 0.8;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  position: relative;
}

.header-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #f56565;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 8px;
  text-align: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 14px;
  color: white;
}

.user-type {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  margin-top: 8px;
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
}

/* 主内容框，包含侧边栏和内容 */
.main-container {
  display: flex;
  margin-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
  width: 100%;
  box-sizing: border-box;
  /* border: 2px dashed green; */
}

/* 内容 */
.main-content {
  flex: 1;
  margin-left: var(--nav-width);
  padding: 20px;
  background-color: #f7f7f7;
  min-height: calc(100vh - var(--header-height));
  box-sizing: border-box;
  width: calc(100% - var(--nav-width));
  overflow-x: hidden;
  /* border: 2px dashed red; */
}

/* 侧边栏 */
.main-nav {
  width: var(--nav-width);
  background-color: var(--nav-bg-color);
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  padding: 20px 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bbb #222;
}

/* 美化滚动条（可选） */
.main-nav::-webkit-scrollbar {
  width: 7px;
}
.main-nav::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 4px;
}
.main-nav::-webkit-scrollbar-track {
  background: #222;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s;
  gap: 10px;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  border-left: 3px solid var(--primary-color);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.module-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.module-header .toggle-icon {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.toggle-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.sub-tabs {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 34px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-tabs.expanded {
  max-height: 500px;
  margin-bottom: 8px;
}

.sub-tab-item {
  color: #bbb;
  font-size: 13px;
  padding: 6px 0 6px 16px;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  white-space: nowrap;
}

.sub-tab-item.router-link-active {
  color: #fff;
  border-left: 2px solid var(--primary-color);
  background: rgba(255,255,255,0.08);
}
.sub-tab-item:hover {
  color: #fff;
}

/* 
@media (max-width: 1440px) {
  .main-container {
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  .main-container {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }

  .main-nav {
    width: 60px;
  }

  .nav-item span {
    display: none;
  }

  .main-content {
    margin-left: 60px;
    width: calc(100% - 60px);
    padding: 20px;
  }

  .header-brand {
    min-width: auto;
  }

  .header-brand h1 {
    font-size: 16px;
  }

  .version {
    display: none;
  }

  .user-name {
    display: none;
  }
} */

/* @media (min-width: 1920px) {
  .main-content {
    max-width: 1600px;
    min-height: calc(100vh - var(--header-height));
    margin-left: var(--nav-width);
    margin-right: auto;
    padding: 40px 80px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
} */
</style>
