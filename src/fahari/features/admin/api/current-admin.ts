import { FahariAdminApiPaths } from "@fahari/constants.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { queryOptions, useQuery } from "@tanstack/react-query"

export const CURRENT_ADMIN_QUERY_KEY = "current-admin"

export type AdminProfile = {
	firstName: string
	lastName: string
	email: string
	permissions: string[]
}

export function currentAdminQueryOptions() {
	return queryOptions({
		queryKey: [CURRENT_ADMIN_QUERY_KEY],
		queryFn: async () => {
			const res = await fahariAdminApiClient.get<AdminProfile>(
				FahariAdminApiPaths.ME,
			)
			return res.data
		},
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	})
}

export function useCurrentAdmin() {
	return useQuery(currentAdminQueryOptions())
}
