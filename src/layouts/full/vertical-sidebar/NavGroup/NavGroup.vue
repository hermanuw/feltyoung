<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  item: Object
});

const { item } = toRefs(props);
</script>

<template>
  <v-list-subheader color="darkText" class="smallCap">{{ item.header }}</v-list-subheader>
</template>
