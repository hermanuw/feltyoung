<script setup>
import { toRefs } from 'vue';

// props manual untuk JavaScript
const props = defineProps({
  item: Object,
  level: Number
});

const { item, level } = toRefs(props);
</script>

<template>
  <template v-if="level > 0">
    <component :is="item" size="5" fill="currentColor" stroke-width="1.5" class="iconClass"></component>
  </template>
  <template v-else>
    <component :is="item" size="20" stroke-width="1.5" class="iconClass"></component>
  </template>
</template>
