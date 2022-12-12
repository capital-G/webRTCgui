import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { socket } from "./socketio.service";
import type { Controller } from "@/communication";

export const useControllerStore = defineStore("controllers", () => {
  const controllers: Ref<{ [id: string]: Controller }> = ref({});

  socket.on("controllers", (newControllers) => {
    console.log("received", newControllers);
    setControllers(newControllers);
  });

  socket.on("changeController", (controller) => {
    console.log("received change controller", controller);
    const c = controllers.value[controller.name];
    c.value = controller.value;
  });

  socket.emit("getState");

  function setControllers(newControllers: { [id: string]: Controller }) {
    controllers.value = newControllers;
  }

  return { controllers, setControllers };
});
