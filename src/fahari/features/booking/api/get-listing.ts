import { apiClient } from "@common/lib/api-client.ts"
import { FahariApiPaths } from "@fahari/constants.ts"
import type { Listing } from "@fahari/features/booking/listing.ts"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export const FAHARI_BOOKING = "fahari-booking"

export function listingQueryOptions(code: string) {
	return queryOptions({
		queryKey: [FAHARI_BOOKING, code],
		queryFn: async () => {
			const res = await apiClient.get<Listing>(FahariApiPaths.BOOKING, {
				params: { code },
			})
			return res.data
		},
	})
}

export function useListing(code: string) {
	return useSuspenseQuery(listingQueryOptions(code))
}
