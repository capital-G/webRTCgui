import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const port = 3000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
      console.log("User disconnected");
  });

  socket.on("changeSlider", (msg) => {
      console.log("Received slider change: " + msg);
      socket.broadcast.emit('slider change', msg);
  });
});

io.emit("hello from server");

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
