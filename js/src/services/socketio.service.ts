import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../communication";

export const useSocketIO = () => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.VUE_APP_SOCKET_ENDPOINT || "http://localhost:3000");
  return {
    socket
  };
};
