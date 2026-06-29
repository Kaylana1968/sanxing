import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { GameState } from "../types";
import PlayerList from "../components/Lobby/PlayerList";
import Title from "../components/Lobby/Title";
import { getNewGameState } from "../utils";
import { useLocation } from "wouter";
import StartButton from "../components/Lobby/StartButton";
import TeamList from "../components/Lobby/TeamList";

export default function Lobby({ code }: { code: string }) {
	const [, navigate] = useLocation();

	const { socketRef, username, setSnackbarMessage } = useAppContext();
	const hasJoinedRef = useRef(false);
	const [gameState, setGameState] = useState<GameState>(getNewGameState(code));

	useEffect(() => {
		if (!username) {
			navigate(`/?code=${code}`, { replace: true });

			return;
		}

		const socket = socketRef.current;

		if (!hasJoinedRef.current) {
			socketRef.current.emit("join-lobby", { code, username });
		}

		socket.on("game-state", ({ gameState }) => setGameState(gameState));
		socket.on("start-game-failure", ({ message }) =>
			setSnackbarMessage(message)
		);
		socket.on("join-lobby-failure", ({ message }) => {
			navigate("/", { replace: true });
			setSnackbarMessage(message);
		});

		return () => {
			socket.off("game-state");
			socket.off("start-game-failure");
			socket.off("join-lobby-failure");
		};
	}, [navigate, username, setSnackbarMessage, socketRef, code]);

	return (
		<>
			<div className="flex flex-col items-center gap-2">
				<Title code={code} />

				<PlayerList players={gameState.players} />
				<TeamList teams={gameState.teams} />
			</div>

			<StartButton />
		</>
	);
}
