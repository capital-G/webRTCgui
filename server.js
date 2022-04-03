const express = require("express");
// const app = require('express')();

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

var controllers = {};

app.get('/', (req, res) => {
  res.sendFile(path + "index.html");
});

app.get('/live', (req, res) => {
  res.sendStatus(200);
});

io.on("connection", (socket) => {
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

  socket.on("reset", (msg) => {
    controllers = [];
  });

  socket.on("registerController", (msg) => {
    console.log("New controller " + msg);
    controllers[msg['name']] = msg;
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("removeController", (msg) => {
    var controllerName = msg['name'];
    console.log("Remove controller " + controllerName);
    delete controllers[controllerName];
    socket.broadcast.emit("controllers", controllers);
  });

  socket.on("reset", (msg) => {
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
