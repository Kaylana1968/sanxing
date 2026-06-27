import type { ClientTeam } from "../types.ts";
import { Player } from "./Player.ts";

export class Team {
	private static nextId = 1;

	public readonly id: number;
	private players: Player[];
	private score: number;

	constructor() {
		this.id = Team.nextId++;
		this.players = [];
		this.score = 0;
	}

	public getPlayers() {
		return this.players;
	}

	public addPlayer(player: Player) {
		if (this.players.length > 4) return "L'équipe est déjà pleine";

		this.players.push(player);
		return;
	}

	public removePlayer(player: Player) {
		const playerIndex = this.players.findIndex(p => p === player);

		if (playerIndex === -1) return;

		this.players.splice(playerIndex, 1);
	}

	public isSameSize(team: Team) {
		return this.players.length === team.getPlayers().length;
	}

	public hasEnoughPlayers() {
		return this.players.length >= 2;
	}

	public toClientTeam(): ClientTeam {
		return {
			id: this.id,
			players: this.players.map(p => p.toClientOtherPlayer()),
			score: this.score
		};
	}
}
