<template>
  <v-app>
    <v-main>
      <ControlPanel/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ControlPanel from './components/ControlPanel.vue';

@Options({
  components: {
    ControlPanel,
  },
})
export default class App extends Vue { 
}
</script>
