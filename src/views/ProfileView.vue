<template>
  <div class="max-w-3xl mx-auto py-10 px-4 pt-30">
    <h2 class="text-2xl font-bold mb-6">Manage Profile</h2>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg p-6 space-y-5">
      <!-- Nama dan Telepon -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Full Name</label>
          <input v-model="form.name" class="form-input" type="text" maxlength="100" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone Number</label>
          <input v-model="form.phone_number" class="form-input" type="text" maxlength="20" />
        </div>
      </div>

      <!-- Password -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Current Password</label>
          <input v-model="form.current_password" class="form-input" type="password" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">New Password</label>
          <input v-model="form.new_password" class="form-input" type="password" maxlength="100" />
        </div>
      </div>

      <!-- Alamat -->
      <div>
        <label class="block text-sm font-medium mb-1">Address</label>
        <textarea v-model="form.address" class="form-input h-24" maxlength="255"></textarea>
      </div>

      <button class="btn-black w-full">Save Changes</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axiosInstance from '@/axios'
import Swal from 'sweetalert2'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  phone_number: '',
  current_password: '',
  new_password: '',
  address: '',
  email: '',
})

onMounted(async () => {
  if (!auth.accessToken) {
    router.push('/')
    return
  }

  try {
    const res = await axiosInstance.get('/profile')
    Object.assign(form.value, res.data)
  } catch (err) {
    console.error('Gagal load profil:', err)
  }
})

async function handleSubmit() {
  // Manual length validation
  if (form.value.name.length > 100) {
    Swal.fire('Too Long', 'Full name must be max 100 characters.', 'error')
    return
  }
  if (form.value.phone_number.length > 20) {
    Swal.fire('Too Long', 'Phone number must be max 20 characters.', 'error')
    return
  }
  if (form.value.address.length > 255) {
    Swal.fire('Too Long', 'Address must be max 255 characters.', 'error')
    return
  }
  if (
    form.value.new_password &&
    (form.value.new_password.length < 6 || form.value.new_password.length > 100)
  ) {
    Swal.fire('Invalid Password', 'New password must be between 6 and 100 characters.', 'error')
    return
  }

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

    Swal.fire('Success', 'Your profile has been updated.', 'success')
    form.value.current_password = ''
    form.value.new_password = ''
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'Failed to save changes.', 'error')
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
