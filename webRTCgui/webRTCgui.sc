WebRTCGUI {
	var clientHost;
	var clientPort;

	var <client;
	var <controllers;
	var <oscDefName;


	*new {|clientHost="localhost", clientPort=57220|
		^super.newCopyArgs(
			clientHost,
			clientPort,
		).init;
	}

	init {
		client = NetAddr(clientHost, clientPort);
		controllers = ();
		oscDefName = "WebRTCGUIbackchannel_%_%".format(clientHost, clientPort);
		this.setupUpdate.();
	}

	setupUpdate {
		OSCdef(oscDefName, {|msg|
			var name = msg[1];
			var val = msg[2];
			var controller = this.getController(name);

			if(controller.isNil, {
				"received value (%) for unknown controller %".format(val, name).warn;
			}, {
				controller[\callback].(val);
			});


		}, path: "/WebRTCGUIbackchannel");
	}

	reset {
		client.sendMsg("/reset");
		controllers = ();
		"Resetted controllers".postln;
	}

	newController {|name, spec, callback|
		name = name;
		controllers[name.asSymbol] = (
			spec: spec,
			callback: callback
		);

		// send [k1, v1, k2, v2,...]
		client.sendMsg(
			"/registerController",
			"name", name,
			// hardcoded for now
			"type", "slider",
			"specMinVal", spec.storeArgs[0],
			"specMaxVal", spec.storeArgs[1],
			"specDefault", spec.storeArgs[4],
		);
	}

	getController { |name|
		^controllers[name.asSymbol];
	}
}
