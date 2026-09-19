import { Button } from "@common/components/ui/button.tsx"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
import { Input } from "@common/components/ui/input.tsx"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@common/components/ui/sheet"
import useSpinnerVerbs from "@common/hooks/spinner-verb.ts"
import type { DriverAccount } from "@fahari/features/admin/accounts/api/list-accounts.ts"
import { useProvisionAccount } from "@fahari/features/admin/accounts/api/provision-account.ts"
import {
	type ProvisionAccountData,
	provisionAccountSchema,
} from "@fahari/features/admin/accounts/schema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormState } from "react-hook-form"
import { toast } from "sonner"

const fieldInputClassName =
	"h-auto rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-none placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-slate-400 focus-visible:ring-0"

const defaultValues: ProvisionAccountData = {
	bvn: "",
	nin: "",
}

function RequiredMark() {
	return (
		<span className="text-red-500" aria-hidden="true">
			*
		</span>
	)
}

export function ProvisionAccountSheet({
	account,
	onOpenChange,
}: {
	account: DriverAccount | null
	onOpenChange: (open: boolean) => void
}) {
	const { mutate, isPending } = useProvisionAccount()
	const spinnerVerb = useSpinnerVerbs()
	const form = useForm<ProvisionAccountData>({
		resolver: zodResolver(provisionAccountSchema),
		defaultValues,
		mode: "onChange",
	})
	const { isValid } = useFormState({ control: form.control })
	const open = account !== null

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			form.reset(defaultValues)
		}
		onOpenChange(nextOpen)
	}

	function onSubmit(data: ProvisionAccountData) {
		if (!account) return
		mutate(
			{ userId: account.userId, ...data },
			{
				onSuccess: () => {
					toast.success("Account provisioned")
					form.reset(defaultValues)
					onOpenChange(false)
				},
				onError: () => {
					toast.error("Could not provision account")
				},
			},
		)
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent className="gap-0 sm:max-w-md">
				<SheetHeader>
					<SheetTitle className="text-sm font-semibold tracking-tight text-slate-900">
						{account
							? `${account.firstName} ${account.lastName}`
							: "Provision account"}
					</SheetTitle>
					<SheetDescription className="text-xs text-slate-400">
						Enter verification details to provision.
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex min-h-0 flex-1 flex-col"
					>
						<div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4">
							<FormField
								control={form.control}
								name="bvn"
								render={({ field }) => (
									<FormItem className="gap-1.5">
										<FormLabel className="text-[11px] font-medium text-slate-500">
											BVN <RequiredMark />
										</FormLabel>
										<FormControl>
											<Input
												inputMode="numeric"
												maxLength={11}
												autoComplete="off"
												placeholder="12345678901"
												className={fieldInputClassName}
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-[11px]" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="nin"
								render={({ field }) => (
									<FormItem className="gap-1.5">
										<FormLabel className="text-[11px] font-medium text-slate-500">
											NIN <RequiredMark />
										</FormLabel>
										<FormControl>
											<Input
												inputMode="numeric"
												maxLength={11}
												autoComplete="off"
												placeholder="12034875601"
												className={fieldInputClassName}
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-[11px]" />
									</FormItem>
								)}
							/>
						</div>

						<SheetFooter className="flex-row items-center justify-end gap-2">
							<SheetClose asChild>
								<Button
									type="button"
									variant="ghost"
									disabled={isPending}
									className="h-auto cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-500"
								>
									Cancel
								</Button>
							</SheetClose>
							<Button
								type="submit"
								disabled={isPending || !isValid}
								className="h-auto cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black disabled:opacity-60"
							>
								{isPending ? `${spinnerVerb}...` : "Provision account"}
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
