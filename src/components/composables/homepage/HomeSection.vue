<template>
  <section class="bg-cover relative h-screen" :style="{ backgroundImage: `url(${bgImage})` }">
    <div class="absolute inset-0 bg-black opacity-25"></div>
    <div
      class="relative flex items-center justify-center h-full text-black text-center px-4 pl-150"
    >
      <div class="w-full md:w-w-3/5 content-wrapper" :class="{ 'animate-in': isVisible }">
        <h1 class="text-5xl md:text-8xl font-extrabold uppercase leading-tight">
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

<style>
.content-wrapper {
  transform: translateY(80px);
  opacity: 0;
  transition: all 1s ease-out;
}

.content-wrapper.animate-in {
  transform: translateY(0);
  opacity: 1;
}
</style>
