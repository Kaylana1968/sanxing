import type { Card } from "./types.ts";

export function areSameCards(card1: Card, card2: Card) {
	return card1.value === card2.value && card1.color === card2.color;
}
