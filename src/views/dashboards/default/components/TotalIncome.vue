<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { TableIcon, BuildingStoreIcon } from 'vue-tabler-icons';

const verifiedUsers = ref(0);
const unverifiedUsers = ref(0);

onMounted(async () => {
  try {
    const res = await axios.get('/dashboard/users');
    verifiedUsers.value = res.data.verified || 0;
    unverifiedUsers.value = res.data.unverified || 0;
  } catch (err) {
    console.error('Failed to fetch user stats:', err);
  }
});
</script>

<template>
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape-sm bubble-primary mb-6">
    <v-card-text class="pa-5">
      <div class="d-flex align-center ga-4">
        <v-btn color="darkprimary" icon rounded="sm" variant="flat">
          <TableIcon stroke-width="1.5" width="25" />
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{ verifiedUsers }}</h4>
          <span class="text-subtitle-2 text-medium-emphasis text-white">Verified Users</span>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
    <v-card-text class="pa-5">
      <div class="d-flex align-center ga-4">
        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
          <BuildingStoreIcon stroke-width="1.5" width="25" class="text-warning" />
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{ unverifiedUsers }}</h4>
          <span class="text-subtitle-2 text-disabled font-weight-medium">Unverified Users</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
