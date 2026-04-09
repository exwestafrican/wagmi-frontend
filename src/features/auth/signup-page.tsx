import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	type SignupData,
	signupSchema,
} from "@/features/auth/schema/signupSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSignup } from "@/features/auth/api/signup.ts"
import { type AxiosError, HttpStatusCode } from "axios"
import { Link, useNavigate } from "@tanstack/react-router"
import { Pages } from "@/utils/pages.ts"
import { toast } from "sonner"
import { SplitLayout } from "@/common/components/split-layout.tsx"
import { CHECK_MAIL_REASON } from "@/constants.ts"

const SignupPage = () => {
	const { mutate: signupUser } = useSignup()
	const navigate = useNavigate()

	const form = useForm<SignupData>({
		resolver: zodResolver(signupSchema),
		mode: "onChange",
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			companyName: "",
		},
	})

	const onSubmit = (data: SignupData) => {
		const signUpdata = {
			...data,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		}
		signupUser(signUpdata, {
			onSuccess: () => {
				form.reset()
				navigate({
					to: Pages.CHECK_EMAIL,
					search: {
						email: signUpdata.email,
						type: CHECK_MAIL_REASON.SIGNUP_SUCCESS,
					},
				})
			},
			onError: async (error: unknown) => {
				form.reset()
				const axiosError = error as AxiosError

				switch (axiosError.status) {
					case HttpStatusCode.Unauthorized:
						toast.error("Unable to create account", {
							description:
								"Please join the waitlist to get notified when accounts are available.",
						})
						await navigate({ to: Pages.WAITLIST })
						break
					case HttpStatusCode.Conflict:
						toast.error("Unable to create account", {
							description: "Please login to your account.",
						})
						break
					default:
						toast.error("Unable to create account", {
							description: "😢Something went wrong.",
						})
				}
			},
		})
	}

	return (
		<SplitLayout>
			<div className="flex flex-1 flex-col justify-center items-center  px-6 py-10 sm:px-10 md:px-12 lg:px-14">
				<div className="mb-8 w-full max-w-md">
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
						Let&apos;s sign you up
					</h1>
					<p className="mt-2 text-sm text-neutral-500 sm:text-base">
						Create an account
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex w-full max-w-md flex-col gap-5 "
					>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel className="font-semibold text-neutral-800">
										First Name
									</FormLabel>
									<FormControl>
										<Input
											data-testid="first-name"
											placeholder="John"
											className="signup-field-input"
											{...field}
										/>
									</FormControl>
									<FormMessage data-testid="firstname-form-message" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel className="font-semibold text-neutral-800">
										Last Name
									</FormLabel>
									<FormControl>
										<Input
											data-testid="last-name"
											placeholder="Doe"
											className="signup-field-input"
											{...field}
										/>
									</FormControl>
									<FormMessage data-testid="lastname-form-message" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel className="font-semibold text-neutral-800">
										Work Email
									</FormLabel>
									<FormControl>
										<Input
											data-testid="email"
											placeholder="jd@xxx.com"
											className="signup-field-input"
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-neutral-500">
										No work email? We accept personal emails too.
									</FormDescription>
									<FormMessage data-testid="email-form-message" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="companyName"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel className="font-semibold text-neutral-800">
										Company Name
									</FormLabel>
									<FormControl>
										<Input
											data-testid="company-name"
											placeholder="Doe.inc"
											className="signup-field-input"
											{...field}
										/>
									</FormControl>
									<FormMessage data-testid="companyname-form-message" />
								</FormItem>
							)}
						/>

						<Button
							disabled={!form.formState.isValid}
							type="submit"
							className="mt-2 h-11 w-full cursor-pointer rounded-lg bg-[#1A1C23] text-white hover:bg-[#1A1C23]/90"
							data-testid="submit-button"
						>
							Sign Up
						</Button>

						<p className="text-center text-sm text-neutral-600">
							Already have an account?{" "}
							<Link
								to={Pages.LOGIN}
								className="font-medium text-[#3B82F6] hover:underline"
							>
								Sign in
							</Link>
						</p>
					</form>
				</Form>
			</div>
		</SplitLayout>
	)
}

export default SignupPage
