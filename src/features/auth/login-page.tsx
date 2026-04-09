import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	type LoginData,
	loginSchema,
} from "@/features/auth/schema/loginSchema.ts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "@/features/auth/api/login.ts"
import { toast } from "sonner"
import { SplitLayout } from "@/common/components/split-layout.tsx"
import { Link, useNavigate } from "@tanstack/react-router"
import { Pages } from "@/utils/pages.ts"
import { CHECK_MAIL_REASON } from "@/constants.ts"

const LoginPage = () => {
	const navigate = useNavigate()
	const { mutate: loginUser } = useLogin()
	const form = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		defaultValues: { email: "" },
	})

	const onSubmit = (data: LoginData) => {
		console.log(`Login Data: ${data}`)
		loginUser(data, {
			onSuccess: () => {
				form.reset()
				navigate({
					to: Pages.CHECK_EMAIL,
					search: { email: data.email, type: CHECK_MAIL_REASON.LOGIN_SUCCESS },
				})
			},
			onError: async () => {
				form.reset()
				toast.error("Unable to login", {
					description: "Invalid account",
				})
			},
		})
	}

	return (
		<SplitLayout>
			<div className="flex flex-1 flex-col justify-center  px-6 py-10 sm:px-10 md:px-12 lg:px-14">
				<div className="mb-8 w-full max-w-md">
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
						Welcome back
					</h1>
					<p className="mt-2 text-sm text-neutral-500 sm:text-base">
						Ready to kick some but?!
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full md:max-w-125 lg:max-w-175 flex flex-col gap-4 "
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="jd@xxx.com" {...field} />
									</FormControl>
									<FormDescription className="text-xs">
										Please enter your registered email address
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={!form.formState.isValid}
							className="cursor-pointer"
							type="submit"
						>
							Login
						</Button>

						<p className="text-center text-sm text-neutral-600">
							No account yet?{" "}
							<Link
								to={Pages.SIGNUP}
								className="font-medium text-[#3B82F6] hover:underline"
							>
								Sign up
							</Link>
						</p>
					</form>
				</Form>
			</div>
		</SplitLayout>
	)
}

export default LoginPage
