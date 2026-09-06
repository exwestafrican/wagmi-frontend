import type { ReactNode } from "react"

export function AdminAuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[#fafaf8] p-6">
			<div className="w-full max-w-sm">
				<div className="mb-10 flex justify-center">
					<img
						src="/fahari-wordmark.svg"
						alt="Fahari"
						className="h-11 w-auto select-none"
					/>
				</div>

				<div className="rounded-xl border-2 border-slate-900 bg-white p-8 shadow-none">
					{children}
				</div>

				<p className="mt-6 text-center text-[10px] text-slate-400">
					Fahari Admin · Secure access only
				</p>
			</div>
		</div>
	)
}
