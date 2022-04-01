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
  </v-container>
</template>

<script>

export default {
  name: 'HelloWorld',
  // touched: false,

  data: () => ({
    slider1: 50,
    touched: false,
  }),

  created() {
    this.$socket.on("slider change", (data) => {
      console.log(data);
      this.slider1 = data;
    });
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
