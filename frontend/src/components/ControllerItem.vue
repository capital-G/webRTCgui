<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <div class="text-caption">{{ name }}</div>
          <v-slider
            v-model="value"
            color="orange"
            label="color"
            v-bind:min="this.min"
            v-bind:max="this.max"
            thumb-label
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
  },

  data: () => ({
    automaticUpdate: false,
    value: 50,
  }),

  created() {
    this.$socket.on("changeController_"+this.name, (data) => {
      this.automaticUpdate = true;
      this.value = data['value'];
    });

    this.$socket.emit("getStateController", {name: this.name});
  },

  watch: {
    value(newValue) {
      if (!this.automaticUpdate) {
        this.$socket.emit("changeController", {
          name: this.name,
          value: newValue
        });
      }
      // we release the lock after this check again
      // because this call is async
      this.automaticUpdate = false;
    },
  },
};
</script>
