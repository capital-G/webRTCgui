<script lang="ts" setup>
import { useSocketIO } from "../services/socketio.service";
import { Controller } from "../../../communication";
import { Ref, ref } from "vue";
import ControllerSlider from "./ControllerSlider.vue"
import ControllerButton from "./ControllerButton.vue";

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
      <controller-slider
        v-bind:controller="controller"
        v-if="controller.type==='slider'"
      />
      <controller-button
        v-bind:controller="controller"
        v-if="controller.type==='button'"
      />
    </div>
  </v-container>
</template>
