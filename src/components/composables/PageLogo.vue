<template>
  <router-link to="/">
    <h1 class="uppercase text-xl md:text-2xl font-extrabold cursor-pointer select-none tracking-wide transition-colors duration-300">
      <span :class="carClass">Feltyoung</span>
      <span :class="kicksClass">.kicks</span>
    </h1>
  </router-link>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// State untuk scroll
const isScrolled = ref(false)

// Event handler scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Pasang event listener waktu komponen mount
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Dynamic class untuk logo
const carClass = computed(() =>
  isScrolled.value ? 'text-black transition-colors duration-300' : 'text-white transition-colors duration-300'
)
const kicksClass = computed(() =>
  isScrolled.value ? 'text-[#5C4033] transition-colors duration-300' : 'text-[#5C4033] transition-colors duration-300'
)
</script>
