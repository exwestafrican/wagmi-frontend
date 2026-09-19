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
import { useOpenAccount } from "@fahari/features/admin/accounts/api/open-account.ts"
import {
	type OpenAccountData,
	openAccountSchema,
} from "@fahari/features/admin/accounts/schema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ReactNode } from "react"
import { useForm, useFormState } from "react-hook-form"
import { toast } from "sonner"

const fieldInputClassName =
	"h-auto rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-none placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-slate-400 focus-visible:ring-0"

const defaultValues: OpenAccountData = {
	firstName: "",
	lastName: "",
	email: "",
	bvn: "",
	nin: "",
}

function SectionLabel({ children }: { children: ReactNode }) {
	return (
		<h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
			{children}
		</h2>
	)
}

function RequiredMark() {
	return (
		<span className="text-red-500" aria-hidden="true">
			*
		</span>
	)
}

export function OpenAccountSheet({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const { mutate, isPending } = useOpenAccount()
	const spinnerVerb = useSpinnerVerbs()
	const form = useForm<OpenAccountData>({
		resolver: zodResolver(openAccountSchema),
		defaultValues,
		mode: "onChange",
	})
	const { isValid } = useFormState({ control: form.control })

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			form.reset(defaultValues)
		}
		onOpenChange(nextOpen)
	}

	function onSubmit(data: OpenAccountData) {
		mutate(data, {
			onSuccess: () => {
				toast.success("Account opened")
				form.reset(defaultValues)
				onOpenChange(false)
			},
			onError: () => {
				toast.error("Could not open account")
			},
		})
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent className="gap-0 sm:max-w-md">
				<SheetHeader>
					<SheetTitle className="text-sm font-semibold tracking-tight text-slate-900">
						Open account
					</SheetTitle>
					<SheetDescription className="text-xs text-slate-400">
						Add a driver and create their reserve account.
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex min-h-0 flex-1 flex-col"
					>
						<div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4">
							<section className="space-y-3">
								<SectionLabel>Driver details</SectionLabel>
								<div className="grid grid-cols-2 gap-3">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem className="gap-1.5">
												<FormLabel className="text-[11px] font-medium text-slate-500">
													First name <RequiredMark />
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Ada"
														autoComplete="given-name"
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
										name="lastName"
										render={({ field }) => (
											<FormItem className="gap-1.5">
												<FormLabel className="text-[11px] font-medium text-slate-500">
													Last name <RequiredMark />
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Okafor"
														autoComplete="family-name"
														className={fieldInputClassName}
														{...field}
													/>
												</FormControl>
												<FormMessage className="text-[11px]" />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem className="gap-1.5">
											<FormLabel className="text-[11px] font-medium text-slate-500">
												Email <RequiredMark />
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													autoComplete="email"
													placeholder="ada@example.com"
													className={fieldInputClassName}
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-[11px]" />
										</FormItem>
									)}
								/>
							</section>

							<section className="space-y-3">
								<SectionLabel>Identity verification</SectionLabel>
								<p className="text-[11px] text-slate-400">
									Stored securely and used only for account verification.
								</p>
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
							</section>
						</div>

						<SheetFooter className="flex-row items-center justify-between gap-2">
							<p className="text-[11px] text-slate-300">All fields required</p>
							<div className="flex items-center gap-2">
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
									{isPending ? `${spinnerVerb}...` : "Open account"}
								</Button>
							</div>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
