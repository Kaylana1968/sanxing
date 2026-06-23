import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { Data, GameState } from "./types.ts";

const PORT = 8000;

const server = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Game Server WebSocket Transport Layer Only");
});

const wss = new WebSocketServer({ server });

const gameRooms = new Map<string, GameState>();

function sendAll(data: Data) {
	wss.clients.forEach(client => client.send(JSON.stringify(data)));
}

function send(client: WebSocket, data: Data) {
	client.send(JSON.stringify(data));
}

wss.on("connection", ws => {
	console.log("Player connected");

	ws.on("message", message => {
		try {
			const data: Data = JSON.parse(message.toString());

			switch (data.action) {
				case "create-lobby":
					const { username, code } = data.payload as {
						username: string;
						code: string;
					};

					const existingRoom = gameRooms.get(code);
					if (existingRoom) {
						send(ws, {
							action: "error",
							payload: { message: "Une partie avec ce code existe déjà" }
						});

						return;
					}

					gameRooms.set("code", { players: [{ username }], teams: [] });
					send(ws, {
						action: "join-room",
						payload: { code }
					});

					console.log(gameRooms);

					return;

				default:
					console.log("Invalid packet");
			}
		} catch (e) {
			console.error("Invalid network packet format.");
		}
	});

	ws.on("close", () => {
		console.log("Player disconnected.");
	});
});

server.listen(PORT);
