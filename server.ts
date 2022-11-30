import * as express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {ServerToClientEvents, ClientToServerEvents, Controller} from "./communication";

const app = express();

const path = __dirname + '/frontend_build/';

app.use(express.static(path));

const http = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(http, {
  cors: {
    origin: [
      "http://localhost:3001",
      "http://localhost:4200",
      "http://localhost:8080",
      "http://client",
    ],
  },
});

const BACKEND_AUTH_TOKEN = process.env.BACKEND_AUTH_TOKEN || null;

if(BACKEND_AUTH_TOKEN) {
  console.log("Using auth token: \"" + BACKEND_AUTH_TOKEN + "\"");
} else {
  console.log("Run without auth token");
}

var controllers: { [id: string] : Controller; }

// express.js

app.get('/', (req, res) => {
  res.sendFile(path + "index.html");
});

app.get('/live', (req, res) => {
  res.sendStatus(200);
});

// socket.io

io.on("connection", (socket) => {
  const token = socket.handshake.auth.token;
  let auth: boolean = true;

  if(BACKEND_AUTH_TOKEN) {
    if(BACKEND_AUTH_TOKEN!=token) {
      auth = false;
      if(BACKEND_AUTH_TOKEN != null && token != null) {
        console.log("WARNING! Got wrong authentication for " + socket);
      }
    } else {
      console.log("Client with proper credentials connected");
    }
  }

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("getState", () => {
    console.log("update state to new client");
    socket.emit("controllers", controllers);
  })

  socket.on("getStateController", (name) => {
    socket.emit("changeController", controllers[name]);
  });

  socket.on("registerController", (controller) => {
    if(!auth) {
      console.log("WARNING: Got unauthorized new controller statement");
      return;
    }

    // console.log("Publish new controller " + JSON.stringify(msg));
    // controllers[msg['name']] = msg;
    controllers[controller.name] = controller;
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("removeController", (controller) => {
    if(!auth) {
      console.log("WARNING: Got unauthorized remove controller statement");
      return;
    }
    console.log("Remove controller " + controller.name);
    delete controllers[controller.name];
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("reset", () => {
    if(!auth) {
      console.log("WARNING: Got unauthorized reset statement");
      return;
    }
    console.log("Reset controllers");
    controllers = {};
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("changeController", (controller) => {
    console.log(`Received controller ${controller.name} change: ${controller.value}`);

    controllers[controller.name].value = controller.value;

    socket.broadcast.emit("changeController", controller);
  });
});


http.listen(3000, "0.0.0.0", () => {
  console.log('listening on *:3000');
});
