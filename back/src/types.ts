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

export type CardColor = "spades" | "hearts" | "diamonds" | "clubs";
export type Card = { value: number; color: CardColor };

export type ClientSelfPlayer = { username: string; cards: Card[] };
export type ClientOtherPlayer = { username: string };
export type ClientPlayer = ClientSelfPlayer | ClientOtherPlayer;

export type ClientSelfGameState = {
	code: string;
	players: ClientSelfPlayer[];
	teams: [];
};
export type ClientOtherGameState = {
	code: string;
	players: ClientOtherPlayer[];
	teams: [];
};
export type ClientGameState = ClientSelfGameState | ClientOtherGameState;
