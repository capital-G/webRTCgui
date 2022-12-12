<script lang="ts" setup>
import { Ref, computed, ref } from "vue";
import { useControllerStore } from "../services/store.service";
import ControllerSlider from "./ControllerSlider.vue";
import ControllerButton from "./ControllerButton.vue";
import ControllerText from "./ControllerText.vue";

const controllerStore = useControllerStore();
const controllersValue = computed(() => controllerStore.controllers);
</script>

<template>
  <v-container>
    <h2>Controller Panel</h2>
    <div v-for="controller in controllersValue" :key="controller.name">
      <ControllerSlider
        v-if="controller.type === 'slider'"
        :controller="controller"
      />
      <ControllerButton
        v-if="controller.type === 'button'"
        :controller="controller"
      />
      <ControllerText
        v-if="controller.type === 'text'"
        :controller="controller"
      />
    </div>
  </v-container>
</template>
