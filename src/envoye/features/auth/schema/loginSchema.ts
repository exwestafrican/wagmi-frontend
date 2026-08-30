import { z } from "zod"

export const loginSchema = z.object({
	email: z
		.email({ message: "Invalid email address, please try again" })
		.nonempty({ message: "Work email is required" })
		.trim()
		.toLowerCase(),
})

export type LoginData = z.infer<typeof loginSchema>
