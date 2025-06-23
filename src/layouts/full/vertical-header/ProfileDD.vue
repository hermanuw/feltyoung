<script setup>
import { ref } from 'vue';
import { SettingsIcon, LogoutIcon, UserIcon, SearchIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/stores/auth';

const swt1 = ref(true);
const swt2 = ref(false);
const authStore = useAuthStore();
</script>

<template>
  <!-- Profile Dropdown -->
  <div class="pa-4">
    <h4 class="mb-n1">Good Morning, <span class="font-weight-regular">Admin</span></h4>
    <span class="text-subtitle-2 text-medium-emphasis">Feltyoung Admin</span>

    <v-divider />

    <perfect-scrollbar style="height: calc(60vh - 300px)">
      <v-divider />

      <!-- Profile Links -->
      <v-list class="mt-3">
        <v-list-item color="secondary" rounded="md">
          <template v-slot:prepend>
            <SettingsIcon size="20" class="mr-2" />
          </template>
          <v-list-item-title class="text-subtitle-2">Account Settings</v-list-item-title>
        </v-list-item>

        <v-list-item @click="authStore.logout()" color="secondary" rounded="md">
          <template v-slot:prepend>
            <LogoutIcon size="20" class="mr-2" />
          </template>
          <v-list-item-title class="text-subtitle-2">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>
