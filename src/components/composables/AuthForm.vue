<template>
  <div class="w-full min-h-screen flex items-center justify-center font-poppins px-4 md:px-0">
    <div class="container" :class="{ 'right-panel-active': isRegister }" id="container">
      <!-- Register Form -->
      <div class="form-container register-container">
        <form @submit.prevent="register">
          <h1>Register here.</h1>
          <input v-model="name" type="text" placeholder="Name" required maxlength="100" />
          <p v-if="validationErrors.name" class="text-red-500 text-sm">
            {{ validationErrors.name }}
          </p>

          <input v-model="email" type="email" placeholder="Email" required maxlength="255" />
          <p v-if="validationErrors.email" class="text-red-500 text-sm">
            {{ validationErrors.email }}
          </p>

          <input v-model="phone" type="tel" placeholder="Phone" required maxlength="20" />
          <p v-if="validationErrors.phone" class="text-red-500 text-sm">
            {{ validationErrors.phone }}
          </p>

          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            maxlength="100"
            minlength="6"
          />
          <p v-if="validationErrors.password" class="text-red-500 text-sm">
            {{ validationErrors.password }}
          </p>

          <div v-if="error" class="text-red-600 text-sm my-2">{{ error }}</div>
          <button type="submit" class="btn-primary cursor-pointer" :disabled="isLoading">
            <span v-if="!isLoading">Register</span>
            <span v-else class="flex items-center gap-2 justify-center">
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Registering...
            </span>
          </button>
        </form>
      </div>

      <!-- Login Form -->
      <div class="form-container login-container">
        <form @submit.prevent="login">
          <h1>Login here.</h1>
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <div v-if="error" class="text-red-600 text-sm my-2">{{ error }}</div>
          <div class="content">
            <div class="pass-link"><a href="#">Forgot password?</a></div>
          </div>
          <button type="submit" class="btn-primary cursor-pointer">Login</button>
        </form>
      </div>

      <!-- Overlay Desktop Only -->
      <div class="overlay-container hidden md:block">
        <div class="overlay" :style="{ backgroundImage: `url(${bgImage})` }">
          <div class="overlay-panel overlay-left">
            <h1 class="title">Hello <br />friends</h1>
            <p><b>If you have an account, login here and have fun</b></p>
            <button class="ghost cursor-pointer" @click="isRegister = false">Login</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1 class="title">Start your <br />journey now</h1>
            <p><b>If you don't have an account yet, join us and start your journey.</b></p>
            <button class="ghost cursor-pointer" @click="isRegister = true">Register</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Switcher Button Mobile -->
    <div class="md:hidden text-center mt-6">
      <button class="text-blue-600 underline" @click="isRegister = !isRegister">
        {{ isRegister ? 'Already have an account? Login' : "Don't have an account? Register" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import bgImage from '@/assets/Feltyoung.jpg'
import Swal from 'sweetalert2'

const emit = defineEmits(['close', 'login-success'])
const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isRegister = ref(false)
const isLoading = ref(false)

async function login() {
  try {
    error.value = ''
    await authStore.login(email.value, password.value)
    emit('login-success')
    emit('close')
    window.location.href = '/'
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal'
  }
}

const validationErrors = ref({ name: '', email: '', phone: '', password: '' })

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)
}
function isValidPhone(phone) {
  return /^(?:\+62|62|08)[2-9][0-9]{7,11}$/.test(phone) || /^\+[1-9][0-9]{7,14}$/.test(phone)
}

watch(name, (val) => {
  validationErrors.value.name = val.length > 100 ? 'Name too long (max 100 characters)' : ''
})
watch(email, (val) => {
  if (val.length > 255) validationErrors.value.email = 'Email too long'
  else if (!isValidEmail(val)) validationErrors.value.email = 'Invalid email'
  else validationErrors.value.email = ''
})
watch(phone, (val) => {
  validationErrors.value.phone = !isValidPhone(val) ? 'Invalid phone number' : ''
})
watch(password, (val) => {
  validationErrors.value.password = !isStrongPassword(val)
    ? 'Weak password: min 6 chars with upper, lower, number'
    : ''
})

const hasValidationErrors = () => Object.values(validationErrors.value).some((msg) => msg !== '')

async function register() {
  try {
    error.value = ''
    isLoading.value = true
    if (hasValidationErrors()) {
      error.value = 'Please fix the validation errors.'
      return
    }
    await authStore.register({
      name: name.value,
      email: email.value,
      phone_number: phone.value,
      password: password.value,
    })
    await Swal.fire({
      title: 'Registration Successful!',
      text: 'Please check your email to verify.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5C4033',
    })
    isRegister.value = false
  } catch (err) {
    error.value = err.response?.data?.message || 'Register failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins');

.container {
  background-color: #fff;
  border-radius: 25px;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
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
  width: 50%;
}

.login-container {
  left: 0;
  z-index: 2;
}

.container.right-panel-active .login-container {
  transform: translateX(100%);
}

.register-container {
  left: 0;
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
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translate(-100%);
}

.overlay {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
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

form {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
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

button {
  border-radius: 20px;
  border: 1px solid #5c4033;
  background-color: #5c4033;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  margin: 10px;
  padding: 12px 80px;
  transition: 0.3s ease-in-out;
}
button:hover {
  letter-spacing: 2px;
}
button.ghost {
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
    min-height: auto;
    box-shadow: none;
    border-radius: 0;
  }

  .form-container {
    width: 100% !important;
    position: relative !important;
    transform: none !important;
    opacity: 1 !important;
    z-index: 2 !important;
  }

  .overlay-container {
    display: none !important;
  }

  form {
    padding: 2rem 1rem;
  }

  button {
    padding: 10px 40px;
  }
}
</style>
