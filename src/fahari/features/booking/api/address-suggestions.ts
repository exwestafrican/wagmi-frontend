import { apiClient } from "@common/lib/api-client.ts"
import { FahariApiPaths } from "@fahari/constants.ts"

export type AddressSuggestion = {
	placeId: string
	text: string
}

export type PlaceLocation = {
	placeId: string
	latitude: number
	longitude: number
}

// sessionToken is the same for a guest's searches and their pick, so Google bills them as one session.
export async function fetchAddressSuggestions(
	input: string,
	sessionToken: string,
) {
	const res = await apiClient.get<AddressSuggestion[]>(
		FahariApiPaths.ADDRESS_SUGGESTIONS,
		{ params: { input, sessionToken } },
	)
	return res.data
}

export async function fetchPlaceLocation(
	placeId: string,
	sessionToken: string,
) {
	const res = await apiClient.get<PlaceLocation>(
		`${FahariApiPaths.PLACES}/${encodeURIComponent(placeId)}`,
		{ params: { sessionToken } },
	)
	return res.data
}
