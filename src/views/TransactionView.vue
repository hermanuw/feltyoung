<template>
  <section class="max-w-6xl mx-auto px-4 py-10 pt-30">
    <h2 class="text-xl font-bold mb-6">Daftar Transaksi</h2>

    <div v-if="loading" class="text-center text-gray-500">Memuat data...</div>
    <div v-else-if="orders.length === 0" class="text-center text-gray-400">
      Belum ada transaksi.
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.order_id"
        class="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-xs text-gray-600 mb-3">ID Transaksi: {{ order.order_id }}</p>
            <p class="text-sm text-black font-semibold">
              Tanggal: {{ formatDate(order.order_date) }}
            </p>
          </div>
          <span class="text-xs px-3 py-1 rounded-full" :class="statusClass(order.status)">
            {{ order.status }}
          </span>
        </div>

        <!-- Produk -->
        <router-link
          v-for="item in order.items"
          :key="item.product_id"
          :to="`/orders/${order.order_id}`"
          class="flex gap-6 mb-3 bg-white p-2 rounded-md transition"
        >
          <img
            :src="item.image_url || '/images/no-image.png'"
            class="w-28 h-28 object-contain"
            alt="Product image"
          />
          <div class="flex-1">
            <p class="text-md font-semibold">{{ item.name }}</p>
            <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold">Rp {{ formatPrice(item.price) }}</p>
          </div>
        </router-link>

        <div class="text-right pt-3 mt-3">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-lg font-semibold">Rp {{ formatPrice(order.total_amount) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const orders = ref([])
const loading = ref(true)

const fetchOrders = async () => {
  try {
    const res = await axios.get('/orders')
    orders.value = res.data
  } catch (err) {
    console.error('Gagal mengambil data transaksi:', err)
  } finally {
    loading.value = false
  }
}
const formatDate = (str) =>
  new Date(str).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price)

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'done':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(fetchOrders)
</script>
