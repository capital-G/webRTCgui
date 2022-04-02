<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <div class="text-caption">{{ name }}</div>
          <v-slider
            v-model="value"
            @mousedown="this.touched = true"
            @mouseup="this.touched = false"
            color="orange"
            label="color"
          ></v-slider>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
      "name": String,
      "min": Number,
      "max": Number,
      "abc": String,
  },

  data: () => ({
    touched: false,
    value: 50,
  }),

  created() {
    this.$socket.on("changeController_"+this.name, (data) => {
      console.log(data);
      this.value = data;
    });

    this.$socket.emit("getState");
  },

  watch: {
    value(newValue) {
      console.log(
        "touched : " +
          this.name +
          " Slider moved to " +
          newValue
      );
      if (this.touched) {
        this.$socket.emit("changeController", [this.name, newValue]);
      }
    },
  }
};
</script>
