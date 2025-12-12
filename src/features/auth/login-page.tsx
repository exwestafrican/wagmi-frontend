import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, type LoginData } from "./schema/authSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		mode: "onSubmit",
	})

	const onSumbit = (data: LoginData) => {
		console.log(data)
	}

	return (
		<div className="w-full flex flex-col items-center py-3 px-10">
			<div className=" w-full text-center">
				<h2 className="text-4xl font-extrabold mb-3">Envoye</h2>
				<div>
					<p>Login to your account</p>
				</div>
			</div>
			<form
				action=""
				className="w-full md:max-w-125 lg:max-w-175 flex flex-col gap-6"
				onSubmit={handleSubmit(onSumbit)}
			>
				{/* ------ work email ------ */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="workemail" className="font-bold">
						Work Email
					</Label>
					<div>
						<Input
							id="workemail"
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
				<Button className="" type="submit">
					Login
				</Button>
			</form>
		</div>
	)
}

export default LoginPage
