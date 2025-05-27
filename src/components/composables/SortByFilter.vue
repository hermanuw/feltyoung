<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100 transition"
    >
      <p class="text-sm font-medium">
        Sort: <span class="font-semibold">{{ currentLabel }}</span>
      </p>
      <i class="fa fa-angle-up text-sm" />
    </button>

    <div v-if="show" class="absolute right-0 mt-2 z-50 bg-white border rounded shadow-md w-48">
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectSort(option)"
        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        :class="{ 'font-bold': option.value === selected }"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['sort'])

const selected = ref('new')
const show = ref(false)

const options = [
  { value: 'new', label: 'Newly Added' },
  { value: 'low', label: 'Price: Low to High' },
  { value: 'high', label: 'Price: High to Low' },
]

const currentLabel = computed(() => {
  return options.find((opt) => opt.value === selected.value)?.label || 'Newly Added'
})

function toggleDropdown() {
  show.value = !show.value
}

function selectSort(option) {
  selected.value = option.value
  show.value = false
  emit('sort', selected.value)
}
</script>
