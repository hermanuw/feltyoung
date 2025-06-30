<template>
  <div class="py-10 container-layout mt-30 pb-20">
    <!-- Header dan Tombol -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold capitalize">Request Products</h1>
      <router-link
        to="/product/request/create"
        class="cursor-pointer px-4 py-2 bg-[#5C4033] text-white rounded hover:bg-blue-700 transition"
      >
        Request a Product
      </router-link>
    </div>

    <!-- List Request -->
    <div v-if="requests.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      <div
        v-for="item in requests"
        :key="item.request_id"
        @click="handleCardClick(item)"
        class="border border-gray-300 rounded-lg p-4 shadow bg-white hover:shadow-md transition duration-300 cursor-pointer"
        :class="item.status === 'accepted' ? 'cursor-pointer' : 'cursor-default'"
      >
        <img
          v-if="item.image_url"
          :src="item.image_url"
          alt="request image"
          class="w-full h-28 object-contain rounded mb-3"
        />
        <h3 class="text-lg font-semibold mb-2">{{ item.name }}</h3>
        <p class="text-sm text-gray-600">Brand: {{ item.brand }}</p>
        <p class="text-sm text-gray-600 mb-2">Ukuran: {{ item.size }}</p>
        <p class="text-xs px-3 py-1 inline-block rounded-full" :class="statusClass(item.status)">
          Status: {{ item.status }}
        </p>

        <!-- Tampilkan harga jika accepted -->
        <p
          v-if="item.status === 'accepted' && item.price"
          class="text-sm font-bold text-green-700 mt-2"
        >
          ${{ item.price }}
        </p>
      </div>
    </div>

    <p v-else class="text-center text-gray-500 mt-10">Belum ada permintaan sepatu.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const requests = ref([])

const fetchRequests = async () => {
  try {
    const res = await axios.get('/products/request/me')
    requests.value = res.data
  } catch (err) {
    console.error('Gagal fetch request:', err)
  }
}

const statusClass = (status) => {
  switch (status) {
    case 'requested':
      return 'bg-yellow-100 text-yellow-800'
    case 'accepted':
      return 'bg-green-100 text-green-800'
    case 'declined':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const handleCardClick = (item) => {
  if (item.status === 'requested') {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      text: 'Your request is being processed. Please wait for further updates.',
      confirmButtonColor: '#5C4033',
    })
  } else if (item.status === 'ordered') {
    Swal.fire({
      icon: 'warning',
      title: 'Already Ordered',
      text: 'You have already ordered this product. Please wait for the order to be processed.',
      confirmButtonColor: '#5C4033',
    })
  } else if (item.status === 'accepted' && item.linked_product_id) {
    router.push({
      path: '/checkout',
      query: {
        productId: item.linked_product_id,
        size: item.size,
        fromRequest: true,
      },
    })
  }
}

onMounted(() => {
  if (!auth.accessToken) {
    router.push('/')
  } else {
    fetchRequests()
  }
})
</script>
