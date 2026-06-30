import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { GameState } from "../types";
import { getNewGameState, State } from "../utils";
import { useLocation } from "wouter";
import Lobby from "../components/Lobby";
import Game from "../components/Game";

export default function Room({ code }: { code: string }) {
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

	return gameState.state === State.LOBBYING ? (
		<Lobby gameState={gameState} />
	) : (
		<Game gameState={gameState} />
	);
}
