import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { io } from 'socket.io-client';

loadFonts()

const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
socket.emit('changeSlider', 'Hello there from Vue.');

const app = createApp(App);
app.use(vuetify);
app.config.globalProperties.$socket = socket;
app.mount('#app')
