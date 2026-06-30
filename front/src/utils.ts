import type { GameState } from "./types";

export class State {
	static readonly LOBBYING = 0;
	static readonly PLAYING = 1;
}

export const localUsernameKey = "username";

export function getNewGameState(code: string): GameState {
	return {
		code,
		players: [],
		teams: [],
		state: State.LOBBYING,
		currentPlayer: null,
		firstPlace: null,
		secondPlace: null
	};
}
