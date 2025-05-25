<template>
  <section class="py-10 container-layout">
    <h2 class="text-xl font-bold mb-6 capitalize pt-30">Produk dari {{ category }}</h2>

    <div v-if="loading" class="text-center">Loading...</div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-4 snap-center transition-transform hover:scale-105 duration-300 flex flex-col justify-between h-[370px]"
      >
        <!-- Gambar -->
        <div class="aspect-[4/3] w-full flex items-center justify-center bg-white rounded-lg overflow-hidden mb-4">
          <img
            :src="product.image_url"
            :alt="product.name"
            class="max-h-full max-w-full object-contain bg-white"
          />
        </div>

        <!-- Info produk -->
        <div class="flex flex-col justify-between flex-grow">
          <h3 class="text-lg font-semibold leading-snug break-words mb-1 line-clamp-2 min-h-[3rem]">
            {{ product.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-1">{{ product.category }}</p>
          <p class="text-md font-bold text-gray-800">
            {{ formatPrice(product.price) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/axios';

const route = useRoute();
const category = route.params.category;

const products = ref([]);
const loading = ref(true);

// Format harga ke "Rp 1.500.000"
function formatPrice(price) {
  if (price == null || isNaN(price)) return 'Rp -';
  return 'Rp ' + Number(price).toLocaleString('id-ID', {
    maximumFractionDigits: 0,
  });
}

onMounted(async () => {
  try {
    const res = await axios.get(`/products/${category}`);
    products.value = res.data;
  } catch (err) {
    console.error('Failed to fetch products by brand:', err);
  } finally {
    loading.value = false;
  }
});
</script>
