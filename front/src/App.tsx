import Home from "./pages/Home";
import { AppContextProvider } from "./context/AppContextProvider";
import { Route, Switch } from "wouter";
import Room from "./pages/Room";

function App() {
	return (
		<AppContextProvider>
			<main className="text-sm p-2 h-screen">
				<Switch>
					<Route path="/">
						<Home />
					</Route>

					<Route path="/room/:code">{({ code }) => <Room code={code} />}</Route>

					<Route>
						<div>T'es allé où ?</div>
					</Route>
				</Switch>
			</main>
		</AppContextProvider>
	);
}

export default App;
