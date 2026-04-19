import { useQuery } from "@tanstack/react-query"
import { ApiPaths } from "@/constants.ts"
import { apiClient } from "@/lib/api-client.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

export const CURRENT_TEAMMATE_QUERY_KEY = "current-teammate"

export function useCurrentWorkspaceTeammate(workspaceCode: string) {
	return useQuery<Teammate>({
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
