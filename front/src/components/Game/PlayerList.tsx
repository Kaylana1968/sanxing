import type { Player } from "../../types";

export default function PlayerList({ players }: { players: Player[] }) {
	return (
		<div className="grid grid-cols-2">
			{players.map((player) => (
				<div
					key={player.id}
					className="odd:border-r not-last:not-nth-last-2:border-b border-slate-300 p-1 flex gap-2 items-center"
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
			))}
		</div>
	);
}
