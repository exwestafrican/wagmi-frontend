import { titleCase } from "@common/utils/sentence-case.ts"
import { addDays, format, startOfDay } from "date-fns"

export const GOING_PICKUP_TIME = "15:00"
export const LEAVING_TIME = "11:00"
export const SAME_DAY_LEAVING_TIME = "18:00"

export type TripTypeCode = "one_way" | "round_trip"

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

export function showsLeaving(client: ChauffeurClient) {
	return client.tripType.code === "round_trip"
}

export function rideIntro(client: ChauffeurClient) {
	const meetup = titleCase(client.meetupPoint.name)
	switch (client.tripType.code) {
		case "one_way":
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
	switch (client.tripType.code) {
		case "one_way": {
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
		case "round_trip": {
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

export function passengerCapacity(client: ChauffeurClient) {
	return client.vehicles[0]?.maximumPassengers ?? 1
}
