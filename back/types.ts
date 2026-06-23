export type Data = { action: string; payload: unknown };

export type GameState = {
	players: { username: string }[];
	teams: [];
};
