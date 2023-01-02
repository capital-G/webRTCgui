import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { socket } from "./socketio.service";
import type { Controller, HLayoutController } from "@/communication";

export const useControllerStore = defineStore("controllers", () => {
  // responsible for the dom
  const controller: Ref<Controller> = ref({} as HLayoutController);
  // this is a flat store because we have nested elements but it is
  // nasty to search for the component in a nested tree, therefore
  // we keep a copy of data storages here
  const dataControllers: Ref<{ [id: string]: Controller }> = ref({});

  socket.on("updateController", (controller) => {
    console.log("received change controller", controller);
    // const c = controllers.value[controller.id];
    // c.value = controller.value;
  });

  const addController = (newController: Controller) => {
    if (newController.type === "h-layout" || newController.type === "v-layout") {
      newController.controllers.forEach((controller) => {
        addController(controller);
      });
    }
    dataControllers.value[newController.id] = newController;
  };

  const setController = (newController: Controller) => {
    console.log(newController);
  };

  socket.on("setLayout", (newController) => {
    console.log("received", newController);
    dataControllers.value = {};
    controller.value = {} as HLayoutController;
    controller.value = newController;
    addController(newController);
  });

  // get layout on start of store/app
  socket.emit("getLayout");

  return { controller, dataControllers, setController };
});
