<template>
  <div class="max-w-xl mx-auto text-center py-20">
    <h1 class="text-2xl font-bold mb-4">Verifikasi Email</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'
const router = useRouter()
const message = ref('Memproses verifikasi email...')

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const email = params.get('email')

  if (!token || !email) {
    message.value = 'Link verifikasi tidak valid.'
    return
  }

  try {
    // 1. Cek token valid atau tidak
    const res1 = await axios.post(`http://localhost:3000/api/verify-token/${token}`)
    const result = res1.data

    if (result.token_valid === 'valid') {
      // 2. Set email sebagai verified
      await axios.post(`http://localhost:3000/api/verify-email/${email}`)
      message.value = 'Email berhasil diverifikasi! Silakan login.'
    } else if (result.token_valid === 'expired') {
      message.value = 'Link verifikasi sudah kadaluarsa.'
    } else {
      message.value = 'Token verifikasi tidak valid.'
    }
  } catch (err) {
    console.error(err)
    message.value = 'Terjadi kesalahan saat memverifikasi email.'
  } finally {
    setTimeout(() => {
      message.value += ' Redirecting...'
    }, 2000)
    router.push('/') // Redirect ke halaman utama setelah verifikasi
  }
})
</script>
