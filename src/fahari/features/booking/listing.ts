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
