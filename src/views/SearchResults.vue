<template>
  <div class="max-w-screen-xl mx-auto px-8 mt-32 pb-20">
    <div class="grid grid-cols-12 gap-6">
      <!-- FILTER -->
      <div class="col-span-12 md:col-span-3">
        <ProductFilter :keyword="keyword" @apply="handleApplyFilter" />
      </div>

      <!-- PRODUK -->
      <div class="col-span-12 md:col-span-9">
        <section>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 class="text-xl font-bold capitalize">Search Result "{{ keyword }}"</h2>
            <SortBy @sort="handleSortChange" />
          </div>

          <!-- SKELETON -->
          <div
            v-if="loading"
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
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
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
              v-for="(product, index) in products"
              :key="index"
              class="bg-white rounded-lg shadow-md p-4 snap-center transition-transform hover:scale-105 duration-300 flex flex-col justify-between h-[290px]"
            >
              <div
                class="aspect-[4/3] w-full flex items-center justify-center bg-white rounded-lg overflow-hidden mb-4"
              >
                <img
                  :src="product.image_url"
                  :alt="product.name"
                  class="max-h-full max-w-full object-contain bg-white"
                />
              </div>
              <div class="flex flex-col justify-between flex-grow">
                <h3
                  class="text-md font-semibold leading-snug break-words mb-1 line-clamp-3 min-h-[5rem]"
                >
                  {{ product.name }}
                </h3>
                <p class="text-sm text-gray-500 mb-1">{{ product.category }}</p>
                <p class="text-md font-bold text-gray-800">{{ formatPrice(product.price) }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/axios'
import ProductFilter from '@/components/composables/ProductFilter.vue'
import SortBy from '@/components/composables/SortByFilter.vue'

const route = useRoute()
const keyword = ref(route.query.keyword || '')
const products = ref([])
const loading = ref(true)
const sort = ref('new')
const currentFilter = ref({ category: '', min: null, max: null, name: '' })

function formatPrice(price) {
  if (price == null || isNaN(price)) return 'Rp -'
  return 'Rp ' + Number(price).toLocaleString('id-ID', { maximumFractionDigits: 0 })
}

// Fetch produk dari search keyword awal
async function fetchSearchResult(word) {
  if (!word || word === 'undefined') {
    console.warn('Keyword kosong, tidak fetch')
    products.value = []
    loading.value = false
    return
  }

  loading.value = true
  try {
    const res = await axios.get(`/products/search?keyword=${encodeURIComponent(word)}`)
    products.value = res.data
  } catch (err) {
    console.error('Search Failed:', err)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

// Filter berdasarkan kategori/harga/keyword
async function handleApplyFilter({ category, min, max, name, sort }) {
  currentFilter.value = { category, min, max, name: name ?? currentFilter.value.name } // simpan filter terkini
  loading.value = true
  try {
    const res = await axios.get('/products/filter', {
      params: { category, min, max, name: name ?? currentFilter.value.name, sort },
    })
    products.value = res.data
  } catch (err) {
    console.error('Gagal memuat produk:', err)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

async function handleSortChange(value) {
  sort.value = value
  await handleApplyFilter({ ...currentFilter.value, sort: value })
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
