import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../communication";

class SocketIOService {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  constructor() {
    let fallback = `${document.location.protocol}//${document.location.hostname}`;
    if (document.location.hostname === "localhost")
      fallback = `${fallback}:3000`;
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT || fallback);
  }
}

export const socket = new SocketIOService().socket;
