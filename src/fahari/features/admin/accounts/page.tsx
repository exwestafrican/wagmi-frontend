import { Button } from "@common/components/ui/button.tsx"
import { Plus } from "lucide-react"

export function AdminAccountsPage() {
	return (
		<div className="flex min-h-dvh flex-col bg-[#fafaf8]">
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 md:px-8">
				<h1 className="text-sm font-semibold tracking-tight text-slate-900">
					Accounts
				</h1>
				<Button
					type="button"
					disabled
					className="h-auto gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black disabled:opacity-50"
				>
					<Plus className="size-3" strokeWidth={2.5} />
					Open account
				</Button>
			</header>
			<div className="flex min-h-0 flex-1 items-center justify-center">
				<button
					type="button"
					disabled
					className="flex flex-col items-center gap-2 text-slate-900 disabled:cursor-not-allowed"
				>
					<span className="flex size-12 items-center justify-center rounded-full border border-dashed border-slate-400">
						<Plus className="size-4" strokeWidth={2} />
					</span>
					<span className="text-sm">Open account</span>
				</button>
			</div>
		</div>
	)
}
