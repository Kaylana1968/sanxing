import { useEffect, useRef, useState } from "react";
import Game from "./pages/Game";
import Home from "./pages/Home";
import { AppContext } from "./AppContext";
import type { Data, Screen } from "./types";

function App() {
	const [screen, setScreen] = useState<Screen>("home");
	const socketRef = useRef<WebSocket>(null);

	function navigate(screen: Screen) {
		setScreen(screen);
	}

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8000");
		socketRef.current = socket;

		socket.onopen = () => console.log("connected");
		socket.onmessage = e => {
			const data: Data = JSON.parse(e.data);

			switch (data.action) {
				case "join-room":
					navigate("game");
					return;

				default:
					return;
			}
		};

		return () => {
			socket!.close();
		};
	}, []);

	function sendData(data: Data) {
		if (!socketRef.current) {
			// Add some error handling
			return;
		}

		socketRef.current.send(JSON.stringify(data));
	}

	return (
		<AppContext.Provider value={{ navigate, sendData }}>
			<main className="">
				{screen === "game" ? <Game /> : screen === "home" && <Home />}
			</main>
		</AppContext.Provider>
	);
}

export default App;
