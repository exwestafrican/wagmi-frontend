import { useQuery } from "@tanstack/react-query"
import type { FeatureFlag } from "@envoye/features/admin/interface/feature-flag.ts"
import { adminApiClient } from "@common/lib/admin-api-client.ts"
import { AdminApiPaths } from "@envoye/constants.ts"

export const FEATURE_FLAGS = "feature-flags"

export function useFeatureFlags() {
	return useQuery<FeatureFlag[]>({
		queryKey: [FEATURE_FLAGS],
		staleTime: Number.POSITIVE_INFINITY,
		queryFn: async () => {
			const res = await adminApiClient.get<FeatureFlag[]>(
				AdminApiPaths.FEATURE_FLAGS,
			)
			return res.data
		},
	})
}
