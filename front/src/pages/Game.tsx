import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { GameState, Data } from "../types";
import PlayerList from "../components/Game/PlayerList";
import Title from "../components/Game/Title";
import { getNewGameState, getNewWebsocket } from "../utils";
import { useLocation } from "wouter";
import StartButton from "../components/Game/StartButton";
import TeamList from "../components/Game/TeamList";

export default function Game({ code }: { code: string }) {
	const [, navigate] = useLocation();

	const { socketRef, username, sendData, setSnackbarMessage } = useAppContext();
	const hasJoinedRef = useRef(false);
	const [gameState, setGameState] = useState<GameState>(getNewGameState(code));

	const joinLobby = useCallback(() => {
		if (hasJoinedRef.current) return;

		hasJoinedRef.current = true;
		sendData({
			action: "join-lobby",
			payload: { username, code }
		});
	}, [sendData, username, code]);

	useEffect(() => {
		if (!username) {
			navigate(`/?code=${code}`, { replace: true });

			return;
		}

		if (!socketRef.current) socketRef.current = getNewWebsocket();

		const socket = socketRef.current;

		if (socket.readyState === WebSocket.OPEN) joinLobby();
		else socket.addEventListener("open", joinLobby);

		function handleMessage(e: MessageEvent) {
			const { action, payload }: Data = JSON.parse(e.data);

			switch (action) {
				case "game-state":
					setGameState(payload.gameState);
					console.log(payload.gameState);
					break;

				case "start-game-failure":
					setSnackbarMessage(payload.message);
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
	}, [navigate, username, setSnackbarMessage, joinLobby, socketRef, code]);

	return (
		<div className="flex justify-center">
			<div className="bg-slate-200 w-full rounded-2xl border border-slate-300">
				<Title code={code} />
				<PlayerList players={gameState.players} />
				<TeamList teams={gameState.teams} />
				<StartButton />
			</div>
		</div>
	);
}
