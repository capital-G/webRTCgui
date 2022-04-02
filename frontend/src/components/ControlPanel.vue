<template>
  <v-container>
    <h2>Controller Panel</h2>
    <div v-for="controller in controllers" :key="controller.name">
      <controller-item
        v-bind:name="controller['name']"
        v-bind:min=0
        v-bind:max=1
        abc="meine welt"
      />
    </div>
  </v-container>
</template>

<script>
import ControllerItem from './ControllerItem.vue';
export default {
  components: { ControllerItem },
  data: () => ({
    slider1: 50,
    touched: false,
    controllers: [],
  }),

  created() {
    this.$socket.on("controllerChange", (data) => {
      console.log(data);
      this.slider1 = data;
    });

    this.$socket.on("controllers", (data) => {
      console.log("Received controller update");
      this.controllers = data;
    });

    this.$socket.emit("getState");
  },

  methods: {
    updateToServer() {
      console.log("Should update server with " + this.slider1);
    },
  },
};
</script>
