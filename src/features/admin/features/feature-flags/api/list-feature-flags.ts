import { useQuery } from "@tanstack/react-query"
import {
	FeatureFlagStatus,
	type FeatureFlag,
} from "@/features/admin/interface/feature-flag.ts"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"

export const FEATURE_FLAGS = "feature-flags"

function normalizeFeatureFlagStatus(status: string): FeatureFlag["status"] {
	const s = String(status ?? "")
		.trim()
		.toLowerCase()
	switch (s) {
		case FeatureFlagStatus.GLOBAL:
			return FeatureFlagStatus.GLOBAL
		case FeatureFlagStatus.PARTIAL:
			return FeatureFlagStatus.PARTIAL
		case FeatureFlagStatus.DISABLED:
			return FeatureFlagStatus.DISABLED
		default:
			// default to safest behavior if backend sends unexpected value
			return FeatureFlagStatus.DISABLED
	}
}

export function useFeatureFlags() {
	return useQuery<FeatureFlag[]>({
		queryKey: [FEATURE_FLAGS],
		queryFn: async () => {
			const res = await adminApiClient.get<FeatureFlag[]>(
				AdminApiPaths.FEATURE_FLAGS,
			)
			return res.data.map((ff) => ({
				...ff,
				status: normalizeFeatureFlagStatus(ff.status),
			}))
		},
	})
}
