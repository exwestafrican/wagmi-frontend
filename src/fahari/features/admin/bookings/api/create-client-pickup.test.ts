import { toCreateClientPickupPayload } from "@fahari/features/admin/bookings/api/create-client-pickup.ts"
import type { ClientPickupData } from "@fahari/features/admin/bookings/schema.ts"
import { describe, expect, test } from "vitest"

const pickup: ClientPickupData = {
	firstName: "Amara",
	lastName: "",
	clientEmail: "t@fahari.co",
	pickupLocation: "JKIA Terminal 1, Nairobi",
	locationUrl: "https://maps.google.com/?q=JKIA",
	pickupDate: "2026-09-16",
	pickupTime: "08:30",
	note: "   ",
}

describe("toCreateClientPickupPayload", () => {
	test("maps the form into the create booking payload", () => {
		expect(toCreateClientPickupPayload(pickup, 12)).toEqual({
			userId: 12,
			startDateTime: new Date("2026-09-16T08:30").toISOString(),
			firstName: "Amara",
			pickupLocation: "JKIA Terminal 1, Nairobi",
			email: "t@fahari.co",
			locationUrl: "https://maps.google.com/?q=JKIA",
		})
	})

	test("includes last name and note when they are set", () => {
		expect(
			toCreateClientPickupPayload(
				{
					...pickup,
					lastName: "Okafor",
					note: "Client asked for a child seat",
				},
				12,
			),
		).toMatchObject({
			lastName: "Okafor",
			note: "Client asked for a child seat",
		})
	})
})
