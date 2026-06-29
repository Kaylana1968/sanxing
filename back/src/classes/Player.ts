import type {
	Card,
	ClientOtherPlayer,
	ClientSelfPlayer,
	ClientSocket
} from "../types.ts";
import { areSameCards } from "../utils.ts";

export class Player {
	private static nextId = 1;

	public readonly id: number;
	public readonly socket: ClientSocket;
	public readonly username: string;
	private cards: Card[];
	private nextPlayer: Player | null;

	constructor(socket: ClientSocket, username: string) {
		this.id = Player.nextId++;
		this.socket = socket;
		this.username = username;
		this.cards = [];
		this.nextPlayer = null;
	}

	public hasCards(...cards: Card[]) {
		for (const card of cards) {
			if (!this.cards.some(c => areSameCards(c, card))) return false;
		}

		return true;
	}

	public setCards(cards: Card[]) {
		this.cards = cards;
	}

	public getNextPlayer() {
		return this.nextPlayer;
	}

	public setNextPlayer(nextPlayer: Player) {
		this.nextPlayer = nextPlayer;
	}

	public toClientSelfPlayer(): ClientSelfPlayer {
		return {
			id: this.id,
			username: this.username,
			nextPlayer: this.nextPlayer
				? { username: this.nextPlayer.username }
				: null,
			cards: this.cards
		};
	}

	public toClientOtherPlayer(): ClientOtherPlayer {
		return {
			id: this.id,
			username: this.username,
			nextPlayer: this.nextPlayer
				? { username: this.nextPlayer.username }
				: null
		};
	}
}
