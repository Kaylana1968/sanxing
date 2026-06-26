import type { ClientGameState, ClientPlayer, GameState } from "./types.ts";

const characters =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomString(length = 4) {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * characters.length)];
	}

	return result;
}

export function getNewGame(gameRooms: Map<string, GameState>): {
	code: string;
	game: GameState;
} {
	let code: string;
	do {
		code = getRandomString();
	} while (gameRooms.has(code));

	return { code, game: { players: [], teams: [] } };
}

export function formatGameState(gameState: GameState): ClientGameState {
	return {
		players: gameState.players.map<ClientPlayer>((p) => ({
			id: p.id,
			username: p.username
		})),
		teams: gameState.teams
	};
}
