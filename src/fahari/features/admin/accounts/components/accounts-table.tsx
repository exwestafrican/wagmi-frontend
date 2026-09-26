import type { DriverAccount } from "@fahari/features/admin/accounts/api/list-accounts.ts"
import { ChevronRight } from "lucide-react"

function initials(account: DriverAccount) {
	return `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase()
}

function driverName(account: DriverAccount) {
	return `${account.firstName} ${account.lastName}`
}

export function AccountsTable({
	accounts,
	onProvision,
}: {
	accounts: DriverAccount[]
	onProvision: (account: DriverAccount) => void
}) {
	return (
		<div className="overflow-hidden rounded-lg border border-slate-900 bg-white">
			<div className="grid grid-cols-[1fr_200px_36px] border-b border-slate-900 bg-slate-50/60 px-4 py-2.5">
				<span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
					Driver
				</span>
				<span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
					Account no.
				</span>
				<span />
			</div>
			<div className="divide-y divide-slate-100">
				{accounts.map((account) => {
					const provisioned = Boolean(account.accountNumber)
					return (
						<div
							key={account.userId}
							className={`group grid grid-cols-[1fr_200px_36px] items-center px-4 py-3.5 transition-colors ${
								provisioned ? "hover:bg-[#fafaf8]" : ""
							}`}
						>
							<div className="flex items-center gap-2.5">
								<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
									<span className="text-[10px] font-bold text-amber-700">
										{initials(account)}
									</span>
								</div>
								<div className="min-w-0">
									<p className="truncate text-xs font-medium text-slate-800">
										{driverName(account)}
									</p>
									<p className="truncate text-[10px] text-slate-400">
										{account.email}
									</p>
								</div>
							</div>
							<div>
								{provisioned ? (
									<span className="font-mono text-[10px] tracking-wide text-slate-500">
										{account.accountNumber}
									</span>
								) : (
									<button
										type="button"
										onClick={(event) => {
											event.stopPropagation()
											onProvision(account)
										}}
										className="rounded-md border border-dashed border-slate-200 px-2 py-1 text-[10px] text-slate-400 hover:border-slate-400 hover:text-slate-700"
									>
										Provision account
									</button>
								)}
							</div>
							<div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
								{provisioned && (
									<ChevronRight className="h-4 w-4 text-slate-400" />
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
