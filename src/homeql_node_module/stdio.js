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

	writeLine: (obj) => console.log("STDOUT ", JSON.stringify(obj)),
	tickle: (eventId) => stdio.writeLine({ "tickle": eventId }),
	reply: (replyId, { error, data = {} })=> stdio.writeLine({
		"reply_to": replyId,
		"error": error,
		"data": data,
	}),

	log: (...args) => console.error("STDERR ", ...args),
};

export default stdio;
