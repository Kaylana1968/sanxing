import { useEffect } from "react";
import { useAppContext } from "../AppContext";
import type { Data } from "../types";

export default function Game({ code }: { code: string }) {
	const { socketRef, sendData } = useAppContext();

	useEffect(() => {
		if (!socketRef.current) return;

		socketRef.current.onmessage = (e) => {
			const data: Data = JSON.parse(e.data);

			switch (data.action) {
				case "game-state":
					console.log(data.payload);
					return;

				default:
					return;
			}
		};
	}, [code, sendData, socketRef]);

	return (
		<div className="bg-red-500 size-20">
			Partie {code}
			<button onClick={() => sendData({ action: "play", payload: {} })}>
				Beute
			</button>
		</div>
	);
}
