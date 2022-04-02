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

transformOscArray = (msg) => {
    // transforms [k1, v1, k2, v2, ...] to {k1: v1, k2: v2, ...}
    var o = {};
    for (let i = 0; i <= msg.length - 1; i = i + 2) {
        o[msg[i]] = msg[i + 1];
    }
    return o;
}

udpPort.on("message", function (oscMessage) {
    var jsonPayload = transformOscArray(oscMessage.args);
    console.log("Received message " + oscMessage);
    console.log("Extracted " + JSON.stringify(jsonPayload));
    socket.emit(
        oscMessage.address.substring(1),
        jsonPayload,
    )
});

socket.on('connect', function () {
    console.log("socket connected");
});

socket.on("changeController", (msg) => {
    console.log("Received message " + msg);
    udpPort.send({
        address: "/WebRTCGUIbackchannel",
        // transform {k: v} to [k, v]
        // args: [Object.keys(msg)[0], msg[ Object.keys(a)[0]]]
        args: msg,
    });
});

console.log("Started client");
