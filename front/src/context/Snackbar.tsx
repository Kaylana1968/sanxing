import { useEffect, useState } from "react";

export default function Snackbar({ message }: { message: string }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!message) return;

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setVisible(true);
		setTimeout(() => {
			setVisible(false);
		}, 2000);
	}, [message]);

	return (
		<div
			className={`fixed bottom-2 left-1/2 -translate-x-1/2 rounded-md border border-slate-100 bg-slate-50 flex items-center gap-1 text-sm shadow-lg py-2 px-3 w-60 transition-transform ${visible ? "translate-y-0" : "translate-y-[calc(1rem+100%)]"}`}
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
				className="text-red-500"
			>
				<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
				<path d="M12 9v4" />
				<path d="M12 17h.01" />
			</svg>

			<span className="font-semibold">{message}</span>
		</div>
	);
}
