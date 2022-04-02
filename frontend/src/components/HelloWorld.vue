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
      <li v-for="slider in sliders" v-bind:key="slider.id">
          <div class="text-caption">Value slider {{ slider }}</div>
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
    sliders: [],
  }),

  created() {
    this.$socket.on("slider change", (data) => {
      console.log(data);
      this.slider1 = data;
    });

    this.$socket.on("sliders", (data) => {
      console.log("Received new slider");
      this.sliders = data;
    });

    this.$socket.emit("getState");
  },

  watch: {
    slider1(newSlider, oldSlider) {
      console.log("touched : " + this.touched + " Slider moved from " + oldSlider + " to " + newSlider);
      if(this.touched) {
        this.$socket.emit("changeSlider", newSlider);
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
