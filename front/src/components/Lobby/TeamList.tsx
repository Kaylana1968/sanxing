import { useAppContext } from "../../context/AppContext";
import type { Team } from "../../types";

export default function TeamList({ teams }: { teams: Team[] }) {
	const { socketRef } = useAppContext();

	function handleClick(teamId: number) {
		return () => socketRef.current.emit("join-team", { teamId });
	}

	const maxPlayersInEquipe = Math.max(...teams.map(t => t.players.length));

	return (
		<div className="grid grid-cols-2 rounded-2xl border border-slate-300 bg-slate-200 w-full shadow-lg">
			<div className="col-span-2 text-center text-base font-semibold border-b border-slate-300 py-1">
				Equipes
			</div>

			{teams.map((team, index) => (
				<div
					key={team.id}
					onClick={handleClick(team.id)}
					className="grid grid-cols-subgrid content-start even:border-r border-slate-300"
				>
					<div
						className={`text-center border-slate-300 py-1 ${maxPlayersInEquipe > 0 ? "border-b" : ""}`}
					>
						Team {index + 1}
					</div>
					{team.players.map((player, index) => (
						<div
							key={player.username}
							className={`border-slate-300 px-2 py-1 flex gap-1 items-center ${maxPlayersInEquipe > index + 1 ? "border-b" : ""}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<path d="M16 3.128a4 4 0 0 1 0 7.744" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
								<circle cx="9" cy="7" r="4" />
							</svg>
							{player.username}
						</div>
					))}
				</div>
			))}
		</div>
	);
}
