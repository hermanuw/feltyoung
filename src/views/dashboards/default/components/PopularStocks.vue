<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from '@/axios';
import { ChevronUpIcon, ChevronDownIcon, ChevronRightIcon, DotsIcon } from 'vue-tabler-icons';

const topProducts = ref([]);
const selectedPeriod = ref('today');

const periods = {
  today: 'Today',
  month: 'This Month',
  year: 'This Year'
};

async function fetchTopProducts() {
  try {
    const res = await axios.get(`/products/top-sellers/period?period=${selectedPeriod.value}`);
    topProducts.value = res.data || [];
  } catch (err) {
    console.error('Failed to fetch top sellers:', err);
  }
}

onMounted(fetchTopProducts);
watch(selectedPeriod, fetchTopProducts);
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">Popular Stocks</h4>
          <div class="ml-auto">
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" size="small" icon rounded="sm" variant="text" v-bind="props">
                  <DotsIcon stroke-width="1.5" width="25" />
                </v-btn>
              </template>
              <v-sheet rounded="md" width="150" class="elevation-10">
                <v-list>
                  <v-list-item v-for="(label, key) in periods" :key="key" @click="selectedPeriod = key">
                    <v-list-item-title :class="{ 'font-weight-bold text-primary': selectedPeriod === key }">
                      {{ label }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
          </div>
        </div>

        <v-card class="bg-lightsecondary mt-5">
          <div class="pa-5">
            <div class="d-flex align-start justify-space-between">
              <div>
                <h6 class="text-secondary text-h5">
                  {{ topProducts[0]?.name || '—' }}
                </h6>
                <span class="text-subtitle-2 text-medium-emphasis font-weight-bold"> {{ topProducts[0]?.total_sold || 0 }} Sold </span>
              </div>
              <h4 class="text-h4">{{ topProducts[0]?.total_sold || 0 }} Sold</h4>
            </div>
          </div>
        </v-card>

        <div class="mt-4">
          <perfect-scrollbar :style="{ height: '270px' }">
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(item, i) in topProducts" :key="i" color="secondary" rounded="sm">
                <template v-slot:append>
                  <div
                    :class="[
                      'rounded-sm d-flex align-center justify-center ml-3',
                      item.total_sold > 10 ? 'bg-lightsuccess' : 'bg-lighterror'
                    ]"
                    style="width: 20px; height: 20px"
                  >
                    <component
                      :is="item.total_sold > 10 ? ChevronUpIcon : ChevronDownIcon"
                      stroke-width="1.5"
                      width="20"
                      :class="item.total_sold > 10 ? 'text-success' : 'text-error'"
                    />
                  </div>
                </template>
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <h6 class="text-subtitle-1 font-weight-bold">{{ item.name }}</h6>
                    <span :class="item.total_sold > 10 ? 'text-success' : 'text-error'"> {{ item.total_sold }} Sold </span>
                  </div>
                  <div class="ml-auto text-subtitle-1 text-medium-emphasis font-weight-bold">{{ item.total_sold }} Sold</div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text">
              View All
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>
