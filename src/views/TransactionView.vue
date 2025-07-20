<template>
  <section class="max-w-6xl mx-auto px-4 py-10 pt-30">
    <h2 class="text-xl font-bold mb-6">Transaction History</h2>

    <div v-if="loading" class="text-center text-gray-500">Loading data...</div>
    <div v-else-if="orders.length === 0" class="text-center text-gray-400">
      No transactions found.
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.order_id"
        class="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-xs text-gray-600 mb-3">Transaction ID : {{ order.order_id }}</p>
            <p class="text-sm text-black font-semibold">
              Transaction Date: {{ formatDate(order.order_date) }}
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
            v-if="order.status === 'pending'"
            class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition"
            @click="handlePayNow(order)"
          >
            Pay Now
          </button>
          <button
            class="absolute right-30 bottom-1 font-medium text-sm text-blue-500 hover:underline cursor-pointer"
            @click="openModal(order)"
          >
            More Details
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
            <h3 class="text-xl font-bold">Detail Transaction</h3>
            <button
              class="text-gray-400 text-xl hover:bg-gray-100 rounded cursor-pointer"
              @click="selectedOrder = null"
            >
              ✕
            </button>
          </div>

          <!-- Status -->
          <p class="text-sm font-semibold" :class="statusTextClass(selectedOrder.status)">
            {{
              selectedOrder.status === 'done'
                ? 'Order Completed'
                : selectedOrder.status === 'cancelled'
                  ? 'Order Cancelled'
                  : 'Order in Process'
            }}
          </p>

          <!-- Info Umum -->
          <div class="mb-4 flex justify-between items-start p-4">
            <!-- Info kiri -->
            <div>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Order Number:</span> {{ selectedOrder.order_id }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Order Date:</span>
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
              Contact Admin
            </a>
          </div>

          <!-- Info Pengiriman -->
          <div class="shadow-md rounded-lg p-4 mb-4">
            <h4 class="text-sm font-bold mb-2">Info Pengiriman</h4>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Name:</span> {{ selectedOrder.recipient_name }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Address:</span>
              {{ selectedOrder.shipping_address }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Phone Number:</span>
              {{ selectedOrder.recipient_phone }}
            </p>
            <p
              v-if="['shipped', 'done'].includes(selectedOrder.status)"
              class="text-sm text-gray-600"
            >
              <span class="font-medium">Tracking Number:</span>
              {{ selectedOrder.tracking_number || 'N/A' }}
            </p>
          </div>

          <!-- Daftar Produk -->
          <div class="shadow-md rounded-lg p-4 mb-4">
            <h4 class="text-sm font-bold mb-2">Product Detail</h4>
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
              <p class="font-semibold text-sm">Rp{{ formatPrice(item.price) }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-6 text-right">
            <p class="text-sm text-gray-500">Total Price</p>
            <p class="text-2xl font-bold">Rp{{ formatPrice(selectedOrder.total_amount) }}</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from '@/axios'

const router = useRouter()
const auth = useAuthStore()

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
onMounted(() => {
  if (!auth.accessToken) {
    router.push('/')
  } else {
    fetchOrders()
  }
})

const formatDate = (str) => {
  const date = new Date(str)

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return `${datePart} ${timePart}`
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price)

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'paid':
    case 'packing':
    case 'done':
      return 'bg-green-100 text-green-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const statusTextClass = (status) => {
  switch (status) {
    case 'pending':
      return ' text-yellow-800'
    case 'paid':
    case 'packing':
    case 'done':
      return ' text-green-800'
    case 'shipped':
      return ' text-blue-800'
    case 'cancelled':
      return ' text-red-800'
    default:
      return ' text-gray-800'
  }
}

function openModal(order) {
  selectedOrder.value = order
}
async function handlePayNow(order) {
  try {
    // Melakukan API call untuk mendapatkan token pembayaran dari order yang pending
    const response = await axios.get(`/orders/${order.order_id}/payment-token`)
    const token = response.data.token

    // Inisialisasi Midtrans dengan token pembayaran
    if (token) {
      snap.pay(token, {
        onSuccess: function (result) {
          console.log('Pembayaran Sukses:', result)
          // Menangani pembayaran sukses, bisa update status order
        },
        onPending: function (result) {
          console.log('Pembayaran Tertunda:', result)
          // Menangani status tertunda
        },
        onError: function (result) {
          console.log('Pembayaran Gagal:', result)
          // Menangani error pembayaran
        },
        onClose: function () {
          console.log('Pembayaran Ditutup')
          // Menangani event ketika popup ditutup
        },
      })
    } else {
      console.error('Token pembayaran tidak ditemukan!')
    }
  } catch (err) {
    console.error('Gagal mengambil token pembayaran:', err)
  }
}
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
