/*
ideas:
add primary, secondary to Color?

problems:
how could updates work properly from within supercollider?
when do we know to release stuff?
what could be a way to add additional styling beyond the default gui ones?
*/


WebLayout {
	var <>items;

	*new { arg ...newItems;
		^super.newCopyArgs().init(newItems);
	}

	init {|newItems|
		items = newItems;
	}
}

WebHLayout : WebLayout {}

WebVLayout : WebLayout {}

WebTabLayout : WebLayout {}


WebRTCGUI {
	classvar curId;
	var clientHost;
	var clientPort;

	var client;
	var <layout;
	var <controllers;
	var oscDefName;

	*initClass {
		curId = 0;
	}

	*prNextId {
		curId = curId + 1;
		^curId;
	}


	*new {|clientHost="localhost", clientPort=57220|
		^super.newCopyArgs(
			clientHost,
			clientPort,
		).init;
	}

	init {
		client = NetAddr(clientHost, clientPort);
		layout = WebHLayout();
		controllers = ();
		this.prSetupUpdate;
	}

	prSetupUpdate {
		OSCdef("webRtcGui_%_%".format(clientHost, clientPort), {|msg|
			var e = msg[1].asString.parseJSON;
			var controller = controllers[e["id"].asInteger];

			if(controller.isNil, {
				"received value % for unknown controller %".format(e["value"], e["id"]).warn;
			}, {
				{controller.valueAction_(e["value"])}.defer;
			});
		}, path: "/WebRTCGUIbackchannel");
	}

	reset {
		layout = WebHLayout();
		controllers = ();
		this.updateControllers;
		"Resetted controllers".postln;
	}

	updateControllers {
		client.sendMsg(
			"/setLayout",
			WebRTCGUI.toJson(this.transform(layout)),
		);
	}

	layout_ {|l|
		layout = l;
		this.updateControllers;
	}

	*toJson {|v|
		var string, array;
		var value = case
		{ v.isString } { v.replace("\n", "\\n").quote }
		{ v.isNil } { "null" }
		{ v.isKindOf(Boolean) } { v }
		{ v.isNumber } { v.asCompileString }
		{ v.isKindOf(Symbol) } { WebRTCGUI.toJson(v.asString) }
		{ v.isKindOf(Association) } { WebRTCGUI.toJson([v].asDict) }
		{ v.isKindOf(SequenceableCollection) } {
			array = v.collect { |x| WebRTCGUI.toJson(x) };
			"[ % ]".format(array.join(", "))
		}
		{ v.isKindOf(Dictionary) } {
			array = v.asAssociations.collect { |x| "%: %".format(WebRTCGUI.toJson(x.key), WebRTCGUI.toJson(x.value)) };
			"{ % }".format(array.join(", "))
		}
		{ v.asCompileString.quote };
		^value;
	}

	// these are non static because controllers can be recursive
	// and need to generate IDs which are mapped to the
	// controller dict for the callbacks
	color {|v|
		^(
			r: v.red*255.0,
			g: v.green*255.0,
			b: v.blue*255.0,
			a: v.alpha*1.0,  // alpha is between 0 and 1
		)
	}

	button {|v|
		^(
			value: 0,
			type: "button",
			states: v.states.collect({|state|
				(
					text: state[0] ? "",
					color: this.color(state[1] ? Color.black),
					backgroundColor: this.color(state[2] ? Color.white),
				)
			});
		)
	}

	slider {|v|
		^(
			value: v.value,
			type: "slider",
			min: 0.0,
			max: 1.0,
			name: "a slider",
		);
	}

	hLayout {|v|
		^(
			controllers: v.items.collect({|x| this.transform(x)}),
			type: "h-layout",
		)
	}

	vLayout {|v|
		^(
			controllers: v.items.collect({|x| this.transform(x)}),
			type: "v-layout",
		)

	}

	transform {|v|
		var val = case
		{v.isKindOf(Button)} {this.button(v)}
		{v.isKindOf(Slider)} {this.slider(v)}
		{v.isKindOf(WebHLayout)} {this.hLayout(v)}
		{v.isKindOf(WebVLayout)} {this.vLayout(v)};
		var id = WebRTCGUI.prNextId;
		controllers[id] = v;
		val.id = id;
		^val;
	}
}
