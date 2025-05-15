<template>
  <div class="sidebar-login">
    <div class="login-form">
      <h3>用户登录</h3>
      <div class="form-group">
        <input
          type="text"
          v-model="username"
          placeholder="用户名"
          class="input-field"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="password"
          placeholder="密码"
          class="input-field"
        />
      </div>
      <button @click="handleLogin" class="login-button">登录</button>
      <div class="register-link">
        <span>还没有账号？</span>
        <a href="#" @click.prevent="showRegister = true">立即注册</a>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegister" class="register-modal">
      <div class="modal-content">
        <h3>用户注册</h3>
        <div class="form-group">
          <input
            type="text"
            v-model="registerUsername"
            placeholder="用户名"
            class="input-field"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            v-model="registerPassword"
            placeholder="密码"
            class="input-field"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="确认密码"
            class="input-field"
          />
        </div>
        <div class="button-group">
          <button @click="handleRegister" class="register-button">注册</button>
          <button @click="showRegister = false" class="cancel-button">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')
const showRegister = ref(false)
const registerUsername = ref('')
const registerPassword = ref('')
const confirmPassword = ref('')

const handleLogin = async () => {
  try {
    const response = await axios.post('http://192.168.2.144:3000/api/login', {
      username: username.value,
      password: password.value
    })
    
    if (response.data.message === '登录成功') {
      // 登录成功后的处理
      alert('登录成功')
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请检查用户名和密码')
  }
}

const handleRegister = async () => {
  if (registerPassword.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  try {
    const response = await axios.post('http://192.168.2.144:3000/api/register', {
      username: registerUsername.value,
      password: registerPassword.value
    })
    
    if (response.data.message === '注册成功') {
      alert('注册成功，请登录')
      showRegister.value = false
    }
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册失败，请稍后重试')
  }
}
</script>

<style scoped>
.sidebar-login {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h3 {
  margin: 0 0 15px 0;
  text-align: center;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-field {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.login-button {
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.login-button:hover {
  background-color: #45a049;
}

.register-link {
  text-align: center;
  font-size: 12px;
  margin-top: 10px;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.register-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.register-button {
  flex: 1;
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  flex: 1;
  padding: 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #45a049;
}

.cancel-button:hover {
  background-color: #d32f2f;
}
</style> 