import type { ClientGameState, ClientPlayer, GameState } from "./types.ts";

export function getNewGame(code: string): GameState {
	return { code, players: [], teams: [] };
}

export function formatGameState(gameState: GameState): ClientGameState {
	return {
		players: gameState.players.map<ClientPlayer>((p) => ({
			username: p.username
		})),
		teams: gameState.teams
	};
}
