<template>
  <div class="container mx-auto py-8 px-4 max-w-5xl pt-30">
    <!-- Judul -->
    <div class="flex items-center gap-3 mb-6">
      <p class="text-xl font-semibold">Checkout</p>
    </div>

    <!-- Alamat Pengiriman Editable -->
    <div class="bg-gray-100 rounded-lg p-4 mb-4 space-y-3">
      <div class="flex justify-between items-center">
        <p class="text-sm font-medium">Deliver to</p>
        <div class="flex gap-2 items-center">
          <button
            v-if="!isEditingShipping"
            @click="toggleEditShipping"
            class="text-blue-600 text-sm underline cursor-pointer"
          >
            Edit
          </button>
          <template v-else>
            <button
              @click="saveShippingChanges"
              class="text-green-600 text-sm underline cursor-pointer"
            >
              Save
            </button>
            <button
              @click="cancelShippingChanges"
              class="text-red-600 text-sm underline cursor-pointer"
            >
              Cancel
            </button>
          </template>
        </div>
      </div>

      <template v-if="isEditingShipping">
        <!-- FORM EDIT -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium mb-1">Recipient Name</label>
            <input
              v-model="shippingName"
              type="text"
              class="form-input border border-black rounded-md p-2"
            />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1">Phone Number</label>
            <input
              v-model="shippingPhone"
              type="text"
              class="form-input border border-black rounded-md p-2"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Shipping Address</label>
          <textarea
            v-model="shippingAddress"
            class="form-input border border-black rounded-md p-2 h-24"
          ></textarea>
        </div>
      </template>

      <template v-else>
        <!-- TAMPILAN DATA SAJA -->
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ shippingName }}</p>
          <p class="text-sm text-gray-600">Phone: {{ shippingPhone }}</p>
          <p class="text-sm text-gray-600 whitespace-pre-line mt-1">{{ shippingAddress }}</p>
        </div>
      </template>
    </div>

    <!-- Produk -->
    <div v-if="items.length > 0">
      <div
        v-for="item in items"
        :key="item.product_id"
        class="flex gap-4 bg-white shadow-sm p-4 rounded-lg mb-4"
      >
        <img
          :src="item.image_url || '/images/no-image.png'"
          class="w-24 h-24 object-contain"
          alt="Product image"
        />
        <div class="flex-1">
          <p class="font-medium">{{ item.name }}</p>
          <p class="text-sm text-gray-600">Size: {{ item.size || selectedSize }}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-gray-900">Rp {{ formatPrice(item.price) }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 my-10">Loading product information...</div>

    <!-- Ringkasan Pembayaran -->
    <div
      v-if="items.length > 0"
      class="bg-white bg-cover bg-no-repeat bg-center shadow-sm p-4 rounded-lg mb-20"
      :style="`background-image: url('${bgImage}')`"
    >
      <p class="font-medium mb-2">Payment Summary</p>
      <div class="flex justify-between text-sm mb-1">
        <p>Product Price</p>
        <p>Rp {{ formatPrice(productTotal) }}</p>
      </div>
      <div class="flex justify-between text-sm mb-1">
        <p>Authentication Fee</p>
        <p>FREE</p>
      </div>
      <div class="flex justify-between text-sm mb-1">
        <p class="flex items-center">Processing Fee</p>
        <p>Rp {{ formatPrice(processingFee) }}</p>
      </div>
      <div class="flex justify-between items-center mt-4">
        <p class="text-sm font-medium">Total</p>
        <p class="font-bold text-lg text-right">Rp {{ formatPrice(total) }}</p>
      </div>

      <button
        @click="handlePayment"
        class="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
      >
        Choose Payment
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from '@/axios'
import { ref, onMounted } from 'vue'

const route = useRoute()
const bgImage = '/images/payment-bg.jpg'
const processingFee = 73000
const productId = route.query.productId
const size = route.query.size
const fromRequest = route.query.fromRequest === 'true'
const selectedSize = route.query.size || '-'

const items = ref([]) // array agar mendukung banyak produk
const productTotal = ref(0)
const total = ref(0)
const shippingName = ref('')
const shippingPhone = ref('')
const shippingAddress = ref('')

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price)
const user = ref({
  name: '',
  phone_number: '',
  address: '',
})
onMounted(async () => {
  try {
    const profileRes = await axios.get('/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
    user.value = profileRes.data

    // Set nilai default pengiriman berdasarkan profil
    shippingName.value = user.value.name
    shippingPhone.value = user.value.phone_number
    shippingAddress.value = user.value.address

    const id = route.query.productId
    if (id) {
      // Checkout dari DetailView (1 produk)
      const res = await axios.get(`/products/id/${id}`)
      const data = res.data
      items.value = [
        {
          product_id: data.product_id,
          name: data.name,
          image_url: data.image_url,
          price: Number(data.price),
          size: selectedSize,
        },
      ]
      productTotal.value = Number(data.price)
    } else {
      // Checkout dari Cart (semua produk user)
      const res = await axios.get('/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      items.value = res.data
      productTotal.value = items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }

    total.value = productTotal.value + processingFee
  } catch (err) {
    console.error('Gagal ambil data checkout:', err)
  }
})

const isEditingShipping = ref(false)

const originalShippingData = ref({})

const toggleEditShipping = () => {
  if (!isEditingShipping.value) {
    // Backup data sebelum di-edit
    originalShippingData.value = {
      name: shippingName.value,
      phone: shippingPhone.value,
      address: shippingAddress.value,
    }
  }
  isEditingShipping.value = !isEditingShipping.value
}

const saveShippingChanges = () => {
  isEditingShipping.value = false
}

const cancelShippingChanges = () => {
  shippingName.value = originalShippingData.value.name
  shippingPhone.value = originalShippingData.value.phone
  shippingAddress.value = originalShippingData.value.address
  isEditingShipping.value = false
}

const handlePayment = async () => {
  try {
    const res = await axios.post(
      '/orders',
      {
        total_amount: total.value,
        payment_method: 'midtrans',
        shipping_address: shippingAddress.value,
        recipient_name: shippingName.value,
        recipient_phone: shippingPhone.value,
        items: items.value.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity || 1,
          price: item.price,
          size: item.size || selectedSize,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )

    // Panggil Midtrans Snap
    window.snap.pay(res.data.token, {
      onSuccess: function (result) {
        console.log('Payment success:', result)
        alert('Pembayaran berhasil!')
        window.location.href = '/' // redirect jika ingin
      },
      onPending: function (result) {
        console.log('Payment pending:', result)
        alert('Menunggu pembayaran...')
      },
      onError: function (result) {
        console.error('Payment failed:', result)
        alert('Pembayaran gagal!')
      },
      onClose: function () {
        console.log('Payment popup closed')
      },
    })
  } catch (err) {
    console.error('Gagal membuat order:', err)
    alert('Gagal membuat order')
  }
}
</script>
