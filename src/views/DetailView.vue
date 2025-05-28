<template>
  <section class="max-w-7xl mx-auto p-4 pt-30 pb-30">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-4 ml-3">
      <ol class="flex space-x-1">
        <li><router-link to="/" class="hover:underline">Home</router-link> /</li>
        <li>
          <router-link :to="`/brand/${product.brand}`" class="hover:underline">
            {{ product.brand }}
          </router-link>
          /
        </li>
        <li class="text-black">{{ product.name }}</li>
      </ol>
    </nav>

    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else class="flex flex-col lg:flex-row gap-6">
      <!-- Gambar -->
      <div
        class="flex-1 border border-gray-200 rounded-lg overflow-hidden max-h-[500px] flex items-center justify-center"
      >
        <img :src="product.image_url" class="rounded-xl max-w-md object-contain mx-auto mb-4" />
      </div>

      <!-- Detail -->
      <div class="flex-1 space-y-4">
        <h1 class="text-3xl font-bold">{{ product.name }}</h1>
        <p class="text-xl font-semibold text-black">Rp {{ formatPrice(product.price) }}</p>

        <p class="text-gray-700 text-sm">{{ product.description }}</p>
        <p class="text-sm text-gray-400">Category : {{ product.category }}</p>
        <!-- Select Size (compact) -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2 w-full">
            <span class="text-sm font-semibold">Select Size</span>
            <span
              class="text-sm hover:underline font-medium text-black/50 cursor-pointer ml-120"
              @click="showSizeChart = true"
            >
              Size Chart
            </span>
            <!-- Komponen Modal -->
            <SizeChart
              v-model:show="showSizeChart"
              :brand="product.brand"
              :category="product.category"
            />
          </div>
          <div id="sizesGrid" class="grid grid-cols-3 gap-1">
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 6
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 6.5
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 7
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium cursor-not-allowed bg-black/10 opacity-50"
            >
              UK 7.5
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium cursor-not-allowed bg-black/10 opacity-50"
            >
              UK 8
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 8.5
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 9
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 9.5
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 10
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium hover:border-black cursor-pointer"
            >
              UK 10.5
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium cursor-not-allowed bg-black/10 opacity-50"
            >
              UK 11
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium cursor-not-allowed bg-black/10 opacity-50"
            >
              UK 11.5
            </div>
            <div
              class="border rounded-md text-center py-2 text-sm font-medium cursor-not-allowed bg-black/10 opacity-50"
            >
              UK 12
            </div>
          </div>
        </div>
        <!-- Tombol -->
        <div class="flex gap-2">
          <button class="bg-black text-white px-6 py-2 rounded">Buy Now</button>
          <button class="border p-3 rounded"><span>Add To Cart</span></button>
        </div>

        <!-- Accordion FAQ -->
        <div class="mt-8 space-y-4">
          <!-- Accordion 1 -->
          <div class="border border-gray-200 rounded-md">
            <button
              @click="toggleAccordion(1)"
              class="w-full flex justify-between items-center p-3 text-left"
            >
              <h6 class="font-semibold text-xs">Exchange Size Warranty</h6>
              <span class="text-sm">{{ open1 ? '−' : '+' }}</span>
            </button>

            <transition name="accordion">
              <div
                v-if="open1"
                ref="content1"
                class="px-4 pb-4 text-sm text-gray-700 overflow-hidden"
                :style="{ maxHeight: maxHeight1 }"
              >
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </div>
            </transition>
          </div>

          <!-- Accordion 2 -->
          <div class="border border-gray-200 rounded-md">
            <button
              @click="toggleAccordion(2)"
              class="w-full flex justify-between items-center p-3 text-left"
            >
              <h6 class="font-semibold text-xs">Authentic. Trusted. Best Price.</h6>
              <span class="text-sm">{{ open2 ? '−' : '+' }}</span>
            </button>

            <transition name="accordion">
              <div
                v-if="open2"
                ref="content2"
                class="px-4 pb-4 text-sm text-gray-700 overflow-hidden"
                :style="{ maxHeight: maxHeight2 }"
              >
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <SimilarProducts :productName="product.name" />
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/axios'
import SizeChart from '@/components/composables/SizeChart.vue'
import SimilarProducts from '@/components/composables/SimilarProducts.vue'

const route = useRoute()
const product = ref({})
const loading = ref(true)
const error = ref(null)

// Accordion state
const open1 = ref(false)
const open2 = ref(false)
const maxHeight1 = ref('0px')
const maxHeight2 = ref('0px')
const content1 = ref(null)
const content2 = ref(null)
const showSizeChart = ref(false)

function toggleAccordion(index) {
  if (index === 1) {
    open1.value = !open1.value
    nextTick(() => {
      maxHeight1.value = open1.value ? content1.value.scrollHeight + 'px' : '0px'
    })
  }
  if (index === 2) {
    open2.value = !open2.value
    nextTick(() => {
      maxHeight2.value = open2.value ? content2.value.scrollHeight + 'px' : '0px'
    })
  }
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price)

onMounted(async () => {
  try {
    const { id } = route.params
    const res = await axios.get(`/products/id/${id}`)
    product.value = res.data
  } catch (err) {
    error.value = 'Produk tidak ditemukan.'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition:
    all 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px; /* Atur sesuai kebutuhan */
}
</style>
