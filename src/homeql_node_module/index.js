import stdio from "./stdio";

export { stdio };

export const runDriver = ({ commands }) => stdio.onDriverMessage(async (message) => {
	if (message["command"] != null) {
		const commandHandler = commands[message["command"]];
		if (!commandHandler) {
			console.error("MALFORMED MESSAGE: ", message);
		} else {
			const replyData = await commandHandler(message);

			if (message["reply_id"] && (replyData !== undefined)) {
				stdio.reply(message["reply_id"], replyData);
			}
		}
	}
});
