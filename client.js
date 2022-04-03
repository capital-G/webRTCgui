var io = require('socket.io-client');
var osc = require("osc");

const SC_PORT = process.env.SC_PORT || 57120
const SC_HOST = process.env.SC_HOST || "localhost"
const CLIENT_PORT = process.env.CLIENT_PORT || 57220
const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || "http://localhost:3000"
const BACKEND_AUTH_TOKEN = process.env.BACKEND_AUTH_TOKEN || null

console.log("Start client")
console.log("Backend address: " + BACKEND_ADDRESS)
console.log("SuperCollider address: " + SC_HOST + ":" + SC_PORT)
console.log("Client port: " + CLIENT_PORT)

var socket;

if(BACKEND_AUTH_TOKEN) {
    console.log("Auth token: \"" + BACKEND_AUTH_TOKEN + "\"");
    socket = io(BACKEND_ADDRESS, {auth: {token: BACKEND_AUTH_TOKEN}});
} else {
    console.log("No auth token used");
    socket = io(BACKEND_ADDRESS);
}

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: CLIENT_PORT,
    remoteAddress: SC_HOST,
    remotePort: SC_PORT,
});
udpPort.open();

oscArrayToJson = (msg) => {
    // transforms [k1, v1, k2, v2, ...] to {k1: v1, k2: v2, ...}
    var o = {};
    for (let i = 0; i <= msg.length - 1; i = i + 2) {
        o[msg[i]] = msg[i + 1];
    }
    return o;
}

jsonToOscArray = (msg) => {
    // transforms {k1: v1, k2: v2, ...} to [k1, v1, k2, v2, ...]
    // please no nested/deep objects
    var a = [];
    for (const key in msg) {
        a.push(key);
        a.push(msg[key]);
    }
    return a;
};

udpPort.on("message", function (oscMessage) {
    var jsonPayload = oscArrayToJson(oscMessage.args);
    console.log("Received OSC message " + JSON.stringify(jsonPayload));
    socket.emit(
        oscMessage.address.substring(1),
        jsonPayload,
    )
});

socket.on('connect', function () {
    console.log("Connected to server");
});

socket.on("changeController", (msg) => {
    console.log("Received message " + JSON.stringify(msg));
    var oscPayload = jsonToOscArray(msg);
    oscPayload.push("address");
    oscPayload.push("changeController");

    udpPort.send({
        address: "/WebRTCGUIbackchannel",
        args: oscPayload,
    });
});

console.log("Started client");
