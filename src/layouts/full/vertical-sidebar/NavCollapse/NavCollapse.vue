<script setup>
import { toRefs } from 'vue';
import NavItem from '../NavItem/NavItem.vue';
import Icon from '../IconSet.vue';

const props = defineProps({
  item: Object,
  level: Number
});

const { item, level } = toRefs(props);
</script>

<template>
  <!-- Group Container -->
  <v-list-group no-action>
    <!-- Activator -->
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" :value="item.title" rounded class="mb-1" color="secondary">
        <!-- Icon -->
        <template v-slot:prepend>
          <Icon :item="item.icon" :level="level" />
        </template>
        <!-- Title -->
        <v-list-item-title class="mr-auto">{{ item.title }}</v-list-item-title>
        <!-- Optional Caption -->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>

    <!-- Recursive Submenu -->
    <template v-for="(subitem, i) in item.children" :key="i">
      <NavCollapse :item="subitem" v-if="subitem.children" :level="level + 1" />
      <NavItem :item="subitem" :level="level + 1" v-else />
    </template>
  </v-list-group>
</template>
