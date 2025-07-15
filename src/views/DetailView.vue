<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'
import Swal from 'sweetalert2'
import SizeChart from '@/components/composables/SizeChart.vue'
import SimilarProducts from '@/components/composables/SimilarProducts.vue'
import AuthForm from '../components/composables/AuthForm.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const product = ref({})
const variants = ref([])
const selectedSize = ref(null)
const selectedVariant = computed(() => variants.value.find((v) => v.size === selectedSize.value))

const isOutOfStock = computed(() => !selectedVariant.value || selectedVariant.value.stock <= 0)

const showAuthForm = ref(false)
const showSizeChart = ref(false)
const open1 = ref(false)
const open2 = ref(false)
const maxHeight1 = ref('0px')
const maxHeight2 = ref('0px')
const content1 = ref(null)
const content2 = ref(null)
const loading = ref(true)
const error = ref(null)

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

function showOutOfStock() {
  Swal.fire({
    icon: 'error',
    title: 'Out of Stock',
    text: 'This size is currently out of stock.',
  })
}

const handleLoginSuccess = () => {
  showAuthForm.value = false
  window.location.reload()
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price)

onMounted(async () => {
  try {
    const { id } = route.params
    const res = await axios.get(`/products/id/${id}`)
    product.value = res.data
    variants.value = res.data.variants || []
    if (variants.value.length > 0) {
      selectedSize.value = variants.value[0].size
    }
  } catch (err) {
    error.value = 'Produk tidak ditemukan.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

function selectSize(size) {
  selectedSize.value = size
}

const handleBuyNow = () => {
  if (!auth.accessToken) {
    Swal.fire({
      title: 'Login Required',
      text: 'You need to login to purchase this product.',
      icon: 'warning',
      confirmButtonText: 'Login',
    }).then((result) => {
      if (result.isConfirmed) {
        showAuthForm.value = true
      }
    })
    return
  }

  if (!selectedVariant.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Choose Size First!',
    })
    return
  }

  if (selectedVariant.value.stock <= 0) {
    showOutOfStock()
    return
  }

  router.push({
    path: '/checkout',
    query: {
      productId: product.value.product_id,
      size: selectedSize.value,
    },
  })
}

async function addToCart() {
  if (!auth.accessToken) {
    Swal.fire({
      title: 'Login Required',
      text: 'You need to login to add this product to your cart.',
      icon: 'warning',
      confirmButtonText: 'Login',
    }).then((result) => {
      if (result.isConfirmed) {
        showAuthForm.value = true
      }
    })
    return
  }

  if (!selectedVariant.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih ukuran terlebih dahulu!',
    })
    return
  }

  if (selectedVariant.value.stock <= 0) {
    showOutOfStock()
    return
  }

  try {
    await axios.post('/cart', {
      variant_id: selectedVariant.value.variant_id,
      quantity: 1,
    })

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      showConfirmButton: false,
      timer: 1200,
    })
  } catch (err) {
    console.error('Gagal tambah ke cart:', err)
    Swal.fire({
      icon: 'error',
      title: 'Gagal menambahkan ke cart.',
      text: err.response?.data?.message || 'Terjadi kesalahan.',
    })
  }
}
</script>

<template>
  <section class="max-w-7xl mx-auto p-4 pt-30 pb-20">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-else class="flex flex-col lg:flex-row gap-6">
      <div
        class="flex-1 border border-gray-200 rounded-lg overflow-hidden max-h-[500px] flex items-center justify-center"
      >
        <img :src="product.image_url" class="rounded-xl max-w-md object-contain mx-auto mb-4" />
      </div>

      <div class="flex-1 space-y-4">
        <h1 class="text-3xl font-bold">{{ product.name }}</h1>
        <p class="text-xl font-semibold text-black">Rp {{ formatPrice(product.price) }}</p>
        <p class="text-gray-700 text-sm">{{ product.description }}</p>

        <div class="mb-6">
          <div class="flex justify-between items-center mb-2 w-full">
            <span class="text-sm font-semibold">Select Size</span>
            <span
              class="text-sm hover:underline font-medium text-black/50 cursor-pointer"
              @click="showSizeChart = true"
            >
              Size Chart
            </span>
            <SizeChart
              v-model:show="showSizeChart"
              :brand="product.brand"
              :category="product.category"
            />
          </div>

          <div id="sizesGrid" class="grid grid-cols-3 gap-1">
            <div
              v-for="variant in variants"
              :key="variant.variant_id"
              :class="[
                'border rounded-md text-center py-2 text-sm font-medium cursor-pointer hover:border-black',
                variant.stock <= 0
                  ? 'border-0 cursor-not-allowed bg-black/10 opacity-50 hover:border-gray-300'
                  : '',
                selectedSize === variant.size ? 'border-black bg-gray-200' : '',
              ]"
              @click="variant.stock > 0 && selectSize(variant.size)"
            >
              {{ variant.size }}
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="isOutOfStock ? showOutOfStock() : handleBuyNow()"
            :disabled="isOutOfStock"
            :class="[
              'px-6 py-2 rounded text-center flex items-center justify-center',
              isOutOfStock
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-black text-white cursor-pointer',
            ]"
          >
            Buy Now
          </button>

          <transition name="slide-down">
            <div
              v-if="showAuthForm"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            >
              <div
                class="relative w-[768px] max-w-full rounded-xl shadow-2xl overflow-hidden z-[999]"
              >
                <button
                  class="absolute top-3 right-4 text-gray-400 hover:text-black text-3xl font-bold z-[999]"
                  @click="showAuthForm = false"
                  aria-label="Close"
                >
                  ×
                </button>
                <AuthForm @close="showAuthForm = false" @login-success="handleLoginSuccess" />
              </div>
            </div>
          </transition>

          <button
            class="border p-3 rounded"
            :disabled="isOutOfStock"
            :class="[
              isOutOfStock ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'cursor-pointer',
            ]"
            @click="isOutOfStock ? showOutOfStock() : addToCart()"
          >
            <span>Add To Cart</span>
          </button>
        </div>
        <!-- Accordion tambahan setelah tombol Buy Now dan Add To Cart -->
        <div>
          <div v-for="index in [1, 2]" :key="index" class="accordion-section mt-4">
            <button class="text-blue-500 hover:text-blue-700" @click="toggleAccordion(index)">
              <span v-if="index === 1">Exchange Size Warranty</span>
              <span v-if="index === 2">Authentic. Trusted. Best Price</span>
            </button>
            <div
              :ref="`content${index}`"
              class="accordion-content overflow-hidden transition-all"
              :style="{ maxHeight: index === 1 ? maxHeight1 : maxHeight2 }"
            >
              <p v-if="index === 1">
                If you get the wrong size, at our Shoe Shop we have a service Size Exchange
                Guarantee with terms and conditions apply. For more information, contact our admin.
              </p>
              <p v-if="index === 2">
                We guarantee the authenticity of every product we sell. Our products are sourced
                from trusted suppliers and undergo strict quality checks. Shop with confidence
                knowing you are getting the best price for genuine products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SimilarProducts :productName="product.name" />
  </section>
</template>

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
  max-height: 500px;
}
</style>
