import { queryOptions, useQuery } from "@tanstack/react-query"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export const WORKSPACE_TEAMMATES = "workspace-teammates"

export function teammatesQueryOptions(workspaceCode: string) {
	return queryOptions({
		queryKey: [WORKSPACE_TEAMMATES, workspaceCode],
		queryFn: async () => {
			const res = await apiClient.get<Teammate[]>(ApiPaths.ACTIVE_TEAMMATES, {
				params: { workspaceCode },
			})
			return res.data
		},
		enabled: Boolean(workspaceCode),
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	})
}

export default function useTeammates(workspaceCode: string) {
	return useQuery(teammatesQueryOptions(workspaceCode))
}
