import { apiClient } from "@common/lib/api-client.ts"
import { FahariApiPaths } from "@fahari/constants.ts"
import type { ChauffeurClient } from "@fahari/features/booking/chauffeur-client.ts"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export const FAHARI_CHAUFFEUR_CLIENT = "fahari-chauffeur-client"

export function chauffeurClientQueryOptions(code: string) {
	return queryOptions({
		queryKey: [FAHARI_CHAUFFEUR_CLIENT, code],
		queryFn: async () => {
			const res = await apiClient.get<ChauffeurClient>(
				FahariApiPaths.CHAUFFEUR_CLIENT,
				{ params: { code } },
			)
			return res.data
		},
	})
}

export function useChauffeurClient(code: string) {
	return useSuspenseQuery(chauffeurClientQueryOptions(code)).data
}
