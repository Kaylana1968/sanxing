import Game from "./pages/Game";
import Home from "./pages/Home";
import { AppContextProvider } from "./context/AppContextProvider";
import { Route, Switch } from "wouter";
import Lobby from "./pages/Lobby";

function App() {
	return (
		<AppContextProvider>
			<main className="text-sm p-2 h-screen">
				<Switch>
					<Route path="/">
						<Home />
					</Route>

					<Route path="/lobby/:code">
						{({ code }) => <Lobby code={code} />}
					</Route>

					<Route path="/game/:code">{({ code }) => <Game code={code} />}</Route>

					<Route>
						<div>T'es allé où ?</div>
					</Route>
				</Switch>
			</main>
		</AppContextProvider>
	);
}

export default App;
