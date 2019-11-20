import { Client } from "tplink-smarthome-api";
import { createStdio } from "../../homeql_node_module";
import uuid from "uuid/v4";

(async () => {
	const client = new Client();

	const commands = {
		autodetect: async (stdio, line) => {
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

				stdio.writeLine({
					"_id": uuid(),
					"emit": line["event_id"],
					"data": {
						"device": {
							"class": deviceClass,
							"capabilities": deviceCapabilities,
						},
						"connection_type": "ip_port",
						"connection_info": {
							"host": device["host"],
							"port": `${device["port"]}`,
						},
					},
				});
			});

			stdio.writeLine({
				"_id": uuid(),
				"reply_to": line["_id"],
				"error": false,
			});
		},

		connect: async (stdio, line) => {
		},
	};

	const stdio = createStdio({
		onLine: async (line) => {
			if (commands[line["command"]]) {
				await commands[line["command"]](stdio, line);
			} else {
				console.error("UNKNOWN COMMAND: ", line["command"]);
			}
		},
	});
})();
