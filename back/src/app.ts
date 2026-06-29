import http from "http";
import { Game } from "./classes/Game.ts";
import { Player } from "./classes/Player.ts";
import { Server } from "socket.io";
import type {
	ClientSocket,
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData
} from "./types.ts";

const PORT = 8000;

const server = http.createServer((_req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Game Server Socket Transport Layer Only");
});
const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(server, {
	connectionStateRecovery: {},
	cors: {
		origin: "*"
	}
});

const gameRooms = new Map<string, Game>();

io.on("connection", socket => {
	socket.onAny(payload => console.log("received", payload));
	socket.on("create-lobby", payload => createLobby(socket, payload));
	socket.on("join-lobby", payload => joinLobby(socket, payload));
	socket.on("exit-lobby", () => exitLobby(socket));
	socket.on("check-lobby", payload => checkLobby(socket, payload));
	socket.on("join-team", payload => joinTeam(socket, payload));
	socket.on("start-game", () => startGame(socket));

	socket.on("disconnect", () => {
		const game = removeFromGames(socket);

		if (!game) return;

		game.sendGameState();
	});
});

function createLobby(socket: ClientSocket, payload: { code: string }) {
	const { code } = payload;

	if (io.sockets.adapter.rooms.has(code)) {
		socket.emit("create-lobby-failure", { message: "Le code est déjà pris" });
		return;
	}

	const game = new Game(code);
	gameRooms.set(code, game);

	socket.emit("create-lobby-success", { code });
}

function joinLobby(
	socket: ClientSocket,
	payload: { code: string; username: string }
) {
	const { code, username } = payload;

	const game = gameRooms.get(code);
	if (!game) {
		socket.emit("join-lobby-failure", { message: "La partie n'existe pas" });
		return;
	}

	if (socket.rooms.has(code)) {
		return;
	}

	socket.join(code);
	socket.data.username = username;
	socket.data.gameCode = code;
	game.addPlayer(new Player(socket, username));

	game.sendGameState();
}

function exitLobby(socket: ClientSocket) {
	const game = removeFromGames(socket);

	if (!game) return;

	game.sendGameState();
}

function joinTeam(socket: ClientSocket, payload: { teamId: number }) {
	const code = socket.data.gameCode;

	if (!code) {
		socket.emit("join-team-failure", { message: "You are not in a game" });
		return;
	}

	const game = gameRooms.get(code);

	if (!game) {
		socket.emit("join-team-failure", { message: "Your game doesn't exist" });
		return;
	}

	const { teamId } = payload;
	const team = game.getTeamById(teamId);
	if (!team) {
		socket.emit("join-team-failure", { message: "The team doesn't exist" });
		return;
	}

	const player = game.getPlayerBySocket(socket);
	if (!player) {
		socket.emit("join-team-failure", { message: "You don't exist" });
		return;
	}

	game.addPlayerToTeam(player, team);
	game.sendGameState();
}

function startGame(socket: ClientSocket) {
	const code = socket.data.gameCode;

	if (!code) {
		socket.emit("start-game-failure", { message: "You are not in a game" });
		return;
	}

	const game = gameRooms.get(code);

	if (!game) {
		socket.emit("start-game-failure", { message: "Your game doesn't exist" });
		return;
	}

	const error = game.start();
	if (error) {
		socket.emit("start-game-failure", { message: error });
		return;
	}

	game.sendGameState();
}

function checkLobby(socket: ClientSocket, payload: { code: string }) {
	const { code } = payload;

	socket.emit("check-lobby-success", { code, exists: gameRooms.has(code) });
}

function removeFromGames(socket: ClientSocket) {
	const code = socket.data.gameCode;

	if (!code) return;

	const game = gameRooms.get(code);

	if (!game) return;

	socket.leave(code);
	delete socket.data.gameCode;
	game.removePlayer(socket);

	const playersInRoom = io.sockets.adapter.rooms.get(game.code)?.size ?? 0;

	if (playersInRoom === 0) {
		gameRooms.delete(game.code);
	}

	return game;
}

server.listen(PORT);
