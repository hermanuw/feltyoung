<script setup>
import { shallowRef } from 'vue';
import sidebarItems from './sidebarItem';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import Logo from '../logo/LogoMain.vue';

const sidebarMenu = shallowRef(sidebarItems);
</script>

<template>
  <v-navigation-drawer>
    <div class="pa-4 d-flex align-center justify-center">
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
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
