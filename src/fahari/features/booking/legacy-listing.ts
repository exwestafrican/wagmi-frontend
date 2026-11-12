export type Schedule = {
	startTime: string
	endTime: string
}

export type BookingPolicy = {
	maximumNights: number
	maxAdvanceBookingDays: number
}

export type MeetingPoint = {
	name: string
}

export type DurationBasedPricing = {
	durationUnit: "nights" | "days" | "hours"
	basePrice: number
	additionalNightPrice: number
}

export type ResortBilling = {
	accommodation: DurationBasedPricing
}

export type ProviderPolicy = {
	provider: string
	maximumCapacity: number
	sameDayReturnPrice: number
	multipleDaysReturnPrice: number
}

export type Experience = {
	name: string
	tagLine: string
	code: string
	pricePerNight: number
	currency: string
	category: string
	bookingPolicy: BookingPolicy
	schedule: Schedule
	billing: ResortBilling
	meetingPoint: MeetingPoint
	onlyRideBooking: boolean
	rideProviders: ProviderPolicy[]
}

export type Listing = Experience

export function maximumRideCapacity(listing: Listing) {
	return Math.max(
		1,
		...listing.rideProviders.map((provider) => provider.maximumCapacity),
	)
}
