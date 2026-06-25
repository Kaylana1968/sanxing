import { useEffect } from "react";
import { useAppContext } from "../AppContext";
import type { Data } from "../types";

export default function Game({ code }: { code: string }) {
	const { socketRef, sendData } = useAppContext();

	useEffect(() => {
		if (!socketRef.current)
			socketRef.current = new WebSocket("ws://localhost:8000");

		if (socketRef.current.readyState === WebSocket.OPEN) {
			sendData({ action: "game-state", payload: null });
		}

		function handleMessage(e: MessageEvent) {
			const { action, payload }: Data = JSON.parse(e.data);

			switch (action) {
				case "game-state-success":
					console.log(payload);
					return;

				default:
					return;
			}
		}

		socketRef.current.addEventListener("message", handleMessage);

		return () => {
			socketRef.current?.removeEventListener("message", handleMessage);
		};
	}, [sendData, socketRef]);

	return (
		<div className="bg-red-500 size-20">
			Partie {code}
			<button onClick={() => sendData({ action: "play", payload: {} })}>
				Beute
			</button>
		</div>
	);
}
