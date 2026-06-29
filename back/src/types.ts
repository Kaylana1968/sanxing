import { Socket } from "socket.io";

export interface ClientToServerEvents {
	"create-lobby": (payload: { code: string }) => void;
	"join-lobby": (payload: { code: string; username: string }) => void;
	"exit-lobby": () => void;
	"check-lobby": (payload: { code: string }) => void;
	"join-team": (payload: { teamId: number }) => void;
	"start-game": () => void;
}

export interface ServerToClientEvents {
	"game-state": (payload: { gameState: ClientGameState }) => void;
	"create-lobby-failure": (payload: { message: string }) => void;
	"create-lobby-success": (payload: { code: string }) => void;
	"check-lobby-success": (payload: { code: string; exists: boolean }) => void;
	"join-lobby-failure": (payload: { message: string }) => void;
	"join-team-failure": (payload: { message: string }) => void;
	"start-game-failure": (payload: { message: string }) => void;
}

export interface InterServerEvents {}

export interface SocketData {
	username?: string;
	gameCode?: string;
}

export type ClientSocket = Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;

export type CardColor = "spades" | "hearts" | "clubs" | "diamonds";
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Card =
	| { value: CardValue; color: CardColor }
	| { value: 14 | 15; color: null };

export type ClientSelfPlayer = ClientOtherPlayer & {
	cards: Card[];
};
export type ClientOtherPlayer = {
	id: number;
	username: string;
	nextPlayer: { username: string } | null;
};
export type ClientPlayer = ClientSelfPlayer | ClientOtherPlayer;

export type ClientTeam = {
	id: number;
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
