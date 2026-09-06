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
import { FahariAdminPages } from "@fahari/constants.ts"
import { AdminAuthLayout } from "@fahari/features/admin/components/admin-auth-layout.tsx"
import { useFahariAdminLogin } from "@fahari/features/admin/login/api/login.ts"
import {
	type LoginData,
	loginSchema,
} from "@fahari/features/admin/login/schema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function FahariAdminLoginPage() {
	const navigate = useNavigate()
	const { mutate: adminLogin, isPending } = useFahariAdminLogin()
	const form = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		defaultValues: { email: "" },
	})

	const onSubmit = (data: LoginData) => {
		adminLogin(data, {
			onSuccess: () => {
				form.reset()
				navigate({
					to: FahariAdminPages.CHECK_EMAIL,
					search: { email: data.email },
				})
			},
			onError: () => {
				toast.error("Unable to login", {
					description: "Invalid account",
				})
			},
		})
	}

	return (
		<AdminAuthLayout>
			<h1 className="mb-1 text-base font-bold tracking-tight text-slate-900">
				Sign in
			</h1>
			<p className="mb-6 text-xs text-slate-400">
				We'll send a one-time code to your email.
			</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="gap-1.5">
								<FormLabel className="text-[11px] font-medium text-slate-500">
									Email address
								</FormLabel>
								<FormControl>
									<Input
										id="fahari-admin-email"
										type="email"
										autoComplete="email"
										placeholder="you@company.io"
										autoFocus
										className="h-auto rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-none placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-slate-400 focus-visible:ring-0"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-[11px]" />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						disabled={!form.formState.isValid || isPending}
						className="h-auto w-full cursor-pointer rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-none hover:bg-black disabled:opacity-60"
					>
						{isPending ? "Sending…" : "Send code"}
					</Button>
				</form>
			</Form>
		</AdminAuthLayout>
	)
}
