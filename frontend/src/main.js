import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { io } from 'socket.io-client';

const socketAddress = process.env.VUE_APP_BACKEND_ADDRESS || location.protocol + "//" + location.hostname + ":3000";

loadFonts();

const socket = io(socketAddress);
socket.emit('changeSlider', 'Hello there from Vue.');

const app = createApp(App);
app.use(vuetify);
app.config.globalProperties.$socket = socket;
app.mount('#app')
