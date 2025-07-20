<template>
  <div class="min-h-screen flex flex-col relative font-poppins">
    <!-- Header -->
    <PageHeader />

    <!-- Main Content -->
    <main class="flex-grow pt-20 md:pt-24">
      <transition name="fade">
        <router-view :key="$route.fullPath" />
      </transition>
    </main>

    <!-- Footer -->
    <PageFooter />
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'
import PageFooter from './PageFooter.vue'

export default {
  components: {
    PageHeader,
    PageFooter,
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins');
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
