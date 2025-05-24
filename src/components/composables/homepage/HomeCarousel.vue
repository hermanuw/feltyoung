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
        class="flex-shrink-0 w-64 bg-gray-100 rounded-xl shadow-md p-4 snap-center transition-transform hover:scale-105 duration-300"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h3 class="text-lg font-semibold truncate">{{ product.name }}</h3>
        <p class="text-sm text-gray-500 mb-1">{{ product.category }}</p>
        <p class="text-md font-bold text-gray-800">{{ formatPrice(product.price) }}</p>
        <button class="mt-3 w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
          Lihat Produk
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { CaPreviousFilled, CaNextFilled } from '@kalimahapps/vue-icons';

import shoe1 from '@/assets/shoe_1.jpg';
import shoe2 from '@/assets/shoe_2.jpg';
import shoe3 from '@/assets/shoe_3.jpg';
import shoe4 from '@/assets/shoe_4.jpg';
import shoe5 from '@/assets/shoe_5.jpg';
import shoe6 from '@/assets/shoe_6.jpg';
import shoe7 from '@/assets/shoe_7.jpg';
import shoe8 from '@/assets/shoe_8.jpg';
import shoe9 from '@/assets/shoe_9.jpg';
import shoe10 from '@/assets/shoe_10.jpg';

const products = [
  { name: 'Nike Air Max 90', category: 'Men', price: 1450000, image: shoe1 },
  { name: 'Adidas Yeezy Boost', category: 'Women', price: 2750000, image: shoe2 },
  { name: 'New Balance 550', category: 'Unisex', price: 1850000, image: shoe3 },
  { name: 'Puma RS-X', category: 'Men', price: 1350000, image: shoe4 },
  { name: 'Converse Chuck 70', category: 'Unisex', price: 950000, image: shoe5 },
  { name: 'Jordan Low Panda 1', category: 'Unisex', price: 1850000, image: shoe6 },
  { name: 'Jordan Low Panda 2', category: 'Unisex', price: 1850000, image: shoe7 },
  { name: 'Jordan Low Panda 3', category: 'Unisex', price: 1850000, image: shoe8 },
  { name: 'Jordan Low Panda 4', category: 'Unisex', price: 1850000, image: shoe9 },
  { name: 'Jordan Low Panda 5', category: 'Unisex', price: 1850000, image: shoe10 },
];

const carousel = ref(null);
let autoSlideInterval = null;

function scrollLeft() {
  carousel.value.scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight() {
  carousel.value.scrollBy({ left: 300, behavior: 'smooth' });
}

onMounted(() => {
  autoSlideInterval = setInterval(() => {
    const el = carousel.value;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    if (el.scrollLeft >= maxScrollLeft - 5) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollRight();
    }
  }, 3000);
});

onUnmounted(() => {
  clearInterval(autoSlideInterval);
});

function formatPrice(value) {
  return 'Rp ' + value.toLocaleString('id-ID');
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
</style>
