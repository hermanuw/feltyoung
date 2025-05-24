

<template>
  <HomeSection />
  <HomeCarousel />
  <BrandGrid />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter} from 'vue-router';
import HomeSection from '@/components/composables/homepage/HomeSection.vue';
import HomeCarousel from '@/components/composables/homepage/HomeCarousel.vue';
import BrandGrid from '@/components/composables/homepage/BrandGrid.vue';
const router = useRouter();

</script>

