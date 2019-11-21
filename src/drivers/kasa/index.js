import { Client } from "tplink-smarthome-api";
import { runDriver } from "../../homeql_node_module";
import { stdio } from "../../homeql_node_module";

const client = new Client();

const discoveredDevices = {};

const generateDeviceClass = (device) => {
	if (0) {
	} else if (device.sysInfo["mic_type"] === "IOT.SMARTBULB") {
		return "bulb";
	} else {
		throw new Error("TODO");
	}
};

const generateDeviceId = (device) => `${ generateDeviceClass(device) }:${ device.sysInfo.alias }`;

runDriver({
	commands: {
		"discovery_enable": (message) => {
			client.startDiscovery()
				.on('device-new', (device) => {
					stdio.log("device-new", generateDeviceId(device));

					discoveredDevices[generateDeviceId(device)] = device;
					stdio.tickle(message["event_id"]);
				})
				.on("device-online", (device) => {
					// Devices (well porch wall light at least) emits this
					// on interval, probably a heartbeat. We only care about
					// this event in the case that we discovered a device, it
					// goes offline, and then comes back online.
					if (discoveredDevices[generateDeviceId(device)]) {
						//stdio.log("device heartbeat: ", generateDeviceId(device));
						return;
					}

					stdio.log("device-online", generateDeviceId(device));

					discoveredDevices[generateDeviceId(device)] = device;
					stdio.tickle(message["event_id"]);
				})
				.on("device-offline", (device) => {
					// Not sure how we'd get to this state but log it if it does happen.
					if (!discoveredDevices[generateDeviceId(device)]) {
						stdio.log("WARN: device-offline for undiscovered device: ", generateDeviceId(device));
						return;
					}

					stdio.log("device-offline", generateDeviceId(device));

					if (discoveredDevices[generateDeviceId(device)]) {
						discoveredDevices[generateDeviceId(device)] = null;
						stdio.tickle(message["event_id"]);
					}
				})
			;

			return { error: null };
		},

		"discovery_disable": () => {
			client.stopDiscovery();
			for (const id of discoveredDevices) {
				discoveredDevices[id] = null;
			}

			return { error: null };
		},


		"discovery_list": async () => {
			const devices = Object.values(discoveredDevices);

			return {
				error: null,
				data: devices.flatMap((device) => {
					switch (generateDeviceClass(device)) {
						case "bulb":
							return [{
								"id": generateDeviceId(device),
								"device_class": "bulb",
								"device_capabilities": [
									"read_onoff",
									"set_onoff",
								],
								"connection": {
									"host": `${ device["host"] }`,
								},
							}];
						break;

						default:
							throw new Error("TODO");
							return [];
						break;
					}
				}),
			}
		},

		"connect": async (message) => {
			if (0) {
			} else if ((message["connection"] == null) && (message["discovery_id"] != null)) {
				// we're targeting a discovered device by id
				const device = discoveredDevices[message["discovery_id"]];

			} else {
				return { error: "Must specify device_id and not connection for now" };
			}
		},
	},
});
		//connect: async (rId, { instanceId, device, connection }) => {
		//	if (kind !== "ip") {
		//		throw new Error("only ip connection kind supported");
		//	}

		//	if (0) {
		//	} else if (device.class === "light") {
		//		const conn = client.getBulb({
		//			host: connection.host,
		//			port: connection.port,
		//		});

		//		try {
		//			await conn.getInfo();
		//			instances[instanceId] = {
		//				id: instanceId,
		//				device,
		//				connection,
		//				conn,
		//			};

		//			stdio.reply(rId, { error: false });
		//		} catch (_e) {
		//			stdio.reply(rId, { error: true });
		//		}
		//	} else {
		//		stdio.reply(rId, { error: "cant do that yet boss" });
		//	}
		//},
