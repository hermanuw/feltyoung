<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from '@/axios';

const select = ref('This Week');
const options = ['This Week', 'This Month', 'This Year'];
const chartData = ref([]);

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price);

// Mapping query param berdasarkan pilihan
const periodMap = {
  'This Week': 'daily',
  'This Month': 'weekly',
  'This Year': 'yearly'
};

// Label X-axis akan menyesuaikan data
const xAxisLabels = computed(() => {
  const val = select.value;
  const len = chartData.value.length;

  if (val === 'This Week') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (val === 'This Month') return Array.from({ length: len }, (_, i) => `W${i + 1}`);
  if (val === 'This Year') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return [];
});

// Chart config
const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 480,
    fontFamily: 'inherit',
    foreColor: '#a1aab2'
  },
  xaxis: {
    categories: xAxisLabels.value
  },
  colors: ['#1e88e5'],
  dataLabels: { enabled: false },
  grid: { show: true },
  tooltip: { theme: 'light' },
  fill: { type: 'solid' }
}));

const lineChart = computed(() => ({
  series: [
    {
      name: 'Total Income',
      data: chartData.value
    }
  ]
}));

async function fetchGrowthData() {
  try {
    const period = periodMap[select.value];
    const res = await axios.get(`/dashboard/growth?period=${period}`);
    chartData.value = res.data.data;
  } catch (err) {
    console.error('Gagal ambil data growth:', err);
  }
}

onMounted(fetchGrowthData);
watch(select, fetchGrowthData);
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="9">
            <span class="text-subtitle-2 text-disabled font-weight-bold">Total Growth</span>
            <h3 class="text-h3 mt-1">Rp{{ formatPrice(chartData.reduce((a, b) => a + Number(b), 0)) }}</h3>
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="select"
              :items="options"
              label="Pilih Waktu"
              persistent-hint
              single-line
            />
          </v-col>
        </v-row>

        <div class="mt-4">
          <apexchart type="bar" height="480" :options="chartOptions" :series="lineChart.series" />
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>
