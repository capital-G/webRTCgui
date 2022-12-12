import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../communication";

export const useSocketIO = () => {
  let fallback = `${document.location.protocol}//${document.location.hostname}`;
  if (document.location.hostname === "localhost")
    fallback = `${fallback}:3000`;
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.VUE_APP_SOCKET_ENDPOINT || fallback);
  return {
    socket
  };
};
