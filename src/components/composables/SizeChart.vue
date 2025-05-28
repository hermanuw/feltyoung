<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <!-- Modal Container -->
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto relative p-6"
      >
        <!-- Close Button -->
        <!-- Tombol Close dengan komponen CaCloseLarge -->
        <button
          @click="close"
          class="absolute top-3 right-4 hover:text-black"
          aria-label="Close modal"
        >
          <CaCloseLarge />
        </button>

        <!-- Header -->
        <h2 class="text-center text-xl font-bold mb-4">{{ brand }} {{ category }}'s Size Chart</h2>

        <!-- Table -->
        <table class="w-full border border-gray-200 text-sm">
          <thead class="bg-gray-100 text-gray-600">
            <tr>
              <th class="py-2 px-3 text-left">US</th>
              <th class="py-2 px-3 text-left">UK</th>
              <th class="py-2 px-3 text-left">EU</th>
              <th class="py-2 px-3 text-left">CM</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sizeData" :key="index" class="even:bg-gray-50">
              <td class="py-2 px-3">{{ row.US }}</td>
              <td class="py-2 px-3">{{ row.UK || '-' }}</td>
              <td class="py-2 px-3">{{ row.EU }}</td>
              <td class="py-2 px-3">{{ row.CM }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { sizeCharts } from '@/lib/sizeChart'
import { CaCloseLarge } from '@kalimahapps/vue-icons'

const props = defineProps({
  brand: String,
  category: String,
  show: Boolean,
})

const emit = defineEmits(['update:show'])

const close = () => emit('update:show', false)

const sizeData = computed(() => {
  const brandData = sizeCharts?.[props.brand]?.[props.category] || []
  return Array.isArray(brandData[0]) ? brandData[0] : brandData
})
</script>
