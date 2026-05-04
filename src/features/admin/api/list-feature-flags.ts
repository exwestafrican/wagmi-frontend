import { useQuery } from "@tanstack/react-query"
import type { FeatureFlag } from "@/features/admin/interface/feature-flag.ts"
import { apiClient } from "@/lib/api-client.ts"
import { AdminApiPaths } from "@/constants.ts"

export const FEATURE_FLAGS = "feature-flags"

function normalizeFeatureFlagStatus(status: string): FeatureFlag["status"] {
	const s = String(status ?? "")
		.trim()
		.toLowerCase()
	switch (s) {
		case "global":
			return "global"
		case "partial":
			return "partial"
		case "disabled":
			return "disabled"
		default:
			// default to safest behavior if backend sends unexpected value
			return "disabled"
	}
}

export function useFeatureFlags() {
	return useQuery<FeatureFlag[]>({
		queryKey: [FEATURE_FLAGS],
		queryFn: async () => {
			const res = await apiClient.get<FeatureFlag[]>(
				AdminApiPaths.FEATURE_FLAGS,
			)
			return res.data.map((ff) => ({
				...ff,
				status: normalizeFeatureFlagStatus(ff.status),
			}))
		},
	})
}
