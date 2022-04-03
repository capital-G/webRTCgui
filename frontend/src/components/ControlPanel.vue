<template>
  <v-container>
    <h2>Controller Panel</h2>
    <div v-for="controller in controllers" :key="controller.name">
      <controller-item
        v-bind:name="controller['name']"
        v-bind:min="controller.specMinVal"
        v-bind:max="controller.specMaxVal"
      />
    </div>
  </v-container>
</template>

<script>
import ControllerItem from './ControllerItem.vue';
export default {
  components: { ControllerItem },
  data: () => ({
    controllers: [],
  }),

  created() {
    this.$socket.on("controllers", (data) => {
      console.log("Received controller update");
      this.controllers = data;
    });

    this.$socket.emit("getState");
  }
};
</script>
