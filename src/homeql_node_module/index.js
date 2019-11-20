import stdio from "./stdio";

export { stdio };

export const implementDriver = ({ autodetect }) => {
	stdio.onDriverMessage((message) => {
		if (false) {
		} else if (autodetect && (message["command"] === "autodetect")) {
			autodetect(message["_id"], {
				eventId: message["event_id"],
			});
		} else {
			console.error("MALFORMED MESSAGE:", message);
		}
	});
};
