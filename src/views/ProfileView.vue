<!-- <template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm p-8 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      <form @submit.prevent="register">
        <input v-model="name" placeholder="Nama Lengkap" class="input" required />
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="phone" placeholder="No Telepon" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" required />
        <button class="btn">Daftar</button>
      </form>
      <p class="mt-4 text-center text-sm">
        Sudah punya akun?
        <router-link to="/login" class="text-blue-500 underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')

async function register() {
  console.log('Register:', name.value, email.value, phone.value, password.value)
  try{
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value, phone: phone.value, password: password.value })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || 'Register gagal')
      return
    }
    alert('Register berhasil! Silakan login.')
    router.push('/login')
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan saat mendaftar.')
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  border-width: 1px;
  border-radius: 0.25rem;
}
.btn {
  width: 100%;
  background-color: #22c55e;
  color: #fff;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}
.btn:hover {
  background-color: #16a34a;
}
</style> -->
