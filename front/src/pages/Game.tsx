import { useAppContext } from "../AppContext";

export default function Game() {
	const { sendData } = useAppContext();

	return (
		<div className="bg-red-500 size-20">
			<button
				onClick={() => sendData({ action: "Bouton cliqué", payload: {} })}
			>
				Beute
			</button>
		</div>
	);
}
