import { useState } from "react";
import { useAppContext } from "../AppContext";

export default function Home() {
	const { sendData } = useAppContext();
	const [username, setUsername] = useState("");
	const [code, setCode] = useState("");

	function handleSubmit(e: React.MouseEvent) {
		e.preventDefault();

		if (!username) {
			// Add some error handling
			return;
		}

		sendData({ action: "create-lobby", payload: { username } });
	}

	return (
		<div className="absolute top-1/2 left-1/2 -translate-1/2 w-80 rounded-3xl flex flex-col gap-2 bg-slate-200 p-8">
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
				onClick={handleSubmit}
				className="rounded-md mt-2 col-span-2 bg-amber-600 text-white text-base px-4 py-2 cursor-pointer"
			>
				Créer une partie
			</button>
			<button
				type="button"
				onClick={handleSubmit}
				className="rounded-md col-span-2 bg-emerald-600 text-white text-base px-4 py-2 cursor-pointer"
			>
				Rejoindre avec un code
			</button>
		</div>
	);
}
