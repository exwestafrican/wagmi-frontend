import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignupPage = () => {
	return (
		<div className="w-full flex flex-col items-center py-3 px-10">
			<div className=" w-full text-center">
				<h2 className="text-4xl font-extrabold mb-3">Envoye</h2>
				<div>
					<p>Create an account</p>
				</div>
			</div>
			<form action="" className="w-full md:max-w-125 lg:max-w-175 flex flex-col gap-6">
				{/* ------ first name ------ */}
				<div className="flex flex-col gap-3">
					<Label htmlFor="firstName" className="font-bold">
						First Name
					</Label>
					<Input id="firstName" type="text" className="" placeholder="John" />
				</div>
				{/* ------ last name name ------ */}
				<div className="flex flex-col gap-3">
					<Label htmlFor="lastName" className="font-bold">
						Last Name
					</Label>
					<Input id="lastName" type="text" placeholder="Doe" />
				</div>
				{/* ------ company name ------ */}
				<div className="flex flex-col gap-3">
					<Label htmlFor="companyName" className="font-bold">
						Company Name
					</Label>
					<Input
						id="companyName"
						type="text"
						placeholder="John Doe Enterprises"
					/>
				</div>
				{/* ------ work email ------ */}
				<div className="flex flex-col gap-3">
					<Label htmlFor="workEmail" className="font-bold">
						Work Email
					</Label>
					<Input
						id="workEmail"
						type="email"
						className=""
						placeholder="jd@xxx.com"
					/>
				</div>
				{/* ------ phone number ------ */}
				<div className="flex flex-col gap-3">
					<Label htmlFor="phoneNumber" className="font-bold">
						Phone Number
					</Label>
					<Input id="phoneNumber" type="text" placeholder="080xxxxxxxx" />
				</div>
				<Button className="">Signup</Button>
			</form>
		</div>
	)
}

export default SignupPage
