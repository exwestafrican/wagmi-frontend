import { apiClient } from "@common/lib/api-client.ts"
import { FahariApiPaths } from "@fahari/constants.ts"
import {
	BookingNotFoundError,
	type ChauffeurClient,
} from "@fahari/features/booking/chauffeur-client.ts"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export const FAHARI_CHAUFFEUR_CLIENTS = "fahari-chauffeur-clients"

export function chauffeurClientsQueryOptions() {
	return queryOptions({
		queryKey: [FAHARI_CHAUFFEUR_CLIENTS],
		queryFn: async () => {
			const res = await apiClient.get<ChauffeurClient[]>(
				FahariApiPaths.CHAUFFEUR_CLIENTS,
			)
			return res.data
		},
	})
}

export function requireChauffeurClient(
	clients: ChauffeurClient[],
	code: string,
) {
	const client = clients.find((item) => item.code === code)
	if (!client) throw new BookingNotFoundError()
	return client
}

export function useChauffeurClient(code: string) {
	const { data } = useSuspenseQuery(chauffeurClientsQueryOptions())
	return requireChauffeurClient(data, code)
}
