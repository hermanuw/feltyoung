<template>
  <router-link to="/">
    <h1
      class="uppercase text-xl md:text-2xl font-extrabold cursor-pointer select-none tracking-wide transition-colors duration-300"
    >
      <span :class="feltyoungClass">Feltyoung</span>
      <span :class="kicksClass">.kicks</span>
    </h1>
  </router-link>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)

// Scroll handler hanya aktif di halaman '/'
const handleScroll = () => {
  if (route.path !== '/') {
    isScrolled.value = true // force hitam di halaman lain
    return
  }
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // jalankan langsung saat pertama
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Dynamic class
const feltyoungClass = computed(() =>
  route.path !== '/'
    ? 'text-black transition-colors duration-300'
    : isScrolled.value
      ? 'text-black transition-colors duration-300'
      : 'text-white transition-colors duration-300',
)

const kicksClass = computed(() => 'text-[#5C4033] transition-colors duration-300')
</script>
