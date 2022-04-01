const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
	cors: {
		origins: [
			"http://localhost:3001",
			"http://localhost:4200",
			"http://localhost:8080",
		],
	},
});


app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

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


http.listen(3000, () => {
  console.log('listening on *:3000');
});
