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
	| { action: "join-lobby-failure"; payload: { message: string } }
	| { action: "exit-lobby"; payload: null }
	| { action: "join-team"; payload: { teamId: number } }
	| { action: "join-team-failure"; payload: { message: string } }
	| { action: "start-game"; payload: null }
	| { action: "start-game-failure"; payload: { message: string } }
	| { action: "game-state"; payload: { gameState: GameState } }
	| { action: "play"; payload: unknown };

export type CardColor = "spades" | "hearts" | "clubs" | "diamonds";
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Card = { value: CardValue; color: CardColor };

export type Player = {
	id: number;
	username: string;
	cards?: Card[];
	nextPlayer: { username: string } | null;
};

export type Team = {
	id: number;
	players: Player[];
	score: number;
};

export type GameState = {
	code: string;
	players: Player[];
	teams: Team[];
	currentPlayer: Player | null;
	firstPlace: Player | null;
	secondPlace: Player | null;
};
