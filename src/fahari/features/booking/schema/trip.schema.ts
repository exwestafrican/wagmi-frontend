import { z } from "zod"

export const tripSchema = z.object({
	pickupAddress: z
		.string()
		.trim()
		.nonempty({ message: "Pickup address is required" }),
	pickupDate: z.date(),
	pickupTime: z
		.string()
		.trim()
		.nonempty({ message: "Pickup time is required" }),
	departureDate: z.date(),
	departureTime: z
		.string()
		.trim()
		.nonempty({ message: "Departure time is required" }),
})

export type RideFormValues = z.infer<typeof tripSchema>
