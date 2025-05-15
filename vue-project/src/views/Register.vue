<template>
  <div class="register-container">
    <h2>注册</h2>
    <form @submit.prevent="handleRegister" class="register-form">
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
        <label for="userType">用户类型</label>
        <select id="userType" v-model="userType" required class="user-type-select">
          <option value="">请选择用户类型</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>
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
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          placeholder="请再次输入密码"
        />
      </div>

      <button type="submit" class="register-button">注册</button>
      <p class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
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
const confirmPassword = ref('')
const userType = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  if (!userType.value) {
    alert('请选择用户类型')
    return
  }

  try {
    // 获取当前主机地址
    const host = window.location.hostname;
    const port = '3000';
    const apiUrl = `http://${host}:${port}/api/register`;

    const response = await axios.post(apiUrl, {
      username: username.value,
      password: password.value,
      userType: userType.value
    })
    
    if (response.data.message === '注册成功') {
      alert('注册成功')
      router.push('/login')
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message)
    } else {
    alert('注册失败，请稍后重试')
    }
  }
}
</script>

<style scoped>
.register-container {
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
  margin-bottom: 20px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.register-button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.register-button:hover {
  background-color: #45a049;
}

.login-link {
  text-align: center;
  margin-top: 10px;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 添加响应式布局 */
@media screen and (min-width: 1920px) {
  .register-container {
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
  }
  
  .register-button {
    padding: 14px;
    font-size: 18px;
  }
  
  .login-link {
    font-size: 16px;
  }
}

@media screen and (max-width: 768px) {
  .register-container {
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
  }
  
  .register-button {
    padding: 10px;
    font-size: 14px;
  }
  
  .login-link {
    font-size: 13px;
  }
}

.user-type-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  background-color: white;
}

.user-type-select:focus {
  outline: none;
  border-color: #4CAF50;
}
</style> 