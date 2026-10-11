export type ListingRide = {
	provider: string
	oneWayTrip: number
	returnTrip: number
	maximumCapacity: number
}

export type Listing = {
	name: string
	tagLine: string
	code: string
	pricePerNight: number
	currency: string
	category: string
	onlyRideBooking: boolean
	bookingPolicy: {
		maximumNights: number
		maxAdvanceBookingDays: number
	}
	schedule: {
		startTime: string
		endTime: string
	}
	additionalServices: {
		rides: ListingRide[]
	}
}

const listings: Listing[] = [
	{
		name: "ara iye",
		tagLine: "Reconnection with nature, culture, and silliness.",
		code: "araiye",
		pricePerNight: 150000,
		currency: "NGN",
		category: "resort",
		onlyRideBooking: false,
		bookingPolicy: {
			maximumNights: 2,
			maxAdvanceBookingDays: 40,
		},
		schedule: {
			startTime: "15:00",
			endTime: "11:00",
		},
		additionalServices: {
			rides: [
				{
					provider: "Fahari",
					oneWayTrip: 100000,
					returnTrip: 120000,
					maximumCapacity: 3,
				},
			],
		},
	},
]

export function findListingByCode(code: string) {
	const normalized = code.trim().toLowerCase()
	return listings.find((listing) => listing.code.toLowerCase() === normalized)
}
