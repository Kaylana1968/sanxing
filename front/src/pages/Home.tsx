import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { useLocation } from "wouter";
import type { Data } from "../types";

export default function Home() {
	const { socketRef, sendData } = useAppContext();
	const [, navigate] = useLocation();

	const [username, setUsername] = useState("");
	const [code, setCode] = useState("");

	useEffect(() => {
		if (!socketRef.current)
			socketRef.current = new WebSocket("ws://localhost:8000");

		function handleMessage(e: MessageEvent) {
			const { action, payload }: Data = JSON.parse(e.data);

			switch (action) {
				case "create-lobby-success":
					navigate(`/game/${payload.code}`);
					return;

				case "join-lobby-success":
					navigate(`/game/${payload.code}`);
					return;

				default:
					return;
			}
		}

		socketRef.current.addEventListener("message", handleMessage);

		return () => {
			socketRef.current?.removeEventListener("message", handleMessage);
		};
	}, [socketRef, navigate]);

	function createLobby(e: React.MouseEvent) {
		e.preventDefault();

		if (!username) {
			// Add some error handling
			return;
		}

		sendData({ action: "create-lobby", payload: { username } });
	}

	function joinLobby(e: React.MouseEvent) {
		e.preventDefault();

		if (!username) {
			// Add some error handling
			return;
		}

		sendData({ action: "join-lobby", payload: { code, username } });
	}

	return (
		<div className="absolute top-1/2 left-1/2 -translate-1/2 w-9/10 max-w-80 rounded-3xl flex flex-col gap-2 bg-slate-200 p-8">
			<div className="flex gap-2">
				<input
					type="text"
					placeholder="Ton nom"
					maxLength={12}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="border rounded-md w-3/4 border-slate-400 text-slate-700 placeholder:text-slate-400 h-8 outline-none px-2"
				/>

				<input
					type="text"
					placeholder="Code"
					maxLength={4}
					value={code}
					onChange={(e) => setCode(e.target.value)}
					className="border rounded-md w-1/4 border-slate-400 text-slate-700 placeholder:text-slate-400 h-8 outline-none text-center px-2"
				/>
			</div>

			<button
				type="button"
				onClick={createLobby}
				className="rounded-md mt-2 col-span-2 bg-amber-600 text-white text-base px-4 py-2 cursor-pointer"
			>
				Créer une partie
			</button>

			<button
				type="button"
				onClick={joinLobby}
				className="rounded-md col-span-2 bg-emerald-600 text-white text-base px-4 py-2 cursor-pointer"
			>
				Rejoindre avec un code
			</button>
		</div>
	);
}
