import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { type LoginData, loginSchema } from "@/features/auth/schema/loginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "@tanstack/react-router"

const LoginPage = () => {
	const form = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		mode: "onSubmit",
		defaultValues: {
			workEmail: "",
		},
	})

	const onSubmit = (data: LoginData) => {
		console.log(`Login Data: ${data}`)
	}

	return (
		<div className="w-full flex flex-col items-center py-3 px-10">
			<div className=" w-full text-center">
				<h2 className="text-4xl font-extrabold mb-3">Envoye</h2>
				<div>
					<p>Login to your account</p>
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full md:max-w-125 lg:max-w-175 flex flex-col gap-6"
				>
					<FormField
						control={form.control}
						name="workEmail"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Work Email</FormLabel>
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

					<Button className="" type="submit">
						Login
					</Button>
				</form>
			</Form>
			<p className="mt-2 text-sm">
				Don't have an account? <Link to="/auth/signup" className="font-bold cursor-pointer">Sign up</Link>
			</p>
		</div>
	)
}

export default LoginPage
