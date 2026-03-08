import { useQuery } from "@tanstack/react-query"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"

export const ENABLED_FEATURES = "enabled-features"

export function featureFlagsQueryOptions(workspaceCode: string) {
	return {
		queryKey: [ENABLED_FEATURES, workspaceCode],
		queryFn: () =>
			apiClient.get<string[]>(ApiPaths.FEATURE_FLAGS_ENABLED, {
				params: {
					workspaceCode: workspaceCode,
				},
			}),
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	}
}

export function useWorkspaceEnabledFeatures(workspaceCode: string) {
	return useQuery(featureFlagsQueryOptions(workspaceCode))
}
