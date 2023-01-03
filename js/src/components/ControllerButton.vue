<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { defineProps, ref } from "vue";
import { storeToRefs } from "pinia";
import { socket } from "../services/socketio.service";
import type { ButtonController } from "../communication";
import { toCssColor } from "../helper";
import { useControllerStore } from "../services/store.service";

const props = defineProps({
  controller: { type: Object as PropType<ButtonController>, required: true }
});

const controllerStore = useControllerStore();
const { dataControllers } = storeToRefs(controllerStore);
const dataController = dataControllers.value[props.controller.id] as ButtonController;

async function buttonPress() {
  dataController.value = (dataController.value + 1) % dataController.states.length;
  socket.emit("updateController", dataController);
}
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <v-btn
            :color="toCssColor(dataController.states[dataController.value].backgroundColor)"
            @click="buttonPress()"
          >
            {{ dataController.states[controller.value].text }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
