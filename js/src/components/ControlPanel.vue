<script lang="ts" setup>
import type { Ref } from "vue";
import { ref } from "vue";
import { useSocketIO } from "../services/socketio.service";
import type { Controller } from "../communication";
import ControllerSlider from "./ControllerSlider.vue";
import ControllerButton from "./ControllerButton.vue";
import ControllerText from "./ControllerText.vue";

const controllers: Ref<{ [id: string]: Controller }> = ref({});

const { socket } = useSocketIO();

socket.on("controllers", (newControllers) => {
  console.log("received", newControllers);
  controllers.value = newControllers;
});

socket.emit("getState");
</script>

<template>
  <v-container>
    <h2>Controller Panel</h2>
    <div v-for="controller in controllers" :key="controller.name">
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
