<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
          placeholder="请输入用户名"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="请输入密码"
        />
      </div>
      <button type="submit" class="login-button">登录</button>
      <p class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    // 使用新的服务器地址
    const apiUrl = 'https://smartproject.onrender.com/api/login';

    const response = await axios.post(apiUrl, {
      username: username.value,
      password: password.value
    })
    
    if (response.data.message === '登录成功') {
      console.log('登录响应数据:', response.data)
      // 保存用户信息到 localStorage
      const userData = {
        username: response.data.user.username,
        userType: response.data.user.userType || 'user'
      }
      console.log('保存的用户数据:', userData)
      localStorage.setItem('user', JSON.stringify(userData))
      // 登录成功，跳转到首页
      router.push('/')
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请检查用户名和密码')
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: bold;
  font-size: 14px;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  height: 20px;
}

.login-button {
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #45a049;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式布局 */
/* @media screen and (min-width: 1920px) {
  .login-container {
    padding: 40px;
    max-width: 500px;
  }
  
  h2 {
    font-size: 28px;
    margin-bottom: 35px;
  }
  
  .form-group {
    gap: 10px;
  }
  
  label {
    font-size: 16px;
  }
  
  input {
    padding: 14px;
    font-size: 16px;
    height: 24px;
  }
  
  .login-button {
    padding: 14px;
    font-size: 18px;
  }
  
  .register-link {
    font-size: 16px;
  }
}

@media screen and (max-width: 768px) {
  .login-container {
    width: 90%;
    max-width: 400px;
    margin: 0;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    gap: 6px;
  }
  
  label {
    font-size: 13px;
  }
  
  input {
    padding: 10px;
    font-size: 13px;
    height: 18px;
  }
  
  .login-button {
    padding: 10px;
    font-size: 14px;
  }
  
  .register-link {
    font-size: 13px;
  }
} */
</style> 