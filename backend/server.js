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

var sliders = [];

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    socket.on("getState", (msg) =>{
      console.log("update state to new client");
      socket.emit("sliders", sliders);
    })

    socket.on("reset", (msg) => {
      sliders = [];
    });

    socket.on("registerSlider", (msg) => {
      console.log("New slider " + msg);
      sliders.push(msg);
      socket.broadcast.emit("sliders", sliders);
    });

    socket.on("reset", (msg) => {
      console.log("Reset sliders");
      sliders = [];
      socket.broadcast.emit("sliders", sliders);
    });

    socket.on("changeSlider", (msg) => {
        console.log("Received slider change: " + msg);
        socket.broadcast.emit('slider change', msg);
    });
  });


http.listen(3000, "0.0.0.0", () => {
  console.log('listening on *:3000');
});
