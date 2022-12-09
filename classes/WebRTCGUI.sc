WebRTCGUI {
	var clientHost;
	var clientPort;

	var client;
	var <controllers;
	var oscDefName;


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
		this.prSetupUpdate.();
	}

	*prArrayToEvent {|a|
		var e = ();
		a.pairsDo({|k, v|
			e[k.asSymbol] = v;
		});
		^e;
	}

	prSetupUpdate {
		OSCdef(oscDefName, {|msg|
			var e = WebRTCGUI.prArrayToEvent(msg[1..]);
			var controller = this.getController(e[\name]);

			switch(e[\address].asSymbol,
				"changeController".asSymbol, {
					if(controller.isNil, {
						"received value (%) for unknown controller %".format(e[\value], e[\name]).warn;
					}, {
						controller[\callback].(e[\value]);
					});
				},
				{"Received message with unknow address: %".format(e).warn;}
			);
		}, path: "/WebRTCGUIbackchannel");
	}

	reset {
		client.sendMsg("/reset");
		controllers = ();
		"Resetted controllers".postln;
	}

	newSlider {|name, spec, callback|
		callback = callback ? {};
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
			"value", spec.storeArgs[4],
			"min", spec.storeArgs[0],
			"max", spec.storeArgs[1],
		);
	}

	newButton {|name, callback|
		controllers[name.asSymbol] = (
			callback: callback,
		);

		client.sendMsg(
			"/registerController",
			"name", name,
			"type", "button",
			"value", 0,
		);
	}

	newText {|name, spec, callback|
		callback = callback ? {};
		spec = spec ? ();
		controllers[name.asSymbol] = (
			spec: spec,
			callback: callback,
		);

		client.sendMsg(
			"/registerController",
			"name", name,
			"type", "text",
			"value", spec.default ? "",
			"monospace", spec.monospace.asBoolean ? true,
		);
	}

	removeController {|name|
		var c = this.getController(name);
		if(c.isNil, {
			"Did not find controller %".format(name).postln;
		}, {
			client.sendMsg(
				"/removeController",
				"name", name,
			);
			controllers[name.asSymbol] = nil;
		});

	}

	getController { |name|
		^controllers[name.asSymbol];
	}
}
