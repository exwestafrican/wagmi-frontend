import { API_BASE_URL } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const ENABLED_FEATURES = "enabled-features"

export function featureFlagsQueryOptions(workspaceCode: string) {
	return {
		queryKey: [ENABLED_FEATURES, workspaceCode],
		queryFn: () =>
			axios.get<string[]>(`${API_BASE_URL}/feature-flags/enabled`, {
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
