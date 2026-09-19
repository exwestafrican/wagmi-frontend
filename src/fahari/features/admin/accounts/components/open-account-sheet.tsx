import { Button } from "@common/components/ui/button.tsx"
import { Input } from "@common/components/ui/input.tsx"
import { Label } from "@common/components/ui/label.tsx"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@common/components/ui/sheet"
import type { ReactNode } from "react"

const fieldInputClassName =
	"h-auto rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-none placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-slate-400 focus-visible:ring-0"

function SectionLabel({ children }: { children: ReactNode }) {
	return (
		<h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
			{children}
		</h2>
	)
}

function Field({
	id,
	label,
	children,
}: {
	id: string
	label: string
	children: ReactNode
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor={id} className="text-[11px] font-medium text-slate-500">
				{label}{" "}
				<span className="text-red-500" aria-hidden="true">
					*
				</span>
			</Label>
			{children}
		</div>
	)
}

export function OpenAccountSheet({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="gap-0 sm:max-w-md">
				<SheetHeader>
					<SheetTitle className="text-sm font-semibold tracking-tight text-slate-900">
						Open account
					</SheetTitle>
					<SheetDescription className="text-xs text-slate-400">
						Add a driver and create their reserve account.
					</SheetDescription>
				</SheetHeader>

				<div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4">
					<section className="space-y-3">
						<SectionLabel>Driver details</SectionLabel>
						<div className="grid grid-cols-2 gap-3">
							<Field id="open-account-first-name" label="First name">
								<Input
									id="open-account-first-name"
									placeholder="Ada"
									className={fieldInputClassName}
								/>
							</Field>
							<Field id="open-account-last-name" label="Last name">
								<Input
									id="open-account-last-name"
									placeholder="Okafor"
									className={fieldInputClassName}
								/>
							</Field>
						</div>
						<Field id="open-account-email" label="Email">
							<Input
								id="open-account-email"
								type="email"
								placeholder="ada@example.com"
								className={fieldInputClassName}
							/>
						</Field>
					</section>

					<section className="space-y-3">
						<SectionLabel>Identity verification</SectionLabel>
						<p className="text-[11px] text-slate-400">
							Stored securely and used only for account verification.
						</p>
						<Field id="open-account-bvn" label="BVN">
							<Input
								id="open-account-bvn"
								placeholder="12345678901"
								className={fieldInputClassName}
							/>
						</Field>
						<Field id="open-account-nin" label="NIN">
							<Input
								id="open-account-nin"
								placeholder="AB1234567890"
								className={fieldInputClassName}
							/>
						</Field>
					</section>
				</div>

				<SheetFooter className="flex-row items-center justify-between gap-2">
					<p className="text-[11px] text-slate-300">All fields required</p>
					<div className="flex items-center gap-2">
						<SheetClose asChild>
							<Button
								type="button"
								variant="ghost"
								className="h-auto cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-500"
							>
								Cancel
							</Button>
						</SheetClose>
						<Button
							type="button"
							className="h-auto cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black"
						>
							Open account
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
