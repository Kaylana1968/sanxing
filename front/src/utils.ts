export const localUsernameKey = "username";

export function getNewWebsocket() {
	return new WebSocket("ws://localhost:8000");
}
