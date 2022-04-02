var io = require('socket.io-client');
var osc = require("osc");

const SC_PORT = process.env.SC_PORT || 57120
const SC_HOST = process.env.SC_HOST || "localhost"
const CLIENT_PORT = process.env.CLIENT_PORT || 57220
const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || "http://localhost:3000"

console.log("Start client")
console.log("Backend address: " + BACKEND_ADDRESS)
console.log("SuperCollider address: " + SC_HOST + ":" + SC_PORT)
console.log("Client port: " + CLIENT_PORT)

const socket = io(BACKEND_ADDRESS);

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: CLIENT_PORT,
    remoteAddress: SC_HOST,
    remotePort: SC_PORT,
});
udpPort.open();

udpPort.on("message", function (oscMessage) {
    console.log(oscMessage);
    socket.emit(
        // remove leading "/"
        oscMessage.address.substring(1),
        oscMessage.args,
    )
});


socket.on('connect', function () {
    console.log("socket connected");
});

socket.on("slider change", (msg) => {
    console.log("Received message " + msg);
    udpPort.send({
        address: "/slider/",
        args: msg
    });
});

console.log("Started client")
