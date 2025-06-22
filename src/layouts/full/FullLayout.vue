<script setup>
import { RouterView } from 'vue-router';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import FooterPanel from './footer/FooterPanel.vue';
import { SettingsIcon } from 'vue-tabler-icons';
</script>

<template>
  <v-locale-provider>
    <v-app theme="PurpleTheme"
      >>
      <VerticalSidebarVue />
      <VerticalHeaderVue />

      <v-main>
        <v-container fluid class="page-wrapper">
          <RouterView />

          <SettingsIcon class="icon" />
        </v-container>
        <v-container fluid class="pt-0">
          <FooterPanel />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
