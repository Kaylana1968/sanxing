import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "wouter";
import { useAppContext } from "../context/AppContext";
import { localUsernameKey } from "../utils";

const codeRegex = /^[a-zA-Z0-9]+$/;

export default function Home() {
	const [, navigate] = useLocation();
	const [searchParams] = useSearchParams();

	const { socketRef, username, setUsername } = useAppContext();

	const [code, setCode] = useState(searchParams.get("code") ?? "");
	const [error, setError] = useState("");

	useEffect(() => {
		const socket = socketRef.current;

		socket.on("create-lobby-success", ({ code }) => navigate(`/lobby/${code}`));
		socket.on("create-lobby-failure", () =>
			setError("Une partie avec ce code existe déjà")
		);
		socket.on("check-lobby-success", ({ exists, code }) =>
			exists
				? navigate(`/lobby/${code}`)
				: setError("Le code ne correspond à aucune partie")
		);

		return () => {
			socket.off("create-lobby-success");
			socket.off("create-lobby-failure");
			socket.off("check-lobby-success");
		};
	}, [socketRef, navigate]);

	function validateFields() {
		if (!username) {
			setError("Vous avez oublié votre nom !");
			return false;
		}
		localStorage.setItem(localUsernameKey, username);

		if (!codeRegex.test(code)) {
			setError("Le code est invalide");
			return false;
		}

		return true;
	}

	function handleClick(action: "create-lobby" | "check-lobby") {
		if (!validateFields()) return;

		socketRef.current?.emit(action, { code });
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
						onChange={e => setUsername(e.target.value)}
						className="border rounded-md w-3/4 border-slate-400 text-slate-700 placeholder:text-slate-400 h-8 outline-none px-2 shadow-sm"
					/>

					<input
						type="text"
						placeholder="Code"
						maxLength={4}
						value={code}
						onChange={e => setCode(e.target.value)}
						className="border rounded-md w-1/4 border-slate-400 text-slate-700 placeholder:text-slate-400 h-8 outline-none text-center px-2 shadow-sm"
					/>
				</div>

				{error && <i className="text-red-500">{error}</i>}

				<button
					type="button"
					onClick={() => handleClick("create-lobby")}
					className="rounded-md mt-2 col-span-2 bg-amber-600 text-white text-base px-4 py-2 cursor-pointer shadow-lg"
				>
					Créer une partie
				</button>

				<button
					type="button"
					onClick={() => handleClick("check-lobby")}
					className="rounded-md col-span-2 bg-emerald-600 text-white text-base px-4 py-2 cursor-pointer shadow-lg"
				>
					Rejoindre avec un code
				</button>
			</div>
		</div>
	);
}
