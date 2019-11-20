import { Client } from "tplink-smarthome-api";
import { implementDriver } from "../../homeql_node_module";
import { stdio } from "../../homeql_node_module";

const client = new Client();

const instances = {};

implementDriver({
	autodetect: (rId, { eventId }) => {
		stdio.reply(rId, { error: false });

		client.startDiscovery().on('device-new', async (device) => {
			const sysInfo = await device.getSysInfo();

			let deviceClass = null;
			let deviceCapabilities = [];
			if (sysInfo["mic_type"] === "IOT.SMARTBULB") {
				deviceClass = "light";
				deviceCapabilities = [
					"toggle_on_off",
				];
			}

			stdio.emit(eventId, {
				"device": {
					"class": deviceClass,
					"capabilities": deviceCapabilities,
				},
				"connection": {
					"kind": "ip",
					"details": {
						"host": `${device["host"]}`,
						"port": `${device["port"]}`,
					},
				},
			});
		});
	},

	connect: async (rId, { instanceId, device, connection }) => {
		if (kind !== "ip") {
			throw new Error("only ip connection kind supported");
		}

		if (0) {
		} else if (device.class === "light") {
			const conn = client.getBulb({
				host: connection.host,
				port: connection.port,
			});

			try {
				await conn.getInfo();
				instances[instanceId] = {
					id: instanceId,
					device,
					connection,
					conn,
				};

				stdio.reply(rId, { error: false });
			} catch (_e) {
				stdio.reply(rId, { error: true });
			}
		} else {
			stdio.reply(rId, { error: "cant do that yet boss" });
		}
	},
});
