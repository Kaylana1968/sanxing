import { useEffect, useRef } from "react";
import Game from "./pages/Game";
import Home from "./pages/Home";
import { AppContext } from "./AppContext";
import type { Data } from "./types";
import { Route, Switch, useLocation } from "wouter";

function App() {
	const [location, navigate] = useLocation();
	const socketRef = useRef<WebSocket>(null);

	useEffect(() => {
		socketRef.current = new WebSocket("ws://localhost:8000");

		socketRef.current.onmessage = e => {
			const data: Data = JSON.parse(e.data);

			switch (data.action) {
				case "create-success":
					navigate(`/game/${data.payload.code}`);
					return;

				default:
					return;
			}
		};

		return () => {
			socketRef.current!.close();
		};
	}, [navigate]);

	function sendData(data: Data) {
		if (!socketRef.current) {
			// Add some error handling
			return;
		}

		socketRef.current.send(JSON.stringify(data));
	}

	console.log(location);

	return (
		<AppContext.Provider value={{ socketRef, sendData }}>
			<main className="">
				<Switch>
					<Route path="/">
						<Home />
					</Route>

					<Route path="/game/:code">{({ code }) => <Game code={code} />}</Route>

					<Route>
						<div>T'es allé où ?</div>
					</Route>
				</Switch>
			</main>
		</AppContext.Provider>
	);
}

export default App;
