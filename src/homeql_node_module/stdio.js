import readline from "readline";

export default ({ onLine }) => {
	const stdio = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	stdio.on("line", async (line) => {
		let obj = null;
		try {
			obj = JSON.parse(line);
		} catch (_e) {
			console.error("MALFORMED INPUT");
			return;
		}

		await onLine(obj);
	});

	return {
		stdio,
		writeLine: (obj) => console.log(JSON.stringify(obj)),
	};
}
