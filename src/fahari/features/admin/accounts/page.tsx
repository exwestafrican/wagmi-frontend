import { Button } from "@common/components/ui/button.tsx"
import { OpenAccountSheet } from "@fahari/features/admin/accounts/components/open-account-sheet.tsx"
import { Plus } from "lucide-react"
import { useState } from "react"

export function AdminAccountsPage() {
	const [open, setOpen] = useState(false)

	return (
		<div className="flex min-h-dvh flex-col bg-[#fafaf8]">
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 md:px-8">
				<h1 className="text-sm font-semibold tracking-tight text-slate-900">
					Accounts
				</h1>
				<Button
					type="button"
					onClick={() => setOpen(true)}
					className="h-auto cursor-pointer gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black"
				>
					<Plus className="size-3" strokeWidth={2.5} />
					Open account
				</Button>
			</header>
			<div className="flex min-h-0 flex-1 items-center justify-center">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="group flex cursor-pointer flex-col items-center gap-2 text-slate-900"
				>
					<span className="flex size-12 items-center justify-center rounded-full border border-dashed border-slate-400">
						<Plus className="size-4" strokeWidth={2} />
					</span>
					<span className="text-sm group-hover:font-semibold">
						Open account
					</span>
				</button>
			</div>
			<OpenAccountSheet open={open} onOpenChange={setOpen} />
		</div>
	)
}
