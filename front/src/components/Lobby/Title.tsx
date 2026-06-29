export default function Title({ code }: { code: string }) {
	return (
		<div className="bg-slate-200 rounded-full w-full p-2 text-center border border-slate-300 font-semibold text-lg shadow-lg">
			Partie{" "}
			<button
				type="button"
				onClick={() => navigator.clipboard.writeText(code)}
				className="underline decoration-dotted cursor-pointer"
			>
				{code}
			</button>
		</div>
	);
}
