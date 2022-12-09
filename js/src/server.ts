import { Express} from 'express';
import express from 'express';
import {createServer, Server} from "http";
import {Server as SocketServer} from "socket.io";
import {ServerToClientEvents, ClientToServerEvents, Controller} from "./communication";

export class SuperColliderWebRtcServer {
  app: Express;
  path = __dirname + '/frontend/dist/';
  http: Server;
  io: SocketServer<ClientToServerEvents, ServerToClientEvents>;
  authToken = process.env.BACKEND_AUTH_TOKEN || null;

  controllers: { [id: string] : Controller; }

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
          "http://client",
        ],
      },
    });

    if(this.authToken) {
      console.log(`Using auth token: "${this.authToken}"`);
    } else {
      console.log("Run without auth token");
    }

    this.controllers = {};

    this.setupApp();
    this.setupSocket();
  }

  setupApp() {
    this.app.get('/', (req, res) => {
      res.sendFile(this.path + "index.html");
    });

    this.app.get('/live', (req, res) => {
      res.sendStatus(200);
    });
  }

  setupSocket() {
    this.io.on("connection", (socket) => {
      const token = socket.handshake.auth.token;
      let auth: boolean = true;

      if(this.authToken) {
        if(this.authToken!=token) {
          auth = false;
          if(this.authToken != null && token != null) {
            console.log("WARNING! Got wrong authentication for " + socket);
          }
        } else {
          console.log("Client with proper credentials connected");
        }
      }

      socket.on("getState", () => {
        console.log("update state to new client");
        socket.emit("controllers", this.controllers);
      })

      socket.on("getStateController", (name) => {
        socket.emit("changeController", this.controllers[name]);
      });

      socket.on("registerController", (controller) => {
        if(!auth) {
          console.log("WARNING: Got unauthorized new controller statement");
          return;
        }

        // console.log("Publish new controller " + JSON.stringify(msg));
        // controllers[msg['name']] = msg;
        // console.log(controllers);
        // console.log(controller);
        // server.controllers[controller.name] = controller;
        this.controllers[controller.name] = controller;
        socket.broadcast.emit("controllers", this.controllers);
      });

      socket.on("removeController", (controller) => {
        if(!auth) {
          console.log("WARNING: Got unauthorized remove controller statement");
          return;
        }
        console.log("Remove controller " + controller.name);
        delete this.controllers[controller.name];
        socket.broadcast.emit("controllers", this.controllers);
      });

      socket.on("reset", () => {
        if(!auth) {
          console.log("WARNING: Got unauthorized reset statement");
          return;
        }
        console.log("Reset controllers");
        this.controllers = {};
        socket.broadcast.emit("controllers", this.controllers);
      });

      socket.on("changeController", (controller) => {
        console.log(`Received ${controller.name}: ${controller.value}`);

        this.controllers[controller.name].value = controller.value;

        socket.broadcast.emit("changeController", controller);
      });
    });
  }
}



const server = new SuperColliderWebRtcServer();

server.http.listen(3000, "0.0.0.0", () => {
  console.log('listening on 0.0.0.0:3000');
});
