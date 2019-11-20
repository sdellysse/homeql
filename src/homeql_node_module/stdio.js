import readline from "readline";
import uuid from "uuid/v4";

const conn = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

conn.on("line", (line) => {
	let message = null;
	try {
		message = JSON.parse(line);
	} catch (_e) {
		console.error("MALFORMED INPUT");
		return;
	}

	conn.emit("driverMessage", message);
});

const stdio = {
	conn,

	onDriverMessage: (fn) => conn.on("driverMessage", fn),

	writeLine: (obj) => console.log(JSON.stringify(obj)),

	emit: (eventId, data) => {
		const id = uuid();

		stdio.writeLine({
			"_id": id,
			"emit": eventId,
			"data": data,
		});

		return id;
	},

	reply: (requestId, { error = false, data = {} } = {}) => {
		const id = uuid();

		stdio.writeLine({
			"_id": id,
			"reply_to": requestId,
			"error": error,
			"data": data,
		});

		return id;
	},
};

export default stdio;
