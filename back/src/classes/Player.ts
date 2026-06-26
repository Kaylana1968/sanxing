import { WebSocket } from "ws";
import type { Card, ClientOtherPlayer, ClientSelfPlayer } from "../types.ts";
import { areSameCards } from "../utils.ts";

export class Player {
	public readonly webSocket: WebSocket;
	public readonly username: string;
	private cards: Card[];

	constructor(webSocket: WebSocket, username: string) {
		this.webSocket = webSocket;
		this.username = username;
		this.cards = [];
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

	public toClientSelfPlayer(): ClientSelfPlayer {
		return { username: this.username, cards: this.cards };
	}

	public toClientOtherPlayer(): ClientOtherPlayer {
		return { username: this.username };
	}
}
