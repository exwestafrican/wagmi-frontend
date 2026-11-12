import type { ChauffeurClient } from "@fahari/features/booking/chauffeur-client.ts"
import { Factory } from "fishery"

export const chauffeurClientFactory = Factory.define<ChauffeurClient>(() => ({
	name: "ara iye",
	code: "araiye",
	tagLine: "Reconnection with nature, culture, and silliness.",
	tripType: {
		code: "round_trip",
		description: "pick up and go back for drop off",
	},
	fareNote:
		"Your car includes pickup to the resort and the return ride. The total covers both journeys",
	meetupPoint: {
		name: "ara iye reception",
		address: "owode ogun state",
		nearestLandmark: null,
	},
	bookingPolicy: {
		maxDaysAfterPickup: 0,
		minDaysBeforeTrip: 5,
		maxDaysBeforeTrip: 40,
	},
	vehicles: [
		{
			operator: "fahari",
			name: "Toyota Camry",
			maximumPassengers: 3,
			sameDayPrice: "69660.00",
			multiDayPrice: "88245.00",
		},
	],
}))
