import { contactSchema } from "@fahari/features/booking/schema/contact.schema.ts"
import { tripSchema } from "@fahari/features/booking/schema/trip.schema.ts"
import type { z } from "zod"

export const bookingSchema = tripSchema.extend(contactSchema.shape)

export type Booking = z.input<typeof bookingSchema>
