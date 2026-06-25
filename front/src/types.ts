export type Data =
	| { action: "error"; payload: { message: string } }
	| { action: "create-lobby"; payload: { username: string } }
	| { action: "create-success"; payload: { code: string } }
	| { action: "join-lobby"; payload: { username: string; code: string } }
	| { action: "join-success"; payload: { code: string } }
	| { action: "game-state"; payload: { gameState: GameState } }
	| { action: "play"; payload: unknown };

export type GameState = {
	players: { username: string }[];
	teams: [];
};
