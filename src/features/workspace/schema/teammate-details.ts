import z from "zod"

export const teammateDetailSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(2, { message: "First name must contain at least 2 characters" })
		.max(18, { message: "First name too large" }),

	lastName: z
		.string()
		.trim()
		.min(2, { message: "Last name must contain at least 2 characters" })
		.max(18, { message: "Last name too large" }),

	username: z
		.string()
		.trim()
		.toLowerCase()
		.min(2, { message: "username must contain at least 5 characters" })
		.max(20, { message: "Username is too large" }),

	email: z
		.email({ message: "Invalid email address, please try again" })
		.trim()
		.toLowerCase(),
})

export type TeammateDetails = z.infer<typeof teammateDetailSchema>
