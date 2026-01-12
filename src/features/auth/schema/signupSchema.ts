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
		.min(5, { message: "Company name must contain at least 2 characters" })
		.max(50, { message: "Company name cannot be more than 50 characters" })
		.trim(),
	workEmail: z
		.email({ message: "Invalid email address, please try again" })
		.nonempty({ message: "Work email is required" })
		.trim()
		.toLowerCase(),
})

export type SignupData = z.infer<typeof signupSchema>
