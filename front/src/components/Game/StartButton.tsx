import { useAppContext } from "../../context/AppContext";

export default function StartButton() {
	const { sendData } = useAppContext();

	function handleClick() {
		sendData({ action: "start-game", payload: null });
	}

	return (
		<div className="flex items-center justify-center mt-2 p-2 border-t border-t-slate-300">
			<button
				type="button"
				onClick={handleClick}
				className="bg-emerald-500 text-white px-3 py-1 rounded"
			>
				Jouer
			</button>
		</div>
	);
}
