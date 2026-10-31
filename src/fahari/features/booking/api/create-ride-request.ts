import { apiClient } from "@common/lib/api-client.ts"
import { FahariApiPaths } from "@fahari/constants.ts"
import { formatRideDateTime } from "@fahari/features/booking/format.ts"
import type { Booking } from "@fahari/features/booking/schema/booking.schema.ts"
import { useMutation } from "@tanstack/react-query"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export type CreateRideRequest = {
	experienceCode: string
	numberOfPassengers: number
	pickupLocation: string
	nearestLandmark: string
	pickupDateTime: string
	departureDateTime: string
	firstName: string
	lastName: string
	email: string
	phoneNumber: {
		countryCallingCode: string
		nationalNumber: string
	}
}

function toPhoneNumber(phone: string) {
	const parsed = parsePhoneNumberFromString(phone, "NG")
	if (!parsed?.isValid()) {
		throw new Error("A valid phone number is required")
	}
	return {
		countryCallingCode: `+${parsed.countryCallingCode}`,
		nationalNumber: parsed.nationalNumber,
	}
}

export function toCreateRideRequest(
	booking: Booking,
	experienceCode: string,
	numberOfPassengers: number,
): CreateRideRequest {
	return {
		experienceCode,
		numberOfPassengers,
		pickupLocation: booking.pickupAddress.trim(),
		nearestLandmark: booking.nearestLandmark.trim(),
		pickupDateTime: formatRideDateTime(booking.pickupDate, booking.pickupTime),
		departureDateTime: formatRideDateTime(
			booking.departureDate,
			booking.departureTime,
		),
		firstName: booking.firstName.trim(),
		lastName: booking.lastName.trim(),
		email: booking.email.trim(),
		phoneNumber: toPhoneNumber(booking.phone),
	}
}

export function useCreateRideRequest() {
	return useMutation({
		mutationFn: (data: CreateRideRequest) => {
			return apiClient.post(FahariApiPaths.RIDE_REQUESTS, data)
		},
	})
}
