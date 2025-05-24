<template>
  <body>
    <div id="app">
      <div class="absolute inset-0 bg-black opacity-25"></div>
      <div class="flex items-center justify-center min-h-screen bg-gray-100 font-poppins">
        <div
          class="container"
          :class="{ 'right-panel-active': isRegister }"
          id="container"
        >
          <!-- Register Form -->
          <div class="form-container register-container">
            <form @submit.prevent="register">
              <h1>Register here.</h1>
              <input v-model="name" type="name" placeholder="Name" required>
              <input v-model="email" type="email" placeholder="Email" required>
              <input v-model="phone" type="phone" placeholder="Phone" required>
              <input v-model="password" type="password" placeholder="Password" required>
              <div v-if="error" class="text-red-600 text-sm my-2">{{ error }}</div>
              <button type="submit" class="btn-primary">Register</button>
              <!-- <span>or use your account</span>
              <div class="social-container">
                <a href="#" class="social"><i class="lni lni-facebook-fill"></i></a>
                <a href="#" class="social"><i class="lni lni-google"></i></a>
                <a href="#" class="social"><i class="lni lni-linkedin-original"></i></a>
              </div> -->
            </form>
          </div>
          <!-- Login Form -->
          <div class="form-container login-container">
            <form @submit.prevent="login">
              <h1>Login here.</h1>
              <input v-model="email" type="email" placeholder="Email" required>
              <input v-model="password" type="password" placeholder="Password" required>
              <div v-if="error" class="text-red-600 text-sm my-2">{{ error }}</div>
              <div class="content">
                <!-- <div class="checkbox">
                  <input type="checkbox" id="checkbox" />
                  <label for="checkbox">Remember me</label>
                </div> -->
                <div class="pass-link">
                  <a href="#">Forgot password?</a>
                </div>
              </div>
              <button type="submit" class="btn-primary">Login</button>
            </form>
          </div>
          <!-- Overlay -->
          <div class="overlay-container">
            <div class="overlay">
              <div class="overlay-panel overlay-left">
                <h1 class="title">Hello <br /> friends</h1>
                <p><b>If you have an account, login here and have fun</b></p>
                <button class="ghost" @click="isRegister = false">
                  Login
                  <i class="lni lni-arrow-left login"></i>
                </button>
              </div>
              <div class="overlay-panel overlay-right">
                <h1 class="title">Start your <br /> journey now</h1>
                <p><b>If you don't have an account yet, join us and start your journey.</b></p>
                <button class="ghost" @click="isRegister = true">
                  Register
                  <i class="lni lni-arrow-right register"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isRegister = ref(false)

async function login() {
  try {
    error.value = ''
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.message || 'Login gagal'
      return
    }
    // Simpan token agar bisa dipakai ke halaman lain
    localStorage.setItem('token', data.accessToken)
    // Optionally simpan refreshToken dan user info jika mau
    // localStorage.setItem('refreshToken', data.refreshToken)
    // localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/') // Ganti sesuai halaman tujuan setelah login
  } catch (err) {
    console.error(err)
  }
}

async function register() {
  try{
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value, phone_number: phone.value, password: password.value })
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.message || 'Register gagal'
      return
    }
    isRegister.value = false
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins');
@import url('https://cdn.lineicons.com/4.0/lineicons.css');

* {
  box-sizing: border-box;
}

body {
  display: flex;
  background-color: #f6f5f7;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Poppins", sans-serif;
  overflow: hidden;
  height: 100vh;
}

h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -1.5px;
  margin: 0;
  margin-bottom: 15px;
}

h1.title {
  font-size: 45px;
  line-height: 45px;
  margin: 0;
  text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
}

span {
  font-size: 14px;
  margin-top: 25px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: 0.3s ease-in-out;
}

a:hover {
  color: #4bb6b7;
}

.content {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: space-around;
}

.content .checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content input {
  accent-color: #333;
  width: 12px;
  height: 12px;
}

.content label {
  font-size: 14px;
  user-select: none;
  padding-left: 5px;
}

button {
  position: relative;
  border-radius: 20px;
  border: 1px solid #4bb6b7;
  background-color: #4bb6b7;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  margin: 10px;
  padding: 12px 80px;
  letter-spacing: 1px;
  text-transform: capitalize;
  transition: 0.3s ease-in-out;
}

button:hover {
  letter-spacing: 3px;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: rgba(225, 225, 225, 0.2);
  border: 2px solid #fff;
  color: #fff;
}

button.ghost i{
  position: absolute;
  opacity: 0;
  transition: 0.3s ease-in-out;
}

button.ghost i.register{
  right: 70px;
}

button.ghost i.login{
  left: 70px;
}

button.ghost:hover i.register{
  right: 40px;
  opacity: 1;
}

button.ghost:hover i.login{
  left: 40px;
  opacity: 1;
}

form {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: #eee;
  border-radius: 10px;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 25px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 500px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.login-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .login-container {
  transform: translateX(100%);
}

.register-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .register-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translate(-100%);
}

.overlay {
  background-image: url('../assets/Feltyoung.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(46, 94, 109, 0.4) 40%,
    rgba(46, 94, 109, 0)
  );
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #dddddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
  transition: 0.3s ease-in-out;
}

.social-container a:hover {
  border: 1px solid #4bb6b7;
}
</style>
