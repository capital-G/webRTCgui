<script setup lang="ts">
import type { PropType } from "@vue/runtime-core";
import { onMounted } from "@vue/runtime-core";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import type { HLayoutController } from "../communication";
import { useControllerStore } from "../services/store.service";
import ControllerSwitch from "./ControllerSwitch.vue";

const props = defineProps({
  controller: { type: Object as PropType<HLayoutController>, required: true }
});

const controllerStore = useControllerStore();
const { dataControllers } = storeToRefs(controllerStore);
const controller = ref(dataControllers.value[props.controller.id] as HLayoutController);
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="c in controller.controllers" :key="c.id">
        <ControllerSwitch :controller="c" />
      </v-col>
    </v-row>
  </v-container>
</template>
