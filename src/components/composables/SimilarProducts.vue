<template>
  <div class="container mx-auto px-4 py-6">
    <h5 class="text-xl font-semibold mb-4">Similar Products</h5>
    <div class="flex flex-wrap -mx-2">
      <div
        v-for="product in similarProducts"
        :key="product.product_id"
        class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 px-2 mb-4"
      >
        <router-link
          :to="`/products/id/${product.product_id}`"
          class="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div class="h-40 flex justify-center items-center overflow-hidden p-2">
            <img
              :src="product.image_url"
              :alt="product.name"
              class="max-h-full max-w-full object-contain"
            />
          </div>
          <div class="p-3">
            <h2 class="text-sm font-semibold text-gray-800 truncate mb-1">
              {{ product.name }}
            </h2>
            <span class="text-base font-bold text-gray-900">
              Rp {{ formatPrice(product.price) }}
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from '@/axios'
const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price)
const props = defineProps({
  productName: String,
})

const similarProducts = ref([])

async function fetchSimilarProducts(name) {
  if (!name) {
    similarProducts.value = []
    return
  }
  const nameParts = name.split(' ')
  const baseName = nameParts.slice(0, 2).join(' ')

  try {
    const res = await axios.get('/products/similar', {
      params: { productName: baseName },
    })
    if (Array.isArray(res.data)) {
      // Filter produk yang nama persis sama dengan props.productName
      similarProducts.value = res.data.filter((p) => p.name !== name)
    } else {
      console.warn('Expected array but got:', res.data)
      similarProducts.value = []
    }
  } catch (error) {
    console.error('Failed to load similar products', error)
    similarProducts.value = []
  }
}

onMounted(() => {
  fetchSimilarProducts(props.productName)
})

watch(
  () => props.productName,
  (newVal) => {
    fetchSimilarProducts(newVal)
  },
)
</script>
