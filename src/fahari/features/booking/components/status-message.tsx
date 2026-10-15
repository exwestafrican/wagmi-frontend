export function StatusMessage({ children }: { children: string }) {
	return (
		<main className="flex min-h-dvh items-center justify-center bg-white px-4 md:bg-[#FCFBF8]">
			<p className="text-sm text-slate-600">{children}</p>
		</main>
	)
}
