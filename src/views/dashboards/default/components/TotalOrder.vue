<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { ArrowDownLeftCircleIcon, ShoppingCartIcon, CircleArrowDownLeftIcon } from 'vue-tabler-icons';

const tab = ref('1');

// Total angka
const monthlyOrder = ref(0);
const yearlyOrder = ref(0);

// Chart data
const lineChart1 = ref({
  series: [{ name: 'Orders This Month', data: [0, 0, 0, 0] }]
});
const lineChart2 = ref({
  series: [{ name: 'Orders This Year', data: Array(12).fill(0) }]
});

// Label minggu & bulan
const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Chart options
const chartOptions1 = computed(() => ({
  chart: {
    type: 'bar',
    height: 90,
    fontFamily: 'inherit',
    foreColor: '#a1aab2',
    sparkline: { enabled: true }
  },
  xaxis: { categories: weekLabels },
  dataLabels: { enabled: false },
  colors: ['#fff'],
  fill: { type: 'solid', opacity: 1 },
  stroke: { curve: 'smooth', width: 3 },
  tooltip: {
    theme: 'light',
    x: { show: true },
    y: { title: { formatter: () => 'Total Orders' } }
  }
}));

const chartOptions2 = computed(() => ({
  ...chartOptions1.value,
  xaxis: { categories: monthLabels }
}));

// Fetch data
onMounted(async () => {
  try {
    const [resMonth, resYear, resChart] = await Promise.all([
      axios.get('/dashboard/orders/monthly'),
      axios.get('/dashboard/orders/yearly'),
      axios.get('/dashboard/orders/chart')
    ]);

    monthlyOrder.value = resMonth.data.count || 0;
    yearlyOrder.value = resYear.data.count || 0;

    lineChart1.value.series[0].data = resChart.data.weekly || [0, 0, 0, 0];
    lineChart2.value.series[0].data = resChart.data.monthly || Array(12).fill(0);
  } catch (err) {
    console.error('Gagal ambil data order dan chart:', err);
  }
});
</script>

<template>
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape bubble-primary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <v-btn icon rounded="sm" color="darkprimary" variant="flat">
          <ShoppingCartIcon stroke-width="1.5" width="20" />
        </v-btn>
        <div class="ml-auto z-1">
          <v-tabs v-model="tab" class="theme-tab" density="compact" align-tabs="end">
            <v-tab value="1" hide-slider color="transparent">Month</v-tab>
            <v-tab value="2" hide-slider color="transparent">Year</v-tab>
          </v-tabs>
        </div>
      </div>

      <v-tabs-window v-model="tab" class="z-1">
        <!-- Total Orders This Month -->
        <v-tabs-window-item value="1">
          <v-row>
            <v-col cols="6">
              <h2 class="text-h1 font-weight-medium">
                {{ monthlyOrder }}
                <a href="#">
                  <CircleArrowDownLeftIcon stroke-width="1.5" width="28" class="text-white" />
                </a>
              </h2>
              <span class="text-subtitle-1 text-medium-emphasis text-white">Total Orders This Month</span>
            </v-col>
            <v-col cols="6">
              <apexchart type="line" height="90" :options="chartOptions1" :series="lineChart1.series" />
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <!-- Total Orders This Year -->
        <v-tabs-window-item value="2">
          <v-row>
            <v-col cols="6">
              <h2 class="text-h1 font-weight-medium">
                {{ yearlyOrder }}
                <a href="#">
                  <ArrowDownLeftCircleIcon stroke-width="1.5" width="28" class="text-white" />
                </a>
              </h2>
              <span class="text-subtitle-1 text-medium-emphasis text-white">Total Orders This Year</span>
            </v-col>
            <v-col cols="6">
              <apexchart type="line" height="90" :options="chartOptions2" :series="lineChart2.series" />
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
