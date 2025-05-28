<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Header -->
    <PageHeader />

    <!-- Main Content -->
    <main class="flex-grow">
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
