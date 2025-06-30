<template>
  <div class="bg-[#fcfcfc] text-black container-layout py-8 md:px-16 pt-30">
    <h1 class="text-3xl font-bold mb-6">Your Cart</h1>

    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="cartItems.length === 0" class="text-center mt-20 text-gray-500">
      <p>Your cart is empty.</p>
    </div>

    <div v-else class="space-y-10">
      <div
        v-for="item in cartItems"
        :key="item.cart_id"
        class="flex items-center gap-4 border-b pb-4"
      >
        <img :src="item.image_url" class="w-24 h-24 object-contain rounded-lg" />
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ item.name }}</h2>
          <p class="text-sm text-gray-500">Size: {{ item.size }}</p>
          <p class="text-sm text-gray-500">Rp {{ formatPrice(item.price) }}</p>

          <div class="flex items-center gap-2 mt-2">
            <button
              @click="updateQty(item, item.quantity - 1)"
              :disabled="updatingItemId === item.cart_id"
              class="px-2 py-1 border border-black rounded disabled:opacity-40"
            >
              −
            </button>
            <span>{{ item.quantity }}</span>
            <button
              @click="updateQty(item, item.quantity + 1)"
              :disabled="updatingItemId === item.cart_id"
              class="px-2 py-1 border border-black rounded disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <button
          @click="removeItem(item.cart_id)"
          class="text-red-600 hover:underline cursor-pointer"
        >
          Remove
        </button>
      </div>

      <div class="text-right mt-8">
        <p class="text-xl font-semibold mb-2 pb-6">Total: Rp {{ formatPrice(totalAmount) }}</p>
        <button
          @click="checkout"
          class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import Swal from 'sweetalert2'

const router = useRouter()
const cartItems = ref([])
const loading = ref(true)
const updatingItemId = ref(null) // untuk disable tombol saat update

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)

const totalAmount = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
)

async function fetchCart() {
  try {
    const res = await axios.get('/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    cartItems.value = res.data
  } catch (err) {
    console.error('Gagal ambil cart:', err)
    Swal.fire('Error', 'Gagal memuat cart.', 'error')
  } finally {
    loading.value = false
  }
}

async function updateQty(item, newQty) {
  if (newQty < 1 || newQty > 10) {
    Swal.fire('Oops', 'Quantity hanya boleh antara 1 sampai 10', 'warning')
    return
  }

  updatingItemId.value = item.cart_id
  try {
    const res = await axios.put(
      `/cart/${item.cart_id}`,
      { quantity: newQty },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )
    item.quantity = newQty
  } catch (err) {
    const msg = err?.response?.data?.message || 'Gagal update quantity'
    Swal.fire('Error', msg, 'error')
  } finally {
    updatingItemId.value = null
  }
}

async function removeItem(cartId) {
  const confirm = await Swal.fire({
    title: 'Remove this item?',
    text: 'Are you sure you want to remove this item from your cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, remove it',
    cancelButtonText: 'Cancel',
  })

  if (!confirm.isConfirmed) return

  try {
    await axios.delete(`/cart/${cartId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    cartItems.value = cartItems.value.filter((item) => item.cart_id !== cartId)
    Swal.fire('Removed!', 'The item has been removed from your cart.', 'success')
  } catch (err) {
    console.error('Failed to remove item:', err)
    Swal.fire('Error', 'Failed to remove item from your cart.', 'error')
  }
}

onMounted(() => {
  fetchCart()
})
</script>
