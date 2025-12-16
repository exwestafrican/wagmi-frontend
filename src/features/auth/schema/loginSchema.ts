import z from "zod"

export const loginSchema = z.object({
	workEmail: z
		.email({ message: "Invalid email address, please try again" })
		.nonempty({ message: "Work email is required" }),
})

export type LoginData = z.infer<typeof loginSchema>