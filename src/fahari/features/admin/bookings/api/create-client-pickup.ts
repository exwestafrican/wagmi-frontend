import { FahariAdminApiPaths } from "@fahari/constants.ts"
import type { ClientPickupData } from "@fahari/features/admin/bookings/schema.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { useMutation } from "@tanstack/react-query"

export type CreateClientPickupPayload = {
	userId: number
	startDateTime: string
	firstName: string
	lastName?: string
	pickupLocation: string
	email: string
	locationUrl: string
	note?: string
}

export function toCreateClientPickupPayload(
	data: ClientPickupData,
	userId: number,
): CreateClientPickupPayload {
	const payload: CreateClientPickupPayload = {
		userId,
		startDateTime: new Date(
			`${data.pickupDate}T${data.pickupTime}`,
		).toISOString(),
		firstName: data.firstName,
		pickupLocation: data.pickupLocation,
		email: data.clientEmail,
		locationUrl: data.locationUrl,
	}
	const lastName = data.lastName.trim()
	const note = data.note.trim()
	if (lastName) payload.lastName = lastName
	if (note) payload.note = note
	return payload
}

export function useCreateClientPickup() {
	return useMutation({
		mutationFn: (data: CreateClientPickupPayload) => {
			return fahariAdminApiClient.post(FahariAdminApiPaths.CLIENT_PICKUP, data)
		},
	})
}
