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

export type ListingRide = {
	provider: string
	oneWayTrip: number
	returnTrip: number
	maximumCapacity: number
}

export type AdditionalServices = {
	rides: ListingRide[]
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
	meetingPoint: MeetingPoint
	onlyRideBooking: boolean
	additionalServices: AdditionalServices
}

export type Listing = Experience
