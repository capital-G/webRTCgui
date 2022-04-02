WebRTCGUI {
	var clientHost;
	var clientPort;

	var <client;
	var <sliders;


	*new {|clientHost="localhost", clientPort=57220|
		^super.newCopyArgs(
			clientHost,
			clientPort,
		).init;
	}

	init {
		client = NetAddr(clientHost, clientPort);
	}



	registerNewSlider {|name|
		client.sendMsg(
			"/registerSlider",
			name,
		);
	}
}
