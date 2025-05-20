import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SimulationView from '../views/SimulationView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ReportManagementView from '../views/ReportManagementView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/simulation',
      name: 'Simulation',
      component: SimulationView
    },
    {
      path: '/report-management',
      name: 'ReportManagement',
      component: ReportManagementView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  if (to.path !== '/login' && to.path !== '/register' && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
