import { Player } from "./classes/Player.ts";
import { Team } from "./classes/Team.ts";
import type { Card, CardColor, CardValue } from "./types.ts";

export function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

export function areSameCards(card1: Card, card2: Card) {
	return card1.value === card2.value && card1.color === card2.color;
}

const cardValues: CardValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const cardColors: CardColor[] = ["spades", "hearts", "clubs", "diamonds"];

const threeDecks: Card[] = Array.from({ length: 3 }).flatMap(() => [
	...cardValues.flatMap(v => cardColors.map(c => ({ value: v, color: c }))),
	{ value: 14, color: null },
	{ value: 15, color: null }
]);

function shuffle(array: Array<unknown>) {
	let currentIndex = array.length;

	while (currentIndex > 1) {
		let randomIndex = getRandomInt(currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex]
		];
	}
}

export function getShuffledCards() {
	shuffle(threeDecks);
	return [...threeDecks];
}

export function orderPlayers(team1: Team, team2: Team) {
	const players: Player[] = [];
	const team1Players = team1.getPlayers();
	const team2Players = team2.getPlayers();
	for (let i = 0; i < team1Players.length; i++) {
		const player1 = team1Players[i];
		const player2 = team2Players[i];

		player1.setNextPlayer(player2);
		player2.setNextPlayer(team1Players[(i + 1) % team1Players.length]);

		players.push(player1, player2);
	}

	return players;
}

export function distributeCards(players: Player[], starter: Player | null) {
	starter ??= players[getRandomInt(players.length)];

	const cards = getShuffledCards();
	const cardsPerPlayer = Math.floor(cards.length / players.length);
	let additionalCards = cards.length % players.length;

	let cardIndex = 0;
	let currentPlayer = starter;
	do {
		const cardsToAdd = cardsPerPlayer + (additionalCards > 0 ? 1 : 0);
		additionalCards--;
		currentPlayer.setCards(cards.slice(cardIndex, cardIndex + cardsToAdd));

		cardIndex += cardsToAdd;
		currentPlayer = currentPlayer.getNextPlayer()!;
	} while (currentPlayer !== starter);
}
