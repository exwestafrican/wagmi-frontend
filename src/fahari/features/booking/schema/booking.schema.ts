import { contactSchema } from "@fahari/features/booking/schema/contact.schema.ts"
import { tripSchema } from "@fahari/features/booking/schema/trip.schema.ts"
import { z } from "zod"

export const bookingSchema = tripSchema.extend(contactSchema.shape)

export function bookingFormSchema(requiresLandmark: boolean) {
	if (requiresLandmark) return bookingSchema
	return bookingSchema.extend({
		nearestLandmark: z.string().trim(),
	})
}

export type Booking = z.input<typeof bookingSchema>
