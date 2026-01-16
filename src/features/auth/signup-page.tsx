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
import { useSignup } from "@/features/waitlist/api/signup.ts"
import { useState } from "react"
import SignupSuccess from "@/features/auth/component/signup.success.tsx"
import { type AxiosError, HttpStatusCode } from "axios"
import { useNavigate } from "@tanstack/react-router"
import { Pages } from "@/utils/pages.ts"
import { toast } from "sonner"

const SignupPage = () => {
	const { mutate: signupUser } = useSignup()
	const [signupSuccessful, setSignupSuccessful] = useState(false)
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
		signupUser(data, {
			onSuccess: () => {
				form.reset()
				setSignupSuccessful(true)
			},
			onError: async (error: unknown) => {
				form.reset()
				const axiosError = error as AxiosError
				if (axiosError.status === HttpStatusCode.Unauthorized) {
					toast.error("Unable to create account", {
						description:
							"Please join the waitlist to get notified when accounts are available.",
					})
					await navigate({ to: Pages.WAITLIST })
				}
			},
		})
	}

	if (signupSuccessful) {
		return <SignupSuccess />
	}

	return (
		<div className="w-full flex flex-col items-center py-3 px-10">
			<div className=" w-full text-center">
				<h2 className="text-4xl font-extrabold mb-3">Envoye</h2>
				<div>
					<p>Create an account</p>
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4 w-full max-w-175 flex flex-col gap-6"
				>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										data-testid="first-name"
										placeholder="John"
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
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input data-testid="last-name" placeholder="Doe" {...field} />
								</FormControl>
								<FormMessage data-testid="lastname-form-message" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Work Email</FormLabel>
								<FormControl>
									<Input
										data-testid="email"
										placeholder="jd@xxx.com"
										{...field}
									/>
								</FormControl>
								<FormDescription className="text-xs">
									In the absence of work email, please provide personal email
									address
								</FormDescription>
								<FormMessage data-testid="email-form-message" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="companyName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Name</FormLabel>
								<FormControl>
									<Input
										data-testid="company-name"
										placeholder="Doe.inc"
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
						className="w-full"
						data-testid="submit-button"
					>
						Sign Up
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default SignupPage
