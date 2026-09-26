import isUrlHttp from "is-url-http"
import { z } from "zod"

export const clientPickupSchema = z.object({
	firstName: z.string().trim().min(1, { message: "First name is required" }),
	lastName: z.string().trim(),
	clientEmail: z.email({ message: "Enter a valid email address." }).trim(),
	pickupLocation: z
		.string()
		.trim()
		.min(1, { message: "Pickup location is required" }),
	locationUrl: z
		.string()
		.trim()
		.min(1, { message: "Location URL is required" })
		.refine(isUrlHttp, { message: "Enter a valid URL" }),
	pickupDate: z.string().min(1, { message: "Pickup date is required" }),
	pickupTime: z.string().min(1, { message: "Pickup time is required" }),
	note: z.string().trim(),
})

export type ClientPickupData = z.infer<typeof clientPickupSchema>
