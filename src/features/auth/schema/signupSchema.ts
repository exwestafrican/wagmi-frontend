import z from "zod"

export const signupSchema = z.object({
	firstName: z
		.string()
		.trim()
		.toLowerCase()
		.min(2, { message: "First name must contain at least 2 characters" })
		.max(18),
	lastName: z
		.string()
		.trim()
		.toLowerCase()
		.min(2, { message: "Last name must contain at least 2 characters" })
		.max(18),
	companyName: z
		.string()
		.nonempty({ message: "Company name is required" })
		.trim(),
	workEmail: z
		.email({ message: "Invalid email address, please try again" })
		.nonempty({ message: "Work email is required" }),
	phoneNumber: z
		.string()
		.nonempty({ message: "Phone Number is required" })
		.regex(/^(\+234|0)[789][01]\d{8}$/, "Please enter valid phone number"),
})

export type SignupData = z.infer<typeof signupSchema>
