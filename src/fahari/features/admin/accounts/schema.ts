import { z } from "zod"

const elevenDigits = (field: string) =>
	z
		.string()
		.trim()
		.regex(/^\d{11}$/, { message: `${field} must be 11 digits` })

export const openAccountSchema = z.object({
	firstName: z.string().trim().min(1, { message: "First name is required" }),
	lastName: z.string().trim().min(1, { message: "Last name is required" }),
	email: z
		.email({ message: "Invalid email address, please try again" })
		.nonempty({ message: "Email is required" })
		.trim()
		.toLowerCase(),
	bvn: elevenDigits("BVN"),
	nin: elevenDigits("NIN"),
})

export type OpenAccountData = z.infer<typeof openAccountSchema>
