import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { Data, GameState } from "./types.ts";
import { formatGameState } from "./utils.ts";

const PORT = 8000;

const server = http.createServer((_req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Game Server WebSocket Transport Layer Only");
});
const wss = new WebSocketServer({ server });

function sendLobby(client: WebSocket, data: Data, clientData?: Data) {
	const gameState = clientToLobby.get(client)!;
	const jsonData = JSON.stringify(data);

	gameState.players.forEach((p) =>
		clientData
			? p.client === client
				? p.client.send(JSON.stringify(clientData))
				: p.client.send(jsonData)
			: p.client.send(jsonData)
	);

	console.log("send lobby", data.action, data.payload);
}

function send(client: WebSocket, data: Data) {
	client.send(JSON.stringify(data));

	console.log("send", data.action, data.payload);
}

const clientToLobby = new Map<WebSocket, GameState>();
const gameLobbies = new Map<string, GameState>();

wss.on("connection", (client) => {
	client.on("message", (message) => {
		try {
			const { action, payload }: Data = JSON.parse(message.toString());

			console.log("receive", action, payload);

			switch (action) {
				case "create-lobby":
					createLobby(client, payload);
					break;

				case "join-lobby":
					joinLobby(client, payload);
					break;

				case "exit-lobby":
					exitLobby(client);
					break;

				case "check-lobby":
					checkLobby(client, payload);
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

	client.on("close", () => {
		const gameState = removeFromGames(client);

		if (!gameState) return;

		sendLobby(client, {
			action: "game-state-success",
			payload: { gameState }
		});

		clientToLobby.delete(client);
	});
});

function createLobby(client: WebSocket, payload: { code: string }) {
	const { code } = payload;

	if (gameLobbies.has(code)) {
		send(client, {
			action: "create-lobby-failure",
			payload: { message: "Le code est déjà pris" }
		});
		return;
	}

	const gameState: GameState = { code, players: [], teams: [] };

	gameLobbies.set(code, gameState);
	clientToLobby.set(client, gameState);

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

	const gameState = gameLobbies.get(code);
	if (!gameState) {
		send(client, {
			action: "join-lobby-failure",
			payload: { message: "La partie n'existe pas" }
		});
		return;
	}

	gameState.players.push({ client, username, cards: [] });
	clientToLobby.set(client, gameState);

	sendLobby(client, {
		action: "join-lobby-success",
		payload: { gameState }
	});
}

function exitLobby(client: WebSocket) {
	const gameState = removeFromGames(client);

	if (!gameState) return;

	sendLobby(client, {
		action: "exit-lobby-success",
		payload: { gameState }
	});
}

function checkLobby(client: WebSocket, payload: { code: string }) {
	const { code } = payload;

	send(client, {
		action: "check-lobby-success",
		payload: { code, exists: gameLobbies.has(code) }
	});
}

function gameState(client: WebSocket) {
	const gameState = clientToLobby.get(client);
	if (!gameState) {
		send(client, {
			action: "game-state-failure",
			payload: { message: "Vous n'êtes pas dans une partie" }
		});

		return;
	}
	send(client, {
		action: "game-state-success",
		payload: { gameState: formatGameState(gameState) }
	});
}

function removeFromGames(client: WebSocket) {
	const gameState = clientToLobby.get(client);

	if (!gameState) return;

	gameState.players.splice(
		gameState.players.findIndex((p) => p.client === client)
	);

	if (gameState.players.length === 0) {
		gameLobbies.delete(gameState.code);
		return;
	}

	return gameState;
}

server.listen(PORT);
