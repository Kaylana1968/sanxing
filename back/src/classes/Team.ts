import { Player } from "./Player.ts";

export class Team {
	private players: Player[];
	private score: number;

	constructor() {
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
		this.players.splice(this.players.findIndex(p => p === player));
	}

	public isSameSize(team: Team) {
		return this.players.length === team.getPlayers().length;
	}

	public hasEnoughPlayers() {
		return this.players.length >= 2;
	}

	public toClientTeam() {
		return {
			players: this.players.map(p => p.toClientOtherPlayer()),
			score: this.score
		};
	}
}
