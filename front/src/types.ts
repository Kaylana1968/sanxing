export type Data =
	| { action: "create-lobby"; payload: { code: string } }
	| { action: "create-lobby-success"; payload: { code: string } }
	| { action: "create-lobby-failure"; payload: { message: string } }
	| { action: "check-lobby"; payload: { code: string } }
	| {
			action: "check-lobby-success";
			payload: { code: string; exists: boolean };
	  }
	| { action: "join-lobby"; payload: { username: string; code: string } }
	| { action: "join-lobby-success"; payload: { gameState: GameState } }
	| { action: "join-lobby-failure"; payload: { message: string } }
	| { action: "exit-lobby"; payload: null }
	| { action: "exit-lobby-success"; payload: { gameState: GameState } }
	| { action: "game-state"; payload: null }
	| { action: "game-state-success"; payload: { gameState: GameState } }
	| { action: "game-state-failure"; payload: { message: string } }
	| { action: "game-state-success"; payload: { gameState: GameState } }
	| { action: "play"; payload: unknown };

export type Player = { id: number; username: string };

export type GameState = {
	players: Player[];
	teams: [];
};
