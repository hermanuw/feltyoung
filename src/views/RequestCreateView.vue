<template>
  <div
    class="max-w-lg mx-auto mt-30 mb-20 p-6 rounded-xl shadow bg-contain"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Header dan Tombol Navigasi -->
    <div class="flex items-center mb-2">
      <!-- Tombol Back -->
      <router-link to="/product/request/me" class="cursor-pointer px-4 py-2 transition">
        <IoOutlineArrowBack />
      </router-link>

      <!-- Judul Request a Product -->
      <h1 class="text-xl font-semibold text-gray-800 ml-2">Request a Product</h1>
    </div>

    <!-- Form Request Product -->
    <form @submit.prevent="submitRequest" class="space-y-4 bg-white p-4 mb-8">
      <!-- Nama Sepatu -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Sepatu</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Contoh: Nike Air Jordan 1"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Brand -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
        <input
          v-model="form.brand"
          type="text"
          placeholder="Contoh: Nike, Adidas"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Ukuran -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ukuran</label>
        <input
          v-model="form.size"
          type="text"
          placeholder="Contoh: 42, 9 US"
          class="w-full px-4 py-2 border rounded-md focus:ring"
        />
      </div>

      <!-- Gambar Sepatu -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Sepatu</label>
        <label
          for="file-upload"
          class="cursor-pointer border bg-white text-black px-4 py-1 text-xs rounded hover:bg-gray-100 transition"
        >
          Choose File
        </label>
        <input id="file-upload" type="file" @change="handleImageUpload" class="hidden" />
        <div class="flex items-center justify-between w-full">
          <!-- Tampilkan nama file jika sudah di-upload -->
          <span v-if="imageFile" class="text-sm text-gray-700 mr-2">{{ imageFile.name }}</span>
          <span v-else class="text-sm text-gray-500">No file chosen</span>

          <!-- Tombol Delete (tempat sampah) -->
          <button
            v-if="imageFile"
            @click="deleteImage"
            class="text-red-500 hover:text-red-700 transition cursor-pointer"
          >
            <BsTrash />
          </button>
        </div>
        <!-- Pesan error jika file bukan gambar -->
        <p v-if="imageError" class="text-red-500 text-xs mt-1">
          Only image files (jpg, jpeg, png, gif, avif) are allowed.
        </p>
      </div>

      <!-- Tombol Kirim -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-[#5C4033] text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
      >
        {{ loading ? 'Mengirim...' : 'Kirim Permintaan' }}
      </button>

      <!-- Pesan -->
      <p
        v-if="message"
        :class="[
          'text-center font-medium mt-4',
          messageType === 'success' ? 'text-green-600' : 'text-red-600',
        ]"
      >
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/axios'
import { BsTrash } from '@kalimahapps/vue-icons'
import { IoOutlineArrowBack } from '@kalimahapps/vue-icons'
import bgImage from '@/assets/shoe-bg.png'

const form = ref({
  name: '',
  brand: '',
  size: '',
})

const imageFile = ref(null)
const imageError = ref(false) // Untuk menampilkan pesan error jika file bukan gambar

const loading = ref(false)
const message = ref('')
const messageType = ref('success')

const submitRequest = async () => {
  message.value = ''
  loading.value = true

  try {
    const token = localStorage.getItem('accessToken')
    const formData = new FormData()

    // Append the fields
    formData.append('name', form.value.name)
    formData.append('brand', form.value.brand)
    formData.append('size', form.value.size)

    // Append the file if it exists
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    } else {
      console.log('No image file selected')
    }

    // Send the form data to the backend
    await axios.post('/products/request', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    message.value = 'Request berhasil dikirim!'
    messageType.value = 'success'
    form.value = { name: '', brand: '', size: '' }
    imageFile.value = null
  } catch (err) {
    console.error('Error response from backend:', err.response) // Log the error response from backend
    message.value = err.response?.data?.message || 'Gagal mengirim permintaan.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/avif']

  if (file) {
    // Periksa apakah file adalah gambar dengan MIME type yang valid
    if (validImageTypes.includes(file.type)) {
      imageFile.value = file
      imageError.value = false // Reset error
    } else {
      imageFile.value = null // Reset jika bukan gambar
      imageError.value = true // Set error
    }
  }
}

const deleteImage = () => {
  imageFile.value = null
  imageError.value = false
}
</script>
