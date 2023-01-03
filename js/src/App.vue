<template>
  <v-app>
    <v-main>
      <ControllerBase />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ControllerBase from "./components/ControllerBase.vue";
@Options({
  components: {
    ControllerBase
  }
})
export default class App extends Vue {
}
</script>
