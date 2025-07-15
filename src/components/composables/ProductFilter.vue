<template>
  <div class="space-y-6">
    <!-- Category Filter -->
    <div>
      <p class="font-bold text-lg mb-2">Category</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in categories"
          :key="option"
          @click="selectCategory(option)"
          :class="[
            'px-4 py-3 rounded-full text-sm font-semibold border transition',
            category === option
              ? 'bg-black text-white'
              : 'bg-white text-black border-gray-300 hover:bg-gray-100',
          ]"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div>
      <p class="font-bold text-md mb-2">Price Range (IDR)</p>
      <div class="space-y-2">
        <input
          type="number"
          v-model.number="minPrice"
          placeholder="Minimum"
          class="w-55 p-2 border rounded"
          @keydown.enter="apply"
        />
        <input
          type="number"
          v-model.number="maxPrice"
          placeholder="Maximum"
          class="w-55 p-2 border rounded"
          @keydown.enter="apply"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 pt-2 mr-15">
      <button
        @click="resetFilter"
        class="flex-1 py-2 rounded-full border text-sm hover:bg-gray-100 cursor-pointer"
      >
        Clear
      </button>
      <button
        @click="apply"
        class="flex-1 py-2 bg-black text-white rounded-full text-sm hover:opacity-90 cursor-pointer"
      >
        Apply
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['apply'])

const categories = ['Men', 'Women', 'Kids']
const category = ref('')
const minPrice = ref(null)
const maxPrice = ref(null)
const props = defineProps({ keyword: String })

function selectCategory(cat) {
  category.value = cat === category.value ? '' : cat
  apply()
}

function resetFilter() {
  category.value = ''
  minPrice.value = null
  maxPrice.value = null
  emit('apply', {
    category: '',
    min: null,
    max: null,
    name: props.keyword || '',
  })
}

function apply() {
  emit('apply', {
    category: category.value.toLowerCase(),
    min: minPrice.value,
    max: maxPrice.value,
    name: props.keyword || '',
  })
}
</script>
