import { queryOptions, useQuery } from "@tanstack/react-query"
import { ApiPaths } from "@envoye/constants.ts"
import { apiClient } from "@common/lib/api-client.ts"
import type { Teammate } from "@envoye/features/workspace/interface/teammate.interface.ts"

export const CURRENT_TEAMMATE_QUERY_KEY = "current-teammate"

export function currentTeammateQueryOptions(workspaceCode: string) {
	return queryOptions({
		queryKey: [CURRENT_TEAMMATE_QUERY_KEY, workspaceCode],
		queryFn: async () => {
			const res = await apiClient.get<Teammate>(ApiPaths.CURRENT_TEAMMATE, {
				params: { workspaceCode },
			})
			return res.data
		},
		enabled: Boolean(workspaceCode),
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	})
}

export function useCurrentWorkspaceTeammate(workspaceCode: string) {
	return useQuery(currentTeammateQueryOptions(workspaceCode))
}
