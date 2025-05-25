<template>
  <div class="max-w-3xl mx-auto py-10 px-4 pt-30">
    <h2 class="text-2xl font-bold mb-6">Kelola Profil</h2>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg p-6 space-y-5">
      <!-- Nama dan Telepon -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nama Lengkap</label>
          <input v-model="form.name" class="form-input" type="text" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">No. Telepon</label>
          <input v-model="form.phone_number" class="form-input" type="text" />
        </div>
      </div>

      <!-- Password -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Password Saat Ini</label>
          <input v-model="form.current_password" class="form-input" type="password" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Password Baru</label>
          <input v-model="form.new_password" class="form-input" type="password" />
        </div>
      </div>

      <!-- Alamat -->
      <div>
        <label class="block text-sm font-medium mb-1">Alamat</label>
        <textarea v-model="form.address" class="form-input h-24"></textarea>
      </div>

      <button class="btn-black w-full">Simpan Semua Perubahan</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axios'

const form = ref({
  name: '',
  phone_number: '',
  current_password: '',
  new_password: '',
  address: '',
  email: '',
})

onMounted(async () => {
  try {
    const res = await axiosInstance.get('/profile')
    console.log('Profil:', res.data)
    Object.assign(form.value, res.data)
  } catch (err) {
    console.error('Gagal load profil:', err)
  }
})

async function handleSubmit() {
  try {
    await axiosInstance.put('/profile', {
      name: form.value.name,
      phone_number: form.value.phone_number,
    })

    if (form.value.current_password && form.value.new_password) {
      await axiosInstance.put('/profile/password', {
        current_password: form.value.current_password,
        new_password: form.value.new_password,
      })
    }

    await axiosInstance.put('/profile/address', {
      address: form.value.address,
    })

    alert('Semua data berhasil diperbarui')
    form.value.current_password = ''
    form.value.new_password = ''
  } catch (err) {
    console.error(err)
    alert('Gagal menyimpan perubahan')
  }
}
</script>

<style scoped>
.form-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: box-shadow 0.2s;
}
.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px black;
}
.btn-black {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}
.btn-black:hover {
  background-color: #1f2937;
}
</style>
