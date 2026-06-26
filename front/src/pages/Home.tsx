import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "wouter";
import { useAppContext } from "../context/AppContext";
import type { Data } from "../types";
import { getNewWebsocket, localUsernameKey } from "../utils";

export default function Home() {
	const [, navigate] = useLocation();
	const [searchParams] = useSearchParams();

	const { socketRef, username, setUsername, sendData } = useAppContext();

	const [code, setCode] = useState(searchParams.get("code") ?? "");
	const [error, setError] = useState("");

	useEffect(() => {
		if (!socketRef.current) socketRef.current = getNewWebsocket();

		const socket = socketRef.current;

		function handleMessage(e: MessageEvent) {
			const { action, payload }: Data = JSON.parse(e.data);

			switch (action) {
				case "create-lobby-success":
					navigate(`/game/${payload.code}`);
					break;

				case "create-lobby-failure":
					setError("Une partie avec ce code existe déjà");
					break;

				case "check-lobby-success":
					if (payload.exists) navigate(`/game/${payload.code}`);
					else setError("Le code ne correspond à aucune partie");
					break;

				default:
					break;
			}
		}

		socket.addEventListener("message", handleMessage);

		return () => {
			socket.removeEventListener("message", handleMessage);
		};
	}, [socketRef, navigate]);

	function validateFields() {
		if (!username) {
			setError("Vous avez oublié votre nom !");
			return false;
		}
		localStorage.setItem(localUsernameKey, username);

		if (!code) {
			setError("Vous avez oublié le code !");
			return false;
		}

		return true;
	}

	function handleClick(action: "create-lobby" | "check-lobby") {
		return (e: React.MouseEvent) => {
			e.preventDefault();

			if (!validateFields()) return;

			sendData({ action, payload: { code } });
		};
	}

	return (
		<div className="flex items-center justify-center h-full">
			<div className="max-w-80 rounded-3xl flex flex-col gap-2 bg-slate-200 p-8 shadow-lg">
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Ton nom"
						maxLength={12}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="border rounded-md w-3/4 border-slate-400 text-slate-700 placeholder:text-slate-400 h-8 outline-none px-2 shadow-sm"
					/>

					<input
						type="text"
						placeholder="Code"
						maxLength={4}
						value={code}
						onChange={(e) => setCode(e.target.value)}
						className="border rounded-md w-1/4 border-slate-400 text-slate-700 placeholder:text-slate-400 h-8 outline-none text-center px-2 shadow-sm"
					/>
				</div>

				{error && <i className="text-red-500">{error}</i>}

				<button
					type="button"
					onClick={handleClick("create-lobby")}
					className="rounded-md mt-2 col-span-2 bg-amber-600 text-white text-base px-4 py-2 cursor-pointer shadow-lg"
				>
					Créer une partie
				</button>

				<button
					type="button"
					onClick={handleClick("check-lobby")}
					className="rounded-md col-span-2 bg-emerald-600 text-white text-base px-4 py-2 cursor-pointer shadow-lg"
				>
					Rejoindre avec un code
				</button>
			</div>
		</div>
	);
}
