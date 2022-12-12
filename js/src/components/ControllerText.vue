<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { defineProps, ref } from "vue";
import { useSocketIO } from "../services/socketio.service";
import type { TextController } from "../communication";
import { useControllerStore } from "../services/store.service";

const props = defineProps({
  controller: { type: Object as PropType<TextController>, required: true }
});

const { socket } = useSocketIO();

const controllerStore = useControllerStore();
const controller = controllerStore.controllers[props.controller.name];

async function updateText() {
  socket.emit("changeController", controller);
}
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div :class="{ monospace: props.controller.monospace }">
          <div class="text-caption">
            {{ $props.controller.name }}
          </div>
          <v-textarea
            v-model="controller.value"
            color="orange"
            @change="updateText()"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .monospace {
    font-family: monospace;
  }
</style>
