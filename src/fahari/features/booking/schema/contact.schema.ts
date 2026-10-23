import { isValidPhoneNumber } from "libphonenumber-js"
import { z } from "zod"

export const contactSchema = z.object({
	firstName: z.string().trim().nonempty({ message: "First name is required" }),
	lastName: z.string().trim().nonempty({ message: "Last name is required" }),
	email: z
		.string()
		.trim()
		.nonempty({ message: "Email address is required" })
		.pipe(z.email({ message: "Enter a valid email address" })),
	phone: z
		.string()
		.trim()
		.nonempty({ message: "Phone number is required" })
		.refine((value) => isValidPhoneNumber(value, "NG"), {
			message: "Enter a valid Nigerian phone number",
		}),
})

export type Contact = z.input<typeof contactSchema>
