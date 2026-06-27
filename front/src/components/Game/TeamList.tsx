import { useAppContext } from "../../context/AppContext";
import type { Team } from "../../types";

export default function TeamList({ teams }: { teams: Team[] }) {
	const { sendData } = useAppContext();

	function handleClick(teamId: number) {
		return () => sendData({ action: "join-team", payload: { teamId } });
	}

	return (
		<div className="grid grid-cols-2 gap-x-2 mt-2 border-t border-slate-300">
			<div className="col-span-2 text-center border-b border-slate-300 py-1">
				Equipes
			</div>

			{teams.map((team, index) => (
				<div
					key={team.id}
					onClick={handleClick(team.id)}
					className="grid grid-cols-subgrid even:border-r odd:border-l border-slate-300"
				>
					<div className="text-center border-b border-b-slate-300 py-1">
						Team {index + 1}
					</div>
					{team.players.map(player => (
						<div key={player.username} className="border-b border-b-slate-300">
							{player.username}
						</div>
					))}
				</div>
			))}
		</div>
	);
}
