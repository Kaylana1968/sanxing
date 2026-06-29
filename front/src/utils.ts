import type { GameState } from "./types";

export const localUsernameKey = "username";

export function getNewGameState(code: string): GameState {
	return {
		code,
		players: [],
		teams: [],
		currentPlayer: null,
		firstPlace: null,
		secondPlace: null
	};
}
