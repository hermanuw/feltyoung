<template>
  <div
    class="max-w-lg mx-auto mt-30 mb-20 p-6 rounded-xl shadow bg-contain"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Header dan Tombol Navigasi -->
    <div class="flex items-center mb-2">
      <router-link to="/product/request/me" class="cursor-pointer px-4 py-2 transition">
        <IoOutlineArrowBack />
      </router-link>
      <h1 class="text-xl font-semibold text-gray-800 ml-2">Request a Product</h1>
    </div>

    <!-- Form Request Product -->
    <form @submit.prevent="submitRequest" class="space-y-4 bg-white p-4 mb-8">
      <!-- Nama Sepatu -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Example: Nike Air Jordan 1"
          maxlength="100"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Brand -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
        <input
          v-model="form.brand"
          type="text"
          placeholder="Example: Nike, Adidas"
          maxlength="100"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Ukuran -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Size</label>
        <input
          v-model="form.size"
          type="text"
          placeholder="Example: 42, 9 US"
          maxlength="20"
          class="w-full px-4 py-2 border rounded-md focus:ring"
        />
      </div>

      <!-- Quantity -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          v-model.number="form.quantity"
          type="number"
          min="1"
          max="100"
          placeholder="Example: 1"
          class="w-full px-4 py-2 border rounded-md focus:ring"
        />
      </div>

      <!-- Gambar Sepatu -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
        <label
          for="file-upload"
          class="cursor-pointer border bg-white text-black px-4 py-1 text-xs rounded hover:bg-gray-100 transition"
        >
          Choose File
        </label>
        <input id="file-upload" type="file" @change="handleImageUpload" class="hidden" />
        <div class="flex items-center justify-between w-full">
          <span v-if="imageFile" class="text-sm text-gray-700 mr-2">{{ imageFile.name }}</span>
          <span v-else class="text-sm text-gray-500">No file chosen</span>

          <button
            v-if="imageFile"
            @click="deleteImage"
            class="text-red-500 hover:text-red-700 transition cursor-pointer"
          >
            <BsTrash />
          </button>
        </div>
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
        {{ loading ? 'Processing...' : 'Send Request' }}
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
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { BsTrash } from '@kalimahapps/vue-icons'
import { IoOutlineArrowBack } from '@kalimahapps/vue-icons'
import bgImage from '@/assets/shoe-bg.png'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  brand: '',
  size: '',
  quantity: '',
})

const imageFile = ref(null)
const imageError = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('success')

const submitRequest = async () => {
  message.value = ''
  loading.value = true

  // Validasi panjang input
  if (form.value.name.length > 100) {
    message.value = 'Name Too long (maximum 100 characters)'
    messageType.value = 'error'
    loading.value = false
    return
  }
  if (form.value.brand.length > 100) {
    message.value = 'Brand Too long (maximum 100 characters)'
    messageType.value = 'error'
    loading.value = false
    return
  }
  if (form.value.size.length > 20) {
    message.value = 'Size Too long (maximum 20 characters)'
    messageType.value = 'error'
    loading.value = false
    return
  }
  if (form.value.quantity < 1 || form.value.quantity > 100) {
    message.value = 'Quantity must be between 1 and 100'
    messageType.value = 'error'
    loading.value = false
    return
  }

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('brand', form.value.brand)
    formData.append('size', form.value.size)
    formData.append('quantity', form.value.quantity)

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    await axios.post('/products/request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    message.value = 'Success! Request has been sent successfully.'
    messageType.value = 'success'
    form.value = { name: '', brand: '', size: '', quantity: 1 }
    imageFile.value = null
  } catch (err) {
    console.error('Error response from backend:', err.response)
    message.value = err.response?.data?.message || 'Failed to send request. Please try again later.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/avif']

  if (file) {
    if (validImageTypes.includes(file.type)) {
      imageFile.value = file
      imageError.value = false
    } else {
      imageFile.value = null
      imageError.value = true
    }
  }
}

const deleteImage = () => {
  imageFile.value = null
  imageError.value = false
}

onMounted(() => {
  if (!auth.accessToken) {
    router.push('/')
  }
})
</script>
