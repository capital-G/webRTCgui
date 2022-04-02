<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <div class="text-caption">Value 1 slider</div>
          <v-slider v-model="slider1" @mousedown="this.touched=true" @mouseup="this.touched=false" @change="updateToServer" color="orange" label="color"></v-slider>
        </div>
      </v-col>
    </v-row>
    <ul id="example-1">
      <h3>Automated values</h3>
      <li v-for="controller in controllers" v-bind:key="controller.name">
          <div class="text-caption">Controller {{ controller.name }}</div>
          <v-slider v-model="slider1" @mousedown="this.touched=true" @mouseup="this.touched=false" @change="updateToServer" color="orange" label="color"></v-slider>
      </li>
    </ul>
  </v-container>
</template>

<script>

export default {
  name: 'HelloWorld',
  // touched: false,

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

  watch: {
    slider1(newSlider, oldSlider) {
      console.log("touched : " + this.touched + " Slider moved from " + oldSlider + " to " + newSlider);
      if(this.touched) {
        this.$socket.emit("changeController", newSlider);
      }
    }
  },

  methods: {
    updateToServer() {
      console.log("Should update server with " + this.slider1);
    }
  }


}

</script>
