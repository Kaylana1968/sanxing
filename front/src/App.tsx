import { useRef } from "react";
import Game from "./pages/Game";
import Home from "./pages/Home";
import { AppContext } from "./AppContext";
import type { Data } from "./types";
import { Route, Switch } from "wouter";

function App() {
	const socketRef = useRef<WebSocket>(null);

	function sendData(data: Data) {
		if (!socketRef.current) {
			// Add some error handling
			return;
		}

		socketRef.current.send(JSON.stringify(data));
	}

	return (
		<AppContext.Provider value={{ socketRef, sendData }}>
			<main className="text-sm">
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
