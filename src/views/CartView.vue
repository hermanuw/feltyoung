<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // <-- Import Pinia store
import axios from '@/axios'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore() // <-- Gunakan auth store untuk akses token
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
        Authorization: `Bearer ${authStore.accessToken}`, // <-- Ambil token dari Pinia
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
          Authorization: `Bearer ${authStore.accessToken}`, // <-- Ambil token dari Pinia
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
        Authorization: `Bearer ${authStore.accessToken}`, // <-- Ambil token dari Pinia
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
  if (!authStore.accessToken) {
    router.push('/') // redirect if not logged in
  } else {
    fetchCart()
  }
})
</script>
