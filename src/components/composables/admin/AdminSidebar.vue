<script setup>
import { shallowRef } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import sidebarItems from './sidebarItem';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import ExtraBox from './extrabox/ExtraBox.vue';
import Logo from '../logo/LogoMain.vue';

const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems);
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!-- Logo -->
    <div class="pa-5">
      <Logo />
    </div>

    <!-- Navigation -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <v-divider class="my-3" v-else-if="item.divider" />
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <NavItem :item="item" v-else class="leftPadding" />
        </template>
      </v-list>
      <div class="pa-4">
        <!-- <ExtraBox /> -->
      </div>
      <div class="pa-4 text-center">
        <v-chip color="inputBorder" size="small"> v1.3.0 </v-chip>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
