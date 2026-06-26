import type { ClientGameState, ClientPlayer, GameState } from "./types.ts";

export function getNewGame(code: string): {
	code: string;
	game: GameState;
} {
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
