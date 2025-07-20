<template>
  <section class="py-10 px-4 md:px-10 lg:px-15 bg-white relative">
    <h2 class="text-2xl font-bold mb-6">Discover Limited Sneakers</h2>

    <!-- Tombol navigasi -->
    <button
      class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-20 hover:scale-110 transition"
      @click="scrollLeft"
    >
      <CaPreviousFilled class="w-6 h-6 text-black" />
    </button>
    <button
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-20 hover:scale-110 transition"
      @click="scrollRight"
    >
      <CaNextFilled class="w-6 h-6 text-black" />
    </button>

    <!-- Slider -->
    <div
      ref="carousel"
      class="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
    >
      <div
        v-for="(product, index) in products"
        :key="index"
        class="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg p-4 snap-center transition-transform hover:scale-105 duration-300 flex flex-col justify-between h-[350px]"
      >
        <!-- Gambar -->
        <div
          class="aspect-[4/3] w-full flex items-center justify-center bg-white rounded-lg overflow-hidden mb-4"
        >
          <img
            :src="product.image_url"
            :alt="product.name"
            class="max-h-full max-w-full object-contain bg-white"
          />
        </div>

        <!-- Info produk -->
        <div class="flex flex-col justify-between flex-grow">
          <h3 class="text-lg font-semibold leading-snug break-words mb-1 line-clamp-3 min-h-[4rem]">
            {{ product.name }}
          </h3>
          <p class="text-md text-gray-500 mb-1">{{ product.category }}</p>
          <p class="text-md font-bold text-gray-800">{{ formatPrice(product.price) }}</p>
          <router-link
            :to="`/products/id/${product.product_id}`"
            class="mt-3 inline-block bg-black text-white text-center py-2 rounded hover:bg-gray-800 transition"
          >
            Lihat Produk
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CaPreviousFilled, CaNextFilled } from '@kalimahapps/vue-icons'
import axios from '@/axios'

const products = ref([])

async function fetchProducts() {
  try {
    const res = await axios.get('/products/top-sellers')
    products.value = res.data
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

function scrollLeft() {
  const carousel = document.querySelector('.carousel')
  carousel.scrollBy({ left: -300, behavior: 'smooth' })
}

function scrollRight() {
  const carousel = document.querySelector('.carousel')
  carousel.scrollBy({ left: 300, behavior: 'smooth' })
}

onMounted(() => {
  fetchProducts()
})

function formatPrice(value) {
  const number = typeof value === 'string' ? parseFloat(value) : value
  return (
    'Rp ' +
    number.toLocaleString('id-ID', {
      maximumFractionDigits: 0,
    })
  )
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Responsif untuk mobile */
@media (max-width: 768px) {
  .carousel {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Menampilkan 2 item per baris */
    gap: 16px;
    padding-bottom: 4rem;
  }
  .carousel .product {
    width: 100%; /* Menyesuaikan ukuran produk di mobile */
  }
}
</style>
