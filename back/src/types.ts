export type Data =
	| { action: "error"; payload: { message: string } }
	| { action: "create-lobby"; payload: { code: string } }
	| { action: "create-lobby-success"; payload: { code: string } }
	| { action: "create-lobby-failure"; payload: { message: string } }
	| { action: "check-lobby"; payload: { code: string } }
	| {
			action: "check-lobby-success";
			payload: { code: string; exists: boolean };
	  }
	| { action: "join-lobby"; payload: { username: string; code: string } }
	| { action: "join-lobby-success"; payload: { gameState: ClientGameState } }
	| { action: "join-lobby-failure"; payload: { message: string } }
	| { action: "exit-lobby"; payload: null }
	| { action: "exit-lobby-success"; payload: { gameState: ClientGameState } }
	| { action: "game-state"; payload: null }
	| { action: "game-state-success"; payload: { gameState: ClientGameState } }
	| { action: "game-state-failure"; payload: { message: string } }
	| { action: "play"; payload: unknown };

export type CardColor = "spades" | "hearts" | "clubs" | "diamonds";
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Card = { value: CardValue; color: CardColor };

export type ClientSelfPlayer = ClientOtherPlayer & {
	cards: Card[];
};
export type ClientOtherPlayer = {
	username: string;
	nextPlayer: { username: string } | null;
};
export type ClientPlayer = ClientSelfPlayer | ClientOtherPlayer;

export type ClientTeam = {
	players: ClientPlayer[];
	score: number;
};

export type ClientGameState = {
	code: string;
	players: ClientPlayer[];
	teams: ClientTeam[];
	currentPlayer: ClientPlayer | null;
	firstPlace: ClientPlayer | null;
	secondPlace: ClientPlayer | null;
};
