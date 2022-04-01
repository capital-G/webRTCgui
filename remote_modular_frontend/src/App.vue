<template>
  <v-app>
    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import SocketioService from './services/socketio.service.js';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  created() {
    // SocketioService.setupSocketConnection();
  },
  beforeUnmount() {
    // SocketioService.disconnect();
  },

  data: () => ({
    //
  }),
}
</script>
