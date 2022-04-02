import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    this.socket.emit('changeSlider', 'Hello there from Vue.');

    this.socket.on('slider change', (data) => {
      alert("FOO");
      console.log(data);
    });

    return this.socket;
  }


  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
     }
    }
}

export default new SocketioService();
