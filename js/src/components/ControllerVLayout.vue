<script setup lang="ts">
import type { PropType } from "@vue/runtime-core";
import type { VLayoutController } from "../communication";
import ControllerSwitch from "./ControllerSwitch.vue";

const props = defineProps({
  controller: { type: Object as PropType<VLayoutController>, required: true }
});
</script>

<template>
  <v-container>
    <div v-for="c in props.controller.controllers" :key="c.id">
      <ControllerSwitch :controller="c" />
    </div>
  </v-container>
</template>
