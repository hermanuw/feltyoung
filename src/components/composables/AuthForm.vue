<template>
  <div class="w-full h-full flex items-center justify-center font-poppins">
    <div
      ref="authContainer"
      class="container"
      :class="{ 'right-panel-active': isRegister }"
      id="container"
    >
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
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
              Registering...
            </span>
          </button>
          <span class="mobile-text"
            >Already have an account?
            <a href="#" @click.prevent="isRegister = false">Login</a>
          </span>
        </form>
      </div>

      <div class="form-container login-container">
        <form @submit.prevent="login">
          <h1>Login here.</h1>
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <div v-if="error" class="text-red-600 text-sm my-2">{{ error }}</div>
          <div class="content">
            <div class="pass-link">
              <a href="#">Forgot password?</a>
            </div>
          </div>
          <button type="submit" class="btn-primary cursor-pointer">Login</button>
          <span class="mobile-text"
            >Don't have an account?
            <a href="#" @click.prevent="isRegister = true">Register</a>
          </span>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay" :style="{ backgroundImage: `url(${bgImage})` }">
          <div class="overlay-panel overlay-left">
            <h1 class="title">
              Hello <br />
              friends
            </h1>
            <p><b>If you have an account, login here and have fun</b></p>
            <button class="ghost cursor-pointer" @click="isRegister = false">
              Login
              <i class="lni lni-arrow-left login"></i>
            </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1 class="title">
              Start your <br />
              journey now
            </h1>
            <p><b>If you don't have an account yet, join us and start your journey.</b></p>
            <button class="ghost cursor-pointer" @click="isRegister = true">
              Register
              <i class="lni lni-arrow-right register"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import bgImage from '@/assets/Feltyoung.jpg'
import Swal from 'sweetalert2'

const emit = defineEmits(['close', 'login-success'])

const authStore = useAuthStore()
const router = useRouter()

// Ref untuk click-outside
const authContainer = ref(null)

const handleClickOutside = (event) => {
  // Hanya jalankan di mobile
  if (window.innerWidth > 768) {
    return
  }
  // Jika klik terjadi di luar container, emit close
  if (authContainer.value && !authContainer.value.contains(event.target)) {
    emit('close')
  }
}

// Lifecycle hooks untuk event listener
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// State untuk form
const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isRegister = ref(false)
const isLoading = ref(false)

// Functions
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

async function register() {
  try {
    error.value = ''
    isLoading.value = true

    if (hasValidationErrors()) {
      error.value = 'Please fix the validation errors before submitting.'
      isLoading.value = false
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
      text: 'Please check your email to verify your account.',
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

// Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isStrongPassword(password) {
  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  return pwRegex.test(password)
}

function isValidPhone(phone) {
  const regexIndo = /^(?:\+62|62|08)[2-9][0-9]{7,11}$/
  const regexIntl = /^\+[1-9][0-9]{7,14}$/
  return regexIndo.test(phone) || regexIntl.test(phone)
}

const validationErrors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
})

const hasValidationErrors = () => {
  return Object.values(validationErrors.value).some((msg) => msg !== '')
}

// Watchers
watch(name, (val) => {
  validationErrors.value.name = val.length > 100 ? 'Name too long (max 100 characters)' : ''
})

watch(email, (val) => {
  if (val.length > 255) {
    validationErrors.value.email = 'Email too long (max 255 characters)'
  } else if (!isValidEmail(val)) {
    validationErrors.value.email = 'Invalid email format'
  } else {
    validationErrors.value.email = ''
  }
})

watch(phone, (val) => {
  validationErrors.value.phone = !isValidPhone(val)
    ? 'Invalid phone number (start with +62, 62, 08, or + followed by country code)'
    : ''
})

watch(password, (val) => {
  validationErrors.value.password = !isStrongPassword(val)
    ? 'Password must be 6+ characters with uppercase, lowercase, and number'
    : ''
})
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
  font-family: 'Poppins', sans-serif;
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
  border: 1px solid #5c4033;
  background-color: #5c4033;
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

button.ghost i {
  position: absolute;
  opacity: 0;
  transition: 0.3s ease-in-out;
}

button.ghost i.register {
  right: 70px;
}

button.ghost i.login {
  left: 70px;
}

button.ghost:hover i.register {
  right: 40px;
  opacity: 1;
}

button.ghost:hover i.login {
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
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(46, 94, 109, 0.4) 40%, rgba(46, 94, 109, 0));
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

/* Sembunyikan link toggle di desktop */
.mobile-text {
  display: none;
}

/* KODE PERBAIKAN UNTUK MOBILE */
@media (max-width: 768px) {
  .container {
    width: 90%;
    min-height: 500px;
    max-width: 400px;
    box-shadow: none;
  }

  .overlay-container {
    display: none;
  }

  .form-container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    position: absolute;
    top: 0;
    transition:
      opacity 0.6s ease-in-out,
      transform 0.6s ease-in-out;
  }

  .login-container {
    opacity: 1;
    z-index: 2;
  }

  .register-container {
    opacity: 0;
    z-index: 1;
    /* Cegah interaksi saat tersembunyi */
    pointer-events: none;
  }

  .container.right-panel-active .login-container {
    transform: translateX(0); /* Batalkan pergerakan */
    opacity: 0;
    z-index: 1;
    pointer-events: none;
  }

  .container.right-panel-active .register-container {
    transform: translateX(0); /* Batalkan pergerakan */
    opacity: 1;
    z-index: 5;
    pointer-events: auto; /* Izinkan interaksi saat terlihat */
    animation: none;
  }
  .modal-close-button {
    display: none; /* Sembunyikan tombol 'x' di mobile */
  }
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  input {
    width: 100%;
    padding: 12px;
    margin: 6px 0;
    font-size: 14px;
  }

  button {
    padding: 12px 40px;
    font-size: 14px;
    margin-top: 15px;
  }

  .mobile-text {
    display: block;
    font-size: 14px;
    margin-top: 20px;
  }

  .mobile-text a {
    font-weight: bold;
    color: #5c4033;
    margin: 0;
    padding-left: 5px;
  }
}
</style>
