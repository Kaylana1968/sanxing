import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { Data } from "./types.ts";
import { Game } from "./classes/Game.ts";
import { Player } from "./classes/Player.ts";

const PORT = 8000;

const server = http.createServer((_req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Game Server WebSocket Transport Layer Only");
});
const wss = new WebSocketServer({ server });

function sendLobby(client: WebSocket, data: Data, clientData?: Data) {
	const game = clientToLobby.get(client)!;
	const jsonData = JSON.stringify(data);
	const jsonClientData = JSON.stringify(clientData);

	game.getPlayers().forEach(p => {
		if (clientData && p.webSocket === client) p.webSocket.send(jsonClientData);
		else p.webSocket.send(jsonData);
	});

	console.log("send lobby", data.action, data.payload);
}

function send(client: WebSocket, data: Data) {
	client.send(JSON.stringify(data));

	console.log("send", data.action, data.payload);
}

const clientToLobby = new Map<WebSocket, Game>();
const gameLobbies = new Map<string, Game>();

wss.on("connection", client => {
	client.on("message", message => {
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
		const game = removeFromGames(client);

		if (!game) return;

		sendLobby(client, {
			action: "game-state-success",
			payload: { gameState: game.toClientGameState() }
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

	const game = new Game(code);

	gameLobbies.set(code, game);
	clientToLobby.set(client, game);

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

	const game = gameLobbies.get(code);
	if (!game) {
		send(client, {
			action: "join-lobby-failure",
			payload: { message: "La partie n'existe pas" }
		});
		return;
	}

	game.addPlayer(new Player(client, username));
	clientToLobby.set(client, game);

	sendLobby(client, {
		action: "join-lobby-success",
		payload: { gameState: game.toClientGameState() }
	});
}

function exitLobby(client: WebSocket) {
	const game = removeFromGames(client);

	if (!game) return;

	sendLobby(client, {
		action: "exit-lobby-success",
		payload: { gameState: game.toClientGameState() }
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
	const game = clientToLobby.get(client);
	if (!game) {
		send(client, {
			action: "game-state-failure",
			payload: { message: "Vous n'êtes pas dans une partie" }
		});

		return;
	}
	send(client, {
		action: "game-state-success",
		payload: { gameState: game.toClientGameState() }
	});
}

function removeFromGames(client: WebSocket) {
	const game = clientToLobby.get(client);

	if (!game) return;

	game.removePlayer(client);

	if (game.isEmpty()) {
		gameLobbies.delete(game.code);
		return;
	}

	return game;
}

server.listen(PORT);
