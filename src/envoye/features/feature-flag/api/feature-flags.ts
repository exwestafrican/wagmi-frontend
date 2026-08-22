import { queryOptions, useQuery } from "@tanstack/react-query"
import { ApiPaths } from "@envoye/constants"
import { apiClient } from "@common/lib/api-client"

export const ENABLED_FEATURES = "enabled-features"

export function featureFlagsQueryOptions(workspaceCode: string) {
	return queryOptions({
		queryKey: [ENABLED_FEATURES, workspaceCode],
		queryFn: async () => {
			const res = await apiClient.get<string[]>(
				ApiPaths.FEATURE_FLAGS_ENABLED,
				{
					params: {
						workspaceCode: workspaceCode,
					},
				},
			)
			return res.data
		},
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	})
}

export function useWorkspaceEnabledFeatures(workspaceCode: string) {
	return useQuery(featureFlagsQueryOptions(workspaceCode))
}
