import {io, Socket} from "socket.io-client";
import {ServerToClientEvents, ClientToServerEvents, Controller} from "./communication";
const osc = require("osc");


const SC_PORT: number = Number(process.env.SC_PORT) || 57120
const SC_HOST: string = process.env.SC_HOST || "localhost"
const CLIENT_PORT: number = Number(process.env.CLIENT_PORT) || 57220
const BACKEND_ADDRESS: string = process.env.BACKEND_ADDRESS || "http://localhost:3000"
const BACKEND_AUTH_TOKEN: string | null = process.env.BACKEND_AUTH_TOKEN || null

console.log("Start client")
console.log("Backend address: " + BACKEND_ADDRESS)
console.log("SuperCollider address: " + SC_HOST + ":" + SC_PORT)
console.log("Client port: " + CLIENT_PORT)

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(BACKEND_ADDRESS);

if(BACKEND_AUTH_TOKEN) {
    socket.auth = {token: BACKEND_AUTH_TOKEN};
    console.log("Auth token: \"" + BACKEND_AUTH_TOKEN + "\"");
} else {
    console.log("No auth token used");
}

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: CLIENT_PORT,
    remoteAddress: SC_HOST,
    remotePort: SC_PORT,
});
udpPort.open();

function oscToDict(msg: [any]): {} {
    // transforms [k1, v1, k2, v2, ...] to {k1: v1, k2: v2, ...}
    var o = {};
    for (let i = 0; i <= msg.length - 1; i = i + 2) {
        // @ts-ignore
        o[msg[i]] = msg[i + 1];
    }
    return o;
}

function controllerToOscArray(controller: Controller): Array<any> {
    // transforms {k1: v1, k2: v2, ...} to [k1, v1, k2, v2, ...]
    // please no nested/deep objects
    var a = [];

    let key: keyof typeof controller;
    for (key in controller) {
        a.push(key);
        a.push(controller[key]);
    }
    return a;
};


osc.on

udpPort.on("message", function (oscMessage: any) {
    var jsonPayload = oscToDict(oscMessage.args);
    console.log(`Received OSC message ${JSON.stringify(jsonPayload)}`);
    socket.emit(
        oscMessage.address.substring(1),
        jsonPayload,
    )
});

socket.on('connect', function () {
    console.log("Connected to server");
});

socket.on("changeController", (controller) => {
    console.log(`Received message ${controller.name}: ${controller.value}`);
    var oscPayload = controllerToOscArray(controller);
    oscPayload.push("address");
    oscPayload.push("changeController");

    udpPort.send({
        address: "/WebRTCGUIbackchannel",
        args: oscPayload,
    });
});

console.log("Started client");
