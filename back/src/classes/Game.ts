import { WebSocket } from "ws";
import { Player } from "./Player.ts";
import type { ClientOtherGameState, ClientSelfGameState } from "../types.ts";

export class Game {
	public readonly code: string;
	private players: Player[];
	private teams: [];

	constructor(code: string) {
		this.code = code;
		this.players = [];
		this.teams = [];
	}

	public getPlayers() {
		return this.players;
	}

	public addPlayer(player: Player) {
		this.players.push(player);
	}

	public removePlayer(webSocket: WebSocket) {
		this.players.splice(this.players.findIndex(p => p.webSocket === webSocket));
	}

	public isEmpty() {
		return this.players.length === 0;
	}

	public toSelfClientGameState(): ClientSelfGameState {
		return {
			code: this.code,
			players: this.players.map(p => p.toClientSelfPlayer()),
			teams: this.teams
		};
	}

	public toOtherClientGameState(): ClientOtherGameState {
		return {
			code: this.code,
			players: this.players.map(p => p.toClientOtherPlayer()),
			teams: this.teams
		};
	}
}
