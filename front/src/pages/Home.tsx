import { useAppContext } from "../AppContext";

export default function Home() {
	const { sendData } = useAppContext();

	function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();

		const formData = new FormData(e.target);

		const username = formData.get("username")?.toString();
		const code = formData.get("code")?.toString();

		if (!username) {
			// Add some error handling
			return;
		}

		if (!code) {
			// Add some error handling
			return;
		}

		sendData({ action: "create-lobby", payload: { username, code } });
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="absolute top-1/2 left-1/2 -translate-1/2 w-100 rounded-3xl flex flex-col bg-slate-200 p-8"
		>
			<div className="flex gap-4">
				<input
					type="text"
					name="username"
					placeholder="Ton nom"
					className="border rounded-md w-3/5 border-slate-400 h-12 outline-none text-center"
				/>
				<input
					type="text"
					name="code"
					placeholder="Code"
					maxLength={8}
					className="border rounded-md w-2/5 border-slate-400 h-12 outline-none text-center"
				/>
			</div>

			<button className="rounded-lg mt-4 bg-amber-600 text-white text-xl px-8 py-4 cursor-pointer">
				Créer
			</button>
		</form>
	);
}
