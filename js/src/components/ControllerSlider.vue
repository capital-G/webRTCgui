<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { defineProps, ref, watch } from "vue";
import { socket } from "../services/socketio.service";
import type { SliderController } from "../communication";
import { useControllerStore } from "../services/store.service";

const props = defineProps({
  controller: { type: Object as PropType<SliderController>, required: true }
});

const controllerStore = useControllerStore();
const controller = controllerStore.controllers[props.controller.name];

const userInput: Ref<boolean> = ref(false);

watch(controller, (oldValue, newValue) => {
  if (userInput.value)
    socket.emit("changeController", controller);
});
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <div class="text-caption">
            {{ $props.controller.name }}
          </div>
          <v-slider
            v-model="controller.value"
            color="orange"
            :min="$props.controller.min"
            :max="$props.controller.max"
            thumb-label
            @mousedown="userInput = true"
            @mouseup="userInput = false"
            @touchstart="userInput = true"
            @touchend="userInput = false"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
