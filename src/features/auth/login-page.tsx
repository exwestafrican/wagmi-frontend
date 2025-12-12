import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const LoginPage = () => {
	return (
		<div className="w-full flex flex-col items-center py-3 px-10">
			<div className=" w-full text-center">
				<h2 className="text-4xl font-extrabold mb-3">Envoye</h2>
				<div>
					<p>Login to your account</p>
				</div>
			</div>
			<form action="" className="w-full md:max-w-125 lg:max-w-175 flex flex-col gap-6">
				{/* ------ work email ------ */}
				<div className="flex flex-col gap-3">
					<Label htmlFor="workemail" className="font-bold">
						Work Email
					</Label>
					<Input id="workemail" type="email" />
				</div>
				<Button className="">Login</Button>
			</form>
		</div>
	)
}

export default LoginPage
