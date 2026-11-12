import { titleCase } from "@common/utils/sentence-case.ts"
import { formatNightlyPrice } from "@fahari/features/booking/format.ts"
import type { Booking } from "@fahari/features/booking/schema/booking.schema.ts"
import { addDays, differenceInCalendarDays, format, startOfDay } from "date-fns"

export const GOING_PICKUP_TIME = "15:00"
export const LEAVING_TIME = "11:00"
export const SAME_DAY_LEAVING_TIME = "18:00"

export type TripTypeCode = "inbound_only" | "outbound_only" | "round_trip"

export type TripType = {
	code: TripTypeCode
	description: string
}

export type MeetupPoint = {
	name: string
	address: string
	nearestLandmark: string | null
}

export type ChauffeurBookingPolicy = {
	maxDaysAfterPickup: number
	minDaysBeforeTrip: number
	maxDaysBeforeTrip: number
}

export type ChauffeurVehicle = {
	operator: string
	name: string
	maximumPassengers: number
	sameDayPrice: string
	multiDayPrice: string
}

export type ChauffeurClient = {
	name: string
	code: string
	tagLine: string
	tripType: TripType
	fareNote: string | null
	meetupPoint: MeetupPoint
	bookingPolicy: ChauffeurBookingPolicy
	vehicles: ChauffeurVehicle[]
}

export function showsGoing(client: ChauffeurClient) {
	return client.tripType.code !== "inbound_only"
}

export function showsLeaving(client: ChauffeurClient) {
	return client.tripType.code !== "outbound_only"
}

export function rideIntro(client: ChauffeurClient) {
	const meetup = titleCase(client.meetupPoint.name)
	switch (client.tripType.code) {
		case "inbound_only":
			return `Private ride from ${meetup}`
		case "outbound_only":
			return `Private ride to ${meetup}`
		case "round_trip":
			return `Private ride to ${meetup} and back`
	}
}

export function tripWindow(
	policy: ChauffeurBookingPolicy,
	today = startOfDay(new Date()),
) {
	return {
		earliest: addDays(today, policy.minDaysBeforeTrip),
		latest: addDays(today, policy.maxDaysBeforeTrip),
	}
}

export function shiftDateTime(date: Date, time: string, hours: number) {
	const [hour, minute] = time.split(":").map(Number)
	const next = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		hour + hours,
		minute,
		0,
		0,
	)
	return {
		date: startOfDay(next),
		time: format(next, "HH:mm"),
	}
}

export function initialBookingSchedule(
	client: ChauffeurClient,
	today = startOfDay(new Date()),
) {
	const tripDate = addDays(today, client.bookingPolicy.minDaysBeforeTrip)
	if (client.tripType.code === "outbound_only") {
		const departure = shiftDateTime(tripDate, GOING_PICKUP_TIME, 1)
		return {
			pickupAddress: "",
			nearestLandmark: "",
			pickupDate: tripDate,
			pickupTime: GOING_PICKUP_TIME,
			departureDate: departure.date,
			departureTime: departure.time,
		}
	}
	if (client.tripType.code === "inbound_only") {
		const pickup = shiftDateTime(tripDate, LEAVING_TIME, -1)
		return {
			pickupAddress: client.meetupPoint.address || client.meetupPoint.name,
			nearestLandmark: "",
			pickupDate: pickup.date,
			pickupTime: pickup.time,
			departureDate: tripDate,
			departureTime: LEAVING_TIME,
		}
	}
	const sameDay = client.bookingPolicy.maxDaysAfterPickup === 0
	return {
		pickupAddress: "",
		nearestLandmark: "",
		pickupDate: tripDate,
		pickupTime: GOING_PICKUP_TIME,
		departureDate: sameDay ? tripDate : addDays(tripDate, 1),
		departureTime: sameDay ? SAME_DAY_LEAVING_TIME : LEAVING_TIME,
	}
}

export function atTime(date: Date, time: string) {
	const [hour, minute] = time.split(":").map(Number)
	if (!Number.isFinite(hour) || !Number.isFinite(minute)) return undefined
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		hour,
		minute,
		0,
		0,
	)
}

export function departureIsAfterPickup(booking: {
	pickupDate: Date
	pickupTime: string
	departureDate: Date
	departureTime: string
}) {
	const pickup = atTime(booking.pickupDate, booking.pickupTime)
	const departure = atTime(booking.departureDate, booking.departureTime)
	if (!pickup || !departure) return false
	return departure.getTime() > pickup.getTime()
}

export function rideRequestValues(
	booking: Booking,
	client: ChauffeurClient,
): Booking {
	if (client.tripType.code === "outbound_only") {
		const departure = shiftDateTime(booking.pickupDate, booking.pickupTime, 1)
		return {
			...booking,
			departureDate: departure.date,
			departureTime: departure.time,
		}
	}
	if (client.tripType.code === "inbound_only") {
		const pickup = shiftDateTime(
			booking.departureDate,
			booking.departureTime,
			-1,
		)
		return {
			...booking,
			pickupDate: pickup.date,
			pickupTime: pickup.time,
			pickupAddress: client.meetupPoint.name,
		}
	}
	return booking
}

export function ridePrice(
	client: ChauffeurClient,
	pickupDate: Date,
	departureDate: Date,
) {
	const vehicle = client.vehicles[0]
	if (!vehicle) return undefined
	const multiDay =
		client.tripType.code === "round_trip" &&
		differenceInCalendarDays(departureDate, pickupDate) > 0
	const amount = Number(multiDay ? vehicle.multiDayPrice : vehicle.sameDayPrice)
	if (!Number.isFinite(amount)) return undefined
	return formatNightlyPrice(amount, "NGN")
}

export function passengerCapacity(client: ChauffeurClient) {
	return client.vehicles[0]?.maximumPassengers ?? 1
}
