import type { Server } from "http";
import { createServer } from "http";
import type { Express } from "express";
import express from "express";
import { Server as SocketServer } from "socket.io";
import type { ClientToServerEvents, Controller, HLayoutController, ServerToClientEvents } from "./communication";

export class SuperColliderWebRtcServer {
  app: Express;
  // eslint-disable-next-line n/no-path-concat
  path = `${__dirname}/../dist/`;
  http: Server;
  io: SocketServer<ClientToServerEvents, ServerToClientEvents>;
  authToken = process.env.BACKEND_AUTH_TOKEN || null;

  controller: Controller;

  constructor() {
    this.app = express();
    this.app.use(express.static(this.path));

    this.http = createServer(this.app);

    this.io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(this.http, {
      cors: {
        origin: [
          "http://localhost:3001",
          "http://localhost:4200",
          "http://localhost:8080",
          "http://client"
        ]
      }
    });

    if (this.authToken)
      console.log(`Using auth token: "${this.authToken}"`);
    else
      console.log("Run without auth token");

    this.controller = {} as HLayoutController;

    this.setupApp();
    this.setupSocket();
  }

  setupApp() {
    this.app.get("/", (req, res) => {
      res.sendFile(`${this.path}index.html`);
    });

    this.app.get("/live", (req, res) => {
      res.sendStatus(200);
    });
  }

  setupSocket() {
    this.io.on("connection", (socket) => {
      const token = socket.handshake.auth.token;
      let auth = true;

      if (this.authToken) {
        if (this.authToken !== token) {
          auth = false;
          if (this.authToken != null && token != null)
            console.log(`WARNING! Got wrong authentication for ${socket}`);
        }
        else {
          console.log("Client with proper credentials connected");
        }
      }

      socket.on("getLayout", () => {
        console.log("update state to new client");
        socket.emit("setLayout", this.controller);
      });

      socket.on("updateController", (controller) => {
        socket.broadcast.emit("updateController", controller);
      });

      socket.on("setLayout", (controller) => {
        console.log(controller);
        if (!auth) {
          console.log("WARNING - Got unathorized set layout statement");
          return;
        }
        this.controller = controller;
        socket.broadcast.emit("setLayout", this.controller);
      });
    });
  }
}

const server = new SuperColliderWebRtcServer();

server.http.listen(3000, "0.0.0.0", () => {
  console.log("listening on 0.0.0.0:3000");
});
