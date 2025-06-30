<template>
  <section class="py-10 container-layout mt-30">
    <!-- Header + Sort -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
      <h2 class="text-xl font-bold capitalize">All Products From {{ brandSlug }}</h2>
      <SortBy @sort="handleSortChange" />
    </div>

    <!-- SKELETON -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="n in 8"
        :key="n"
        class="animate-pulse bg-white p-4 rounded-lg shadow h-[290px] flex flex-col justify-between"
      >
        <div class="bg-gray-200 h-40 mb-4 rounded"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- TIDAK ADA PRODUK -->
    <div v-else-if="products.length === 0" class="text-center text-gray-500">
      Tidak ada produk ditemukan.
    </div>

    <!-- PRODUK -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 px-4 max-w-screen-xl mx-auto"
    >
      <div
        v-for="(product, index) in products"
        :key="index"
        class="bg-white rounded-lg shadow-lg p-4 snap-center transition-transform hover:scale-105 duration-300 flex flex-col justify-between h-[300px]"
      >
        <router-link
          class="aspect-[4/3] w-full flex items-center justify-center bg-white rounded-lg overflow-hidden mb-4"
          :to="`/products/id/${product.product_id}`"
        >
          <img
            :src="product.image_url"
            :alt="product.name"
            class="max-h-full max-w-full object-contain bg-white"
          />
        </router-link>

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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/axios'
import SortBy from '@/components/composables/SortByFilter.vue'

const route = useRoute()
const brandSlug = ref(route.params.slug || '')
const products = ref([])
const loading = ref(true)
const sort = ref('')

function formatPrice(price) {
  if (price == null || isNaN(price)) return 'Rp -'
  return 'Rp ' + Number(price).toLocaleString('id-ID', { maximumFractionDigits: 0 })
}

async function fetchBrandProducts() {
  if (!brandSlug.value) return

  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 100)) // delay render skeleton
  try {
    const res = await axios.get(`/products/brand/${brandSlug.value}`, {
      params: sort.value ? { sort: sort.value } : {},
    })
    products.value = res.data
  } catch (err) {
    console.error('Failed to fetch products by brand:', err)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 300)
  }
}

function handleSortChange(value) {
  sort.value = value
  fetchBrandProducts()
}

onMounted(fetchBrandProducts)

watch(
  () => route.params.slug,
  (newSlug) => {
    brandSlug.value = newSlug
    fetchBrandProducts()
  },
)
</script>
