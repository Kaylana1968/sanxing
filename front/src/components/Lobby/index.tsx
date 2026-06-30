import type { GameState } from "../../types";
import PlayerList from "./PlayerList";
import StartButton from "./StartButton";
import TeamList from "./TeamList";
import Title from "./Title";

export default function Lobby({ gameState }: { gameState: GameState }) {
	if (!gameState) return;

	return (
		<>
			<div className="flex flex-col items-center gap-2">
				<Title code={gameState.code} />

				<PlayerList players={gameState.players} />
				<TeamList teams={gameState.teams} />
			</div>

			<StartButton />
		</>
	);
}
