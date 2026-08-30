export function DateDivider({ label }: { label: string }) {
	return (
		<div className="relative flex items-center py-2">
			<div className="absolute inset-x-0 top-1/2 h-px bg-border" />
			<span className="relative mx-auto rounded-full border bg-background px-3 py-0.5 text-xs text-muted-foreground">
				{label}
			</span>
		</div>
	)
}
