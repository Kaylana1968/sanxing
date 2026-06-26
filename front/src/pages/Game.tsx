import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { GameState, Data } from "../types";
import PlayerList from "../components/Game/PlayerList";
import Title from "../components/Game/Title";
import { localUsernameKey } from "../utils";
import { useLocation } from "wouter";

export default function Game({ code }: { code: string }) {
	const [, navigate] = useLocation();

	const { socketRef, sendData, setSnackbarMessage } = useAppContext();
	const hasJoinedRef = useRef(false);
	const [gameState, setGameState] = useState<GameState>({
		players: [],
		teams: []
	});

	const joinLobby = useCallback(() => {
		if (hasJoinedRef.current) return;

		const username = localStorage.getItem(localUsernameKey)!;

		hasJoinedRef.current = true;
		sendData({
			action: "join-lobby",
			payload: { username, code }
		});
	}, [sendData, code]);

	useEffect(() => {
		const storedUsername = localStorage.getItem(localUsernameKey);
		if (!storedUsername) {
			navigate(`/?code=${code}`, { replace: true });

			return;
		}

		if (!socketRef.current)
			socketRef.current = new WebSocket("ws://localhost:8000");

		const socket = socketRef.current;

		if (socket.readyState === WebSocket.OPEN) joinLobby();
		else socket.addEventListener("open", joinLobby);

		function handleMessage(e: MessageEvent) {
			const { action, payload }: Data = JSON.parse(e.data);

			switch (action) {
				case "join-lobby-success":
				case "exit-lobby-success":
				case "game-state-success":
					setGameState(payload.gameState);
					break;

				case "join-lobby-failure":
					navigate("/", { replace: true });
					setSnackbarMessage(payload.message);
					break;

				default:
					break;
			}
		}

		socket.addEventListener("message", handleMessage);

		return () => {
			socket.removeEventListener("open", joinLobby);
			socket.removeEventListener("message", handleMessage);
		};
	}, [navigate, setSnackbarMessage, joinLobby, socketRef, code]);

	return (
		<div className="flex justify-center">
			<div className="bg-slate-200 w-full rounded-2xl border border-slate-300">
				<Title code={code} />
				<PlayerList players={gameState.players} />
			</div>
		</div>
	);
}
