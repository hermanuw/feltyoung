<template>
  <section class="py-10 px-4 xl:px-10 max-w-screen-xl mx-auto">
    <h2 class="text-xl font-bold mb-6 capitalize pt-30">Search Result: "{{ keyword }}"</h2>

    <div v-if="loading" class="text-center">Loading...</div>

    <div v-else-if="products.length === 0" class="text-center text-gray-500">
      Tidak ada produk ditemukan.
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 px-4 max-w-screen-xl mx-auto"
    >
      <div
        v-for="(product, index) in products"
        :key="index"
        class="bg-white rounded-lg shadow-lg p-4 snap-center transition-transform hover:scale-105 duration-300 flex flex-col justify-between h-[330px]"
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
          <h3 class="text-lg font-semibold leading-snug break-words mb-1 line-clamp-3 min-h-[5rem]">
            {{ product.name }}
          </h3>
          <p class="text-md text-gray-500 mb-1">{{ product.category }}</p>
          <p class="text-md font-bold text-gray-800">
            {{ formatPrice(product.price) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/axios'

const route = useRoute()
const keyword = ref(route.query.keyword || '')
const products = ref([])
const loading = ref(true)

function formatPrice(price) {
  if (price == null || isNaN(price)) return 'Rp -'
  return 'Rp ' + Number(price).toLocaleString('id-ID', { maximumFractionDigits: 0 })
}

async function fetchSearchResult(word) {
  if (!word || word === 'undefined') {
    console.warn('Keyword kosong, tidak fetch')
    products.value = []
    loading.value = false
    return
  }

  console.log('Mencari produk dengan keyword:', word)
  loading.value = true
  try {
    const res = await axios.get(`/products/search?keyword=${encodeURIComponent(word)}`)
    products.value = res.data
    console.log('Produk ditemukan:', res.data)
  } catch (err) {
    console.error('Search Failed:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSearchResult(keyword.value)
})

watch(
  () => route.query.keyword,
  (newKeyword) => {
    keyword.value = newKeyword
    fetchSearchResult(newKeyword)
  },
)
</script>
