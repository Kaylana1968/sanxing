import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { Data, GameState } from "./types.ts";
import { formatGameState, getNewGame } from "./utils.ts";

const PORT = 8000;

const server = http.createServer((_req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Game Server WebSocket Transport Layer Only");
});
const wss = new WebSocketServer({ server });

function sendLobby(client: WebSocket, data: Data) {
	gameLobbies
		.get(clientToLobby.get(client)!)!
		.players.forEach(({ client }) => client.send(JSON.stringify(data)));
}

function send(client: WebSocket, data: Data) {
	client.send(JSON.stringify(data));
}

const clientToLobby = new Map<WebSocket, string>();
const gameLobbies = new Map<string, GameState>();

wss.on("connection", (client) => {
	console.log("Player connected	");
	client.on("message", (message) => {
		try {
			const { action, payload }: Data = JSON.parse(message.toString());

			switch (action) {
				case "create-lobby":
					createLobby(client, payload);
					break;

				case "join-lobby":
					joinLobby(client, payload);
					break;

				case "game-state":
					gameState(client);
					break;

				default:
					send(client, {
						action: "error",
						payload: { message: "Action inconnue" }
					});
					break;
			}
		} catch (e) {
			console.error("Invalid network packet format.");
		}
	});

	client.on("close", () => console.log("Player disconnected"));
});

function createLobby(client: WebSocket, payload: { username: string }) {
	const { username } = payload;

	const { code, game } = getNewGame({ client, username }, gameLobbies);
	gameLobbies.set(code, game);
	clientToLobby.set(client, code);

	send(client, {
		action: "create-lobby-success",
		payload: { code }
	});
}

function joinLobby(
	client: WebSocket,
	payload: { code: string; username: string }
) {
	const { code, username } = payload;

	const gameLobby = gameLobbies.get(code);
	if (!gameLobby) {
		send(client, {
			action: "join-lobby-failure",
			payload: { message: "La partie n'existe pas" }
		});
		return;
	}

	gameLobby.players.push({ client, username });
	clientToLobby.set(client, code);

	sendLobby(client, {
		action: "join-lobby-success",
		payload: { code }
	});
}

function gameState(client: WebSocket) {
	const code = clientToLobby.get(client);
	if (!code) {
		send(client, {
			action: "game-state-failure",
			payload: { message: "Vous n'êtes pas dans une partie" }
		});

		return;
	}

	const gameState = gameLobbies.get(code);
	if (!gameState) {
		send(client, {
			action: "game-state-failure",
			payload: { message: "La partie n'existe pas" }
		});

		return;
	}
	send(client, {
		action: "game-state-success",
		payload: { gameState: formatGameState(gameState) }
	});
}

server.listen(PORT);
