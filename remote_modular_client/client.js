var io = require('socket.io-client');

var socket = io("http://localhost:3000");

socket.on('connect', function () { console.log("socket connected"); });
socket.emit('private message', { user: 'me', msg: 'whazzzup?' });

socket.on("slider change", (msg) => {
    console.log(msg);
});

console.log("Started client")

console.log(socket);
