<!-- <template>
  <head>
    <title>Login Page</title>
  </head>
  <div style="max-width: 350px; margin: 50px auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="text-align:center">Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required style="display:block; margin-bottom:10px; width:100%; padding:8px;">
      <input v-model="password" type="password" placeholder="Password" required style="display:block; margin-bottom:10px; width:100%; padding:8px;">
      <button type="submit" style="width:100%; padding:8px; background:#2d9cdb; color:white; border:none; border-radius:4px;">Login</button>
    </form>
    <p style="text-align:center; margin: 16px 0 0 0;">
      Belum punya akun? <router-link to="/register">Daftar</router-link>
    </p>
    <p v-if="error" style="color:red; margin-top:10px; text-align:center">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

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
    error.value = 'Terjadi kesalahan'
  }
}


</script> -->
