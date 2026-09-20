import { Button } from "@common/components/ui/button.tsx"
import { Spinner } from "@common/components/ui/spinner.tsx"
import { useAccounts } from "@fahari/features/admin/accounts/api/list-accounts.ts"
import { AccountsTable } from "@fahari/features/admin/accounts/components/accounts-table.tsx"
import { OpenAccountSheet } from "@fahari/features/admin/accounts/components/open-account-sheet.tsx"
import { Plus } from "lucide-react"
import { useState } from "react"

function EmptyOpenAccount({ onOpen }: { onOpen: () => void }) {
	return (
		<button
			type="button"
			onClick={onOpen}
			className="group flex cursor-pointer flex-col items-center gap-3"
		>
			<div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-slate-900">
				<Plus className="h-5 w-5 text-slate-900" strokeWidth={2} />
			</div>
			<p className="text-xs text-slate-900">Open account</p>
		</button>
	)
}

export function AdminAccountsPage() {
	const [open, setOpen] = useState(false)
	const { data: accounts = [], isPending, isError } = useAccounts()

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
			{isPending ? (
				<div className="flex flex-1 items-center justify-center">
					<Spinner className="size-8" />
				</div>
			) : (
				<div className="flex flex-1 flex-col overflow-auto px-8 pt-8 pb-8">
					{isError && (
						<p className="text-sm text-slate-400">Could not load accounts</p>
					)}
					{!isError && accounts.length === 0 && (
						<div className="flex flex-1 flex-col items-center justify-center">
							<EmptyOpenAccount onOpen={() => setOpen(true)} />
						</div>
					)}
					{!isError && accounts.length > 0 && (
						<AccountsTable accounts={accounts} />
					)}
				</div>
			)}
			<OpenAccountSheet open={open} onOpenChange={setOpen} />
		</div>
	)
}
