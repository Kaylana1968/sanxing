import type { ActionResponse, GameState } from "./types.ts";

export function createLobby(
	gameRooms: Map<string, GameState>,
	payload: { username: string; code: string }
): ActionResponse {
	const { username, code } = payload;
	const existingRoom = gameRooms.get(code);

	if (existingRoom)
		return {
			data: {
				action: "error",
				payload: { message: "Une partie avec ce code existe déjà" }
			},
			target: "sender"
		};

	gameRooms.set(code, { players: [{ username }], teams: [] });

	return {
		data: {
			action: "create-success",
			payload: { code }
		},
		target: "sender"
	};
}

export function joinLobby(
	gameRooms: Map<string, GameState>,
	payload: { username: string; code: string }
): ActionResponse {
	const { username, code } = payload;
	const existingRoom = gameRooms.get(code);

	if (!existingRoom)
		return {
			data: {
				action: "error",
				payload: { message: "Aucune partie avec ce code n'existe" }
			},
			target: "sender"
		};

	existingRoom.players.push({ username });

	return {
		data: {
			action: "join-success",
			payload: { code }
		},
		target: "sender"
	};
}
