<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { defineProps, ref } from "vue";
import { useSocketIO } from "../services/socketio.service";
import type { ButtonController } from "../communication";
import { useControllerStore } from "../services/store.service";

const props = defineProps({
  controller: { type: Object as PropType<ButtonController>, required: true }
});

const { socket } = useSocketIO();

const controllerStore = useControllerStore();
const controller = controllerStore.controllers[props.controller.name];

async function buttonPress() {
  socket.emit("changeController", controller);
}
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <v-btn
            v-model="controller.value"
            color="orange"
            @click="buttonPress()"
          >
            {{ $props.controller.name }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
