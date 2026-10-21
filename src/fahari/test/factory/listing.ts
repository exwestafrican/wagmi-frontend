import type { Listing } from "@fahari/features/booking/listing.ts"
import { Factory } from "fishery"

export const listingFactory = Factory.define<Listing>(() => ({
	name: "Ara Iye",
	tagLine: "Reconnection with nature, culture, and silliness.",
	code: "araiye",
	pricePerNight: 150000,
	currency: "NGN",
	category: "resort",
	bookingPolicy: { maximumNights: 7, maxAdvanceBookingDays: 90 },
	schedule: { startTime: "15:00", endTime: "11:00" },
	billing: {
		accommodation: {
			durationUnit: "nights",
			basePrice: 150000,
			additionalNightPrice: 100000,
		},
	},
	meetingPoint: { name: "Ara Iye reception" },
	onlyRideBooking: true,
	rideProviders: [
		{
			provider: "Fahari",
			maximumCapacity: 2,
			sameDayReturnPrice: 50000,
			multipleDaysReturnPrice: 80000,
		},
	],
}))
