import { useQuery } from "@tanstack/react-query"
import type { FeatureFlag } from "@/features/admin/interface/feature-flag.ts"
import { apiClient } from "@/lib/api-client.ts"
import { AdminApiPaths } from "@/constants.ts"

export const FEATURE_FLAGS = "feature-flags"

export function useFeatureFlags() {
	return useQuery<FeatureFlag[]>({
		queryKey: [FEATURE_FLAGS],
		queryFn: async () => {
			const res = await apiClient.get<FeatureFlag[]>(
				AdminApiPaths.FEATURE_FLAGS,
			)
			return res.data
		},
	})
}
