<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useControllerStore } from "../services/store.service";
import ControllerSwitch from "./ControllerSwitch.vue";

const controllerStore = useControllerStore();
const { controller } = storeToRefs(controllerStore);
</script>

<template>
  <v-container>
    <div>
      <ControllerSwitch :controller="controller" />
    </div>
  </v-container>
</template>
