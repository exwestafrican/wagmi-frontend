import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
	type LoginData,
	loginSchema,
} from "@/features/auth/schema/loginSchema.ts"
import { useAdminLogin } from "@/features/admin/features/login/api/login.ts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form"
import { Pages } from "@/utils/pages.ts"
import { CHECK_MAIL_REASON } from "@/constants.ts"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"

export function AdminLoginPage() {
	const { mutate: adminLogin } = useAdminLogin()
	const navigate = useNavigate()
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
					to: Pages.CHECK_EMAIL,
					search: { email: data.email, type: CHECK_MAIL_REASON.LOGIN_SUCCESS },
				})
			},
			onError: async () => {
				toast.error("Unable to login", {
					description: "Invalid account",
				})
			},
		})
	}

	return (
		<div className="flex min-h-screen items-center justify-center  px-6 py-12">
			<div className="flex w-full max-w-sm flex-col items-center">
				<h1 className="mb-10 text-3xl font-bold tracking-tight text-neutral-900">
					Login
				</h1>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex w-full flex-col gap-6"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											id="admin-email"
											type="email"
											autoComplete="email"
											placeholder="john@useenvoye.com"
											className="signup-field-input"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="mt-2 h-12 w-full rounded-md bg-[#D16D4B] text-base text-white hover:bg-[#D16D4B]/90 cursor-pointer"
						>
							Login
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
