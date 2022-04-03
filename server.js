const express = require("express");

const app = express();

const path = __dirname + '/frontend_build/';

app.use(express.static(path));

const http = require('http').createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: [
      "http://localhost:3001",
      "http://localhost:4200",
      "http://localhost:8080",
      "http://client",
    ],
  },
});

BACKEND_AUTH_TOKEN = process.env.BACKEND_AUTH_TOKEN || null;

if(BACKEND_AUTH_TOKEN) {
  console.log("Using auth token: \"" + BACKEND_AUTH_TOKEN + "\"");
} else {
  console.log("Run without auth token");
}

var controllers = {};

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
  var auth = true;
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

  socket.on("getState", (msg) => {
    console.log("update state to new client");
    socket.emit("controllers", controllers);
  })

  socket.on("getStateController", (msg) => {
    var name = msg['name'];
    socket.emit("changeController_" + name, controllers[name]);
  });

  socket.on("registerController", (msg) => {
    if(!auth) {
      console.log("WARNING: Got unauthorized new controller statement");
      return;
    }
    console.log("Publish new controller " + JSON.stringify(msg));
    controllers[msg['name']] = msg;
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("removeController", (msg) => {
    if(!auth) {
      console.log("WARNING: Got unauthorized remove controller statement");
      return;
    }
    var controllerName = msg['name'];
    console.log("Remove controller " + controllerName);
    delete controllers[controllerName];
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("reset", (msg) => {
    if(!auth) {
      console.log("WARNING: Got unauthorized reset statement");
      return;
    }
    console.log("Reset controllers");
    controllers = {};
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("changeController", (msg) => {
    const name = msg["name"];
    console.log("Received controller " + name + " change: " + msg["value"]);

    controllers[name]['value'] = msg["value"];

    socket.broadcast.emit("changeController_" + name, controllers[name]);
    socket.broadcast.emit("changeController", msg);
  });
});


http.listen(3000, "0.0.0.0", () => {
  console.log('listening on *:3000');
});
