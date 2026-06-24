import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { ActionResponse, Data, GameState } from "./types.ts";
import { createLobby, joinLobby } from "./actions.ts";

const PORT = 8000;

const server = http.createServer((_req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Game Server WebSocket Transport Layer Only");
});
const wss = new WebSocketServer({ server });

function sendAll(data: Data) {
	wss.clients.forEach(client => client.send(JSON.stringify(data)));
}

function send(client: WebSocket, data: Data) {
	client.send(JSON.stringify(data));
}

const gameRooms = new Map<string, GameState>();

wss.on("connection", ws => {
	console.log("Player connected	");
	ws.on("message", message => {
		try {
			const data: Data = JSON.parse(message.toString());

			let dataToSend: ActionResponse;
			switch (data.action) {
				case "create-lobby":
					dataToSend = createLobby(gameRooms, data.payload);
					console.log(gameRooms.get(data.payload.code));

					break;
				case "join-lobby":
					dataToSend = joinLobby(gameRooms, data.payload);
					console.log(gameRooms.get(data.payload.code));

					break;
				default:
					dataToSend = {
						data: {
							action: "error",
							payload: { message: "Invalid packet" }
						},
						target: "sender"
					};

					break;
			}

			switch (dataToSend.target) {
				case "sender":
					send(ws, dataToSend.data);

				case "all":
					sendAll(dataToSend.data);
			}
		} catch (e) {
			console.error("Invalid network packet format.");
		}
	});

	ws.on("close", () => console.log("Player disconnected"));
});

server.listen(PORT);
