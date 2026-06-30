import { useAppContext } from "../../context/AppContext";

export default function StartButton() {
	const { socketRef } = useAppContext();

	function handleClick() {
		socketRef.current.emit("start-game");
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className="fixed bottom-4 left-1/2 -translate-x-1/2 cursor-pointer bg-linear-to-br from-amber-400 to-red-500 text-white text-2xl px-8 py-3 rounded-full shadow-lg/30"
		>
			Jouer
		</button>
	);
}
