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
import { useState } from "react"
import AuthSuccess from "@/features/auth/component/auth.success.tsx"

const LoginPage = () => {
	const { mutate: loginUser } = useLogin()
	const [loginSuccessful, setloginSuccessful] = useState(false)
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
				setloginSuccessful(true)
			},
			onError: async () => {
				form.reset()
				toast.error("Unable to login", {
					description: "Invalid account",
				})
			},
		})
	}

	if (loginSuccessful) {
		return <AuthSuccess message={"Magic Link sent to Email 🍾🍾"} />
	}

	return (
		<div className="flex flex-row min-h-screen justify-center items-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full md:max-w-125 lg:max-w-175 flex flex-col gap-4"
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
				</form>
			</Form>
		</div>
	)
}

export default LoginPage
