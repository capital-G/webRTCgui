const app = require('express')();
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

var controllers = [];

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    socket.on("getState", (msg) =>{
      console.log("update state to new client");
      socket.emit("controllers", controllers);
    })

    socket.on("reset", (msg) => {
      controllers = [];
    });

    socket.on("registerController", (msg) => {
      console.log("New controller " + msg);
      controllers.push(msg);
      socket.broadcast.emit("controllers", controllers);
    });

    socket.on("reset", (msg) => {
      console.log("Reset controllers");
      controllers = [];
      socket.broadcast.emit("controllers", controllers);
    });

    socket.on("changeController", (msg) => {
        console.log("Received controller change: " + msg);
        socket.broadcast.emit('changeController', msg);
    });
  });


http.listen(3000, "0.0.0.0", () => {
  console.log('listening on *:3000');
});
