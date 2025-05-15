import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SimulationView from '../views/SimulationView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },    
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/simulation',
      name: 'simulation',
      component: SimulationView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/offline-simulation',
      name: 'offline-simulation',
      component: () => import('../views/OfflineSimulationView.vue'),
    },
    {
      path: '/jira-integration',
      name: 'jira-integration',
      component: () => import('../views/JiraIntegrationView.vue'),
    },
    {
      path: '/config-management',
      name: 'config-management',
      component: () => import('../views/ConfigManagementView.vue'),
    },
    {
      path: '/road-test-simulation',
      name: 'road-test-simulation',
      component: () => import('../views/RoadTestSimulationView.vue'),
    },
    {
      path: '/report-management',
      name: 'report-management',
      component: () => import('../views/ReportManagementView.vue'),
    },
    {
      path: '/cloud-integration',
      name: 'cloud-integration',
      component: () => import('../views/CloudIntegrationView.vue'),
    },
    {
      path: '/replay-testing',
      name: 'replay-testing',
      component: () => import('../views/ReplayTestingView.vue'),
    },
    {
      path: '/environment-deployment',
      name: 'environment-deployment',
      component: () => import('../views/EnvironmentDeploymentView.vue'),
    },
    {
      path: '/visualization-tools',
      name: 'visualization-tools',
      component: () => import('../views/VisualizationToolsView.vue'),
    },
    {
      path: '/api-support',
      name: 'api-support',
      component: () => import('../views/ApiSupportView.vue'),
    },
    {
      path: '/data-integration',
      name: 'data-integration',
      component: () => import('../views/DataIntegrationView.vue'),
    },
    {
      path: '/visualization-playback',
      name: 'visualization-playback',
      component: () => import('../views/VisualizationPlaybackView.vue'),
    },
    {
      path: '/roadtest-replay-eval',
      name: 'roadtest-replay-eval',
      component: () => import('../views/RoadTestReplayEvaluationView.vue'),
    },
    {
      path: '/modular-deploy-replay',
      name: 'modular-deploy-replay',
      component: () => import('../views/ModularDeployAndReplayView.vue'),
    },
  ],
})

export default router
