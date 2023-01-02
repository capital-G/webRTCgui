<script lang="ts" setup>
import type { PropType } from "vue";
import { computed } from "vue";
import type { Controller } from "../communication";
import ControllerSlider from "./ControllerSlider.vue";
import ControllerButton from "./ControllerButton.vue";
import ControllerText from "./ControllerText.vue";
import ControllerVLayout from "./ControllerVLayout.vue";
import ControllerHLayout from "./ControllerHLayout.vue";
import ControllerTabLayout from "./ControllerTabLayout.vue";

const props = defineProps({
  controller: { type: Object as PropType<Controller>, required: true }
});

const controllerData = computed(() => props.controller);
</script>

<template>
  <v-container>
    <ControllerSlider
      v-if="props.controller.type === 'slider'"
      :controller="props.controller"
    />
    <ControllerButton
      v-if="props.controller.type === 'button'"
      :controller="props.controller"
    />
    <ControllerText
      v-if="props.controller.type === 'text'"
      :controller="props.controller"
    />
    <ControllerVLayout
      v-if="props.controller.type === 'v-layout'"
      :controller="props.controller"
    />
    <ControllerTabLayout
      v-if="props.controller.type === 'tab-layout'"
      :controller="props.controller"
    />
  </v-container>
</template>
