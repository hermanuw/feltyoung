<template>
  <section
    class="relative w-full h-100 md:h-screen bg-center bg-cover"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Overlay hitam -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Konten -->
    <div
      class="relative z-10 flex items-center justify-center h-full px-6 lg:ml-100 text-center text-black"
    >
      <div class="w-screen max-w-3xl content-wrapper" :class="{ 'animate-in': isVisible }">
        <h1
          class="text-2xl md:text-6xl lg:text-8xl font-extrabold uppercase leading-tight drop-shadow-lg lg:ml-10"
          style="position: absolute; left: 150px; top: 50%; transform: translateY(-50%)"
        >
          own the hype.<br />
          no limits.
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import bgImage from '@/assets/bg_2.png'

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>
<style scoped>
.content-wrapper {
  transform: translateY(80px);
  opacity: 0;
  transition: all 1s ease-out;
}

.content-wrapper.animate-in {
  transform: translateY(0);
  opacity: 1;
}

@media (max-width: 768px) {
  section {
    background-size: contain; /* Menyesuaikan ukuran gambar agar terlihat sepenuhnya */
    background-position: center center; /* Memastikan gambar tetap terpusat */
    background-repeat: no-repeat; /* Menghindari pengulangan gambar */
  }
}
</style>
