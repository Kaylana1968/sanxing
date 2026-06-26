export default function Title({ code }: { code: string }) {
	return (
		<div className="p-2 text-center border-b border-b-slate-300 font-semibold text-lg">
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
