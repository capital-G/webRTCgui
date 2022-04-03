import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { io } from 'socket.io-client';

/*
Checks wether vue app and socketio server are on the same service
*/
var socketAddress = process.env.VUE_APP_BACKEND_ADDRESS || "0"

if(parseInt(socketAddress)==0) {
    console.log("Socket server runs on same service as frontend");
    socketAddress = location.protocol + "//" + location.hostname + ":" + location.port;
} else {
    console.log("Socket server runs on different service");
}

console.log("Use socket address " + socketAddress);

loadFonts();

const socket = io(socketAddress);

const app = createApp(App);
app.use(vuetify);
app.config.globalProperties.$socket = socket;
app.mount('#app')
