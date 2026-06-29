import { Player } from "./Player.ts";
import { Team } from "./Team.ts";
import { distributeCards, getRandomInt, orderPlayers } from "../utils.ts";
import { Socket } from "socket.io";

export class Game {
	static readonly LOBBYING = 0;
	static readonly PLAYING = 1;

	public readonly code: string;
	private state: 0 | 1;
	private players: Player[];
	private teams: Team[];
	private currentPlayer: Player | null;
	private firstPlace: Player | null;
	private secondPlace: Player | null;

	constructor(code: string) {
		this.code = code;
		this.state = Game.LOBBYING;
		this.players = [];
		this.teams = [new Team(), new Team()];
		this.currentPlayer = null;
		this.firstPlace = null;
		this.secondPlace = null;
	}

	public getPlayers() {
		return this.players;
	}

	public addPlayer(player: Player) {
		this.players.push(player);
	}

	public getPlayerBySocket(socket: Socket) {
		return this.players.find(p => p.socket === socket);
	}

	public removePlayer(socket: Socket) {
		const playerIndex = this.players.findIndex(p => p.socket === socket);

		if (playerIndex === -1) return;

		this.players.splice(playerIndex, 1);
	}

	public addPlayerToTeam(player: Player, team: Team) {
		this.teams.forEach(t => t.removePlayer(player));
		team.addPlayer(player);
	}

	public getTeamById(teamId: number) {
		return this.teams.find(team => team.id === teamId);
	}

	public start() {
		if (!this.teams[0].isSameSize(this.teams[1]))
			return "Les équipes ne sont pas de la même taille";
		if (!this.teams[0].hasEnoughPlayers())
			return "Il faut au moins 2 joueurs par équipe";
		if (this.state === Game.PLAYING) return "La partie a déjà commencé";

		const allPlayers = orderPlayers(this.teams[0], this.teams[1]);
		distributeCards(allPlayers, this.firstPlace);
		this.currentPlayer = allPlayers[getRandomInt(allPlayers.length)];

		this.state = Game.PLAYING;
		this.firstPlace = null;
		this.secondPlace = null;

		return;
	}

	public sendGameState() {
		console.log("sending game state");
		for (const player of this.players) {
			player.socket.emit("game-state", {
				gameState: {
					code: this.code,
					players: this.players.map(p =>
						p === player ? p.toClientSelfPlayer() : p.toClientOtherPlayer()
					),
					teams: this.teams.map(t => t.toClientTeam()),
					currentPlayer: this.currentPlayer?.toClientOtherPlayer() ?? null,
					firstPlace: this.firstPlace?.toClientOtherPlayer() ?? null,
					secondPlace: this.secondPlace?.toClientOtherPlayer() ?? null
				}
			});
		}
	}
}
