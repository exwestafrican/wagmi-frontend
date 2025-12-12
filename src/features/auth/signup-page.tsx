import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupSchema, type SignupData } from "./schema/authSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const SignupPage = () => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupData>({
		resolver: zodResolver(signupSchema),
		mode: "onSubmit",
	})

	const submitData = (data: SignupData) => {
		console.log(data)
	}

	return (
		<div className="w-full flex flex-col items-center py-3 px-10">
			<div className=" w-full text-center">
				<h2 className="text-4xl font-extrabold mb-3">Envoye</h2>
				<div>
					<p>Create an account</p>
				</div>
			</div>
			<form
				action=""
				className="w-full md:max-w-125 lg:max-w-175 flex flex-col gap-6"
				onSubmit={handleSubmit(submitData)}
			>
				{/* ------ first name ------ */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="firstName" className="font-bold">
						First Name
					</Label>
					<div>
						<Input
							id="firstName"
							type="text"
							className={`${errors.firstName ? "border-red-600" : ""}`}
							placeholder="John"
							{...register("firstName")}
						/>
						{errors.firstName && (
							<p className="mt-2 text-sm text-red-600">
								{errors.firstName.message}
							</p>
						)}
					</div>
				</div>
				{/* ------ last name name ------ */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="lastName" className="font-bold">
						Last Name
					</Label>
					<div>
						<Input
							id="lastName"
							type="text"
							className={`${errors.lastName ? "border-red-600" : ""}`}
							placeholder="Doe"
							{...register("lastName")}
						/>
						{errors.lastName && (
							<p className="mt-2 text-sm text-red-600">
								{errors.lastName.message}
							</p>
						)}
					</div>
				</div>
				{/* ------ company name ------ */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="companyName" className="font-bold">
						Company Name
					</Label>
					<div>
						<Input
							id="companyName"
							type="text"
							className={`${errors.companyName ? "border-red-600" : ""}`}
							placeholder="John Doe Enterprises"
							{...register("companyName")}
						/>
						{errors.companyName && (
							<p className="mt-2 text-sm text-red-600">
								{errors.companyName.message}
							</p>
						)}
					</div>
				</div>
				{/* ------ work email ------ */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="workEmail" className="font-bold">
						Work Email
					</Label>
					<div>
						<Input
							id="workEmail"
							type="email"
							className={`${errors.workEmail ? "border-red-600" : ""}`}
							placeholder="jd@xxx.com"
							{...register("workEmail")}
						/>
						{errors.workEmail && (
							<p className="mt-2 text-sm text-red-600">
								{errors.workEmail.message}
							</p>
						)}
					</div>
				</div>
				{/* ------ phone number ------ */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="phoneNumber" className="font-bold">
						Phone Number
					</Label>
					<div>
						<Input
							id="phoneNumber"
							type="text"
							className={`${errors.phoneNumber ? "border-red-600" : ""}`}
							placeholder="080xxxxxxxx"
							{...register("phoneNumber")}
						/>
						{errors.phoneNumber && (
							<p className="mt-2 text-sm text-red-600">
								{errors.phoneNumber.message}
							</p>
						)}
					</div>
				</div>
				<Button className="" type="submit">
					Signup
				</Button>
			</form>
		</div>
	)
}

export default SignupPage
