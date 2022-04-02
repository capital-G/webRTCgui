<template>
  <v-app>
    <v-main>
      <ControlPanel/>
    </v-main>
  </v-app>
</template>

<script>
import ControlPanel from './components/ControlPanel.vue'

export default {
  name: 'App',

  components: {
    ControlPanel,
  },
}
</script>
