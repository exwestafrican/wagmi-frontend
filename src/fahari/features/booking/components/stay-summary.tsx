export function StaySummary({ summary }: { summary: string }) {
	return (
		<div>
			<p
				className="text-xs tracking-tight text-slate-600"
				style={{ fontFamily: "Inter, sans-serif" }}
			>
				{summary}
			</p>
			<hr className="mt-2.5 border-slate-200" />
		</div>
	)
}
