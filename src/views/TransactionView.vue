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
        <div
          v-for="item in order.items"
          :key="item.product_id"
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
        </div>

        <div class="text-right pt-3 mt-3 relative">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-lg font-semibold">Rp {{ formatPrice(order.total_amount) }}</p>
          <button
            class="absolute right-30 bottom-1 font-medium text-sm text-blue-500 hover:underline cursor-pointer"
            @click="openModal(order)"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal Detail Transaksi -->
  <Transition name="fade">
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden flex">
        <!-- Kiri: Isi scrollable -->
        <div class="w-full p-6 overflow-y-auto max-h-[90vh]">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">Detail Transaksi</h3>
            <button
              class="text-gray-400 text-xl hover:bg-gray-100 rounded cursor-pointer"
              @click="selectedOrder = null"
            >
              ✕
            </button>
          </div>

          <!-- Status -->
          <p class="text-sm font-semibold text-green-600 mb-2">
            {{ selectedOrder.status === 'done' ? 'Pesanan Selesai' : 'Pesanan Diproses' }}
          </p>

          <!-- Info Umum -->
          <div class="mb-4 flex justify-between items-start">
            <!-- Info kiri -->
            <div>
              <p class="text-sm text-gray-600">
                <span class="font-medium">No. Pesanan:</span> {{ selectedOrder.order_id }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Tanggal Pembelian:</span>
                {{ formatDate(selectedOrder.order_date) }}
              </p>
            </div>

            <!-- Tombol kanan -->
            <a
              :href="`https://wa.me/6289614307299`"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-[#6b4c3b] text-white rounded-md hover:bg-[#5a3f30] transition"
            >
              Chat Penjual
            </a>
          </div>

          <!-- Info Pengiriman -->
          <div class="mb-4">
            <h4 class="text-sm font-bold mb-2">Info Pengiriman</h4>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Nama:</span> {{ selectedOrder.recipient_name }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Alamat:</span>
              {{ selectedOrder.shipping_address }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Phone Number:</span>
              {{ selectedOrder.recipient_phone }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Kurir:</span> {{ selectedOrder.courier || 'Standard' }}
            </p>
          </div>

          <!-- Daftar Produk -->
          <div>
            <h4 class="text-sm font-bold mb-2">Detail Produk</h4>
            <div
              v-for="item in selectedOrder.items"
              :key="item.product_id"
              class="flex items-start gap-4 py-4"
            >
              <img :src="item.image_url" class="w-20 h-20 object-contain" />
              <div class="flex-1">
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold text-sm">Rp {{ formatPrice(item.price) }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-6 text-right">
            <p class="text-sm text-gray-500">Total Belanja</p>
            <p class="text-2xl font-bold">Rp {{ formatPrice(selectedOrder.total_amount) }}</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const orders = ref([])
const loading = ref(true)
const selectedOrder = ref(null)

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

function openModal(order) {
  selectedOrder.value = order
}

onMounted(fetchOrders)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
