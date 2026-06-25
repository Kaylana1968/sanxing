export type Data =
	| { action: "error"; payload: { message: string } }
	| { action: "create-lobby"; payload: { username: string } }
	| { action: "create-lobby-success"; payload: { code: string } }
	| { action: "join-lobby"; payload: { username: string; code: string } }
	| { action: "join-lobby-success"; payload: { code: string } }
	| { action: "join-lobby-failure"; payload: { message: string } }
	| { action: "game-state"; payload: null }
	| { action: "game-state-success"; payload: { gameState: GameState } }
	| { action: "game-state-failure"; payload: { message: string } }
	| { action: "game-state-success"; payload: { gameState: GameState } }
	| { action: "play"; payload: unknown };

export type Player = { username: string };

export type GameState = {
	players: Player[];
	teams: [];
};
