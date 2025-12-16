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
import { Link } from "@tanstack/react-router"

const SignupPage = () => {
	const form = useForm<SignupData>({
		resolver: zodResolver(signupSchema),
		mode: "onSubmit",
		defaultValues: {
			firstName: "",
			lastName: "",
			workEmail: "",
			companyName: "",
			phoneNumber: "",
		},
	})

	const onSubmit = (data: SignupData) => {
		console.log(`Signup Data: ${data}`)
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
									<Input placeholder="John" {...field} />
								</FormControl>
								<FormMessage />
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
									<Input placeholder="Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
									In the absence of work email, please provide personal email
									address
								</FormDescription>
								<FormMessage />
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
									<Input placeholder="Doe.inc" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input placeholder="091xxxxxxx" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full">
						Sign Up
					</Button>
				</form>
			</Form>
			<p className="mt-2 text-sm">
				Already have an account? <Link to="/auth/login" className="font-bold cursor-pointer">Login</Link>
			</p>
		</div>
	)
}

export default SignupPage
