<template>
  <div class=" bg-[#fcfcfc] text-black container-layout py-8 md:px-16 pt-30">
    <h1 class="text-3xl font-bold mb-6">Your Cart</h1>

    <div v-if="cartItems.length > 0" class="space-y-6">
      <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 border-b pb-4">
        <img :src="item.image" class="w-24 h-24 object-cover rounded-lg" />
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ item.name }}</h2>
          <p class="text-sm text-gray-500">Rp {{ formatPrice(item.price) }}</p>
          <div class="flex items-center gap-2 mt-2">
            <button @click="decreaseQty(item)" class="px-2 py-1 border border-black rounded">
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQty(item)" class="px-2 py-1 border border-black rounded">
              +
            </button>
          </div>
        </div>
        <button @click="removeItem(item.id)" class="text-red-600 hover:underline">Remove</button>
      </div>

      <div class="text-right mt-8">
        <p class="text-xl font-semibold mb-2 pb-6">Total: Rp {{ formatPrice(totalAmount) }}</p>
        <router-link
          to="/checkout"
          class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Checkout
        </router-link>
      </div>
    </div>

    <div v-else class="text-center mt-20 text-gray-500">
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cartItems = ref([
  {
    id: 'p1',
    name: 'Nike Air Max 270',
    price: 1450000,
    quantity: 1,
    image:
      'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/AIR+MAX+270.png',
  },
  {
    id: 'p2',
    name: 'Adidas Forum Low',
    price: 1250000,
    quantity: 2,
    image: 'https://www.adidas.co.id/media/catalog/product/f/y/fy7756_sl_ecom.jpg',
  },
  {
    id: 'p3',
    name: 'Adidas Forum Low1',
    price: 1250000,
    quantity: 2,
    image:
      'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/105/MTA-180440779/br-m036969-14158_sepatu-sneakers-adidas-forum-low-cl-ih7830-20242_full01-6e1f3e45.jpg',
  },
])

const totalAmount = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
)

function increaseQty(item) {
  item.quantity++
}

function decreaseQty(item) {
  if (item.quantity > 1) item.quantity--
}

function removeItem(id) {
  cartItems.value = cartItems.value.filter((item) => item.id !== id)
}

function formatPrice(price) {
  return price.toLocaleString('id-ID')
}
</script>
