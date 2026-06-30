export interface ClientToServerEvents {
	"create-lobby": (payload: { code: string }) => void;
	"join-lobby": (payload: { code: string; username: string }) => void;
	"exit-lobby": () => void;
	"check-lobby": (payload: { code: string }) => void;
	"join-team": (payload: { teamId: number }) => void;
	"start-game": () => void;
}

export interface ServerToClientEvents {
	"game-state": (payload: { gameState: GameState }) => void;
	"create-lobby-failure": (payload: { message: string }) => void;
	"create-lobby-success": (payload: { code: string }) => void;
	"check-lobby-success": (payload: { code: string; exists: boolean }) => void;
	"join-lobby-failure": (payload: { message: string }) => void;
	"join-team-failure": (payload: { message: string }) => void;
	"start-game-failure": (payload: { message: string }) => void;
}

export type CardColor = "spades" | "hearts" | "clubs" | "diamonds";
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Card =
	| { value: CardValue; color: CardColor }
	| { value: 14 | 15; color: null };

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
	state: 0 | 1;
	currentPlayer: Player | null;
	firstPlace: Player | null;
	secondPlace: Player | null;
};
