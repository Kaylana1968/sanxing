import type { Player } from "../../types";

export default function PlayerList({ players }: { players: Player[] }) {
	const totalPlayers = players.length;

	return (
		<div className="grid grid-cols-2 rounded-2xl border border-slate-300 bg-slate-200 w-full shadow-lg">
			<div className="col-span-2 text-center text-base font-semibold border-b border-slate-300 py-1">
				Joueurs
			</div>

			{players.map((player, index) => {
				const isEvenTotal = totalPlayers % 2 === 0;
				const isLastRow = isEvenTotal
					? index >= totalPlayers - 2
					: index >= totalPlayers - 1;

				return (
					<div
						key={player.id}
						className={`even:border-r border-slate-300 px-2 py-1 flex gap-1 items-center ${!isLastRow ? "border-b" : ""}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
						{player.username}
					</div>
				);
			})}
		</div>
	);
}
