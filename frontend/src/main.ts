import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { io } from 'socket.io-client';

/*
Checks wether vue app and socketio server are on the same service
*/
const socketHost = process.env.VUE_APP_BACKEND_HOST || "0"
const socketPort = process.env.VUE_APP_BACKEND_PORT || "0"
let socketAddress = "";

if(parseInt(socketHost)==0) {
    console.log("Socket server runs on same host as frontend");
    socketAddress = location.protocol + "//" + location.hostname;
} else {
    console.log("Socket server runs on different service");
    socketAddress = location.protocol + "//" + socketHost;
}

if(parseInt(socketPort) == 0) {
    console.log("Socket server runs on same port as frontend");
    socketAddress = socketAddress + ":" + location.port
} else {
    socketAddress = socketAddress + ":" + socketPort;
}

console.log("Use socket address " + socketAddress);

loadFonts();

const socket = io(socketAddress);

const app = createApp(App);
app.use(vuetify);
app.config.globalProperties.$socket = socket;
app.mount('#app')
