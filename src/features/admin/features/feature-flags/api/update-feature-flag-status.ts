import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"
import type { FeatureFlag } from "@/features/admin/interface/feature-flag.ts"
import { FEATURE_FLAGS } from "@/features/admin/features/feature-flags/api/list-feature-flags.ts"
import { FEATURE_ENROLMENT } from "@/features/admin/features/feature-flags/api/enrollment.ts"

type UpdateFeatureFlagStatusPayload = {
	key: string
	status: FeatureFlag["status"]
}

export function useUpdateFeatureFlagStatus() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ key, status }: UpdateFeatureFlagStatusPayload) =>
			adminApiClient.patch(`${AdminApiPaths.FEATURE_FLAGS}/${key}/status`, {
				status,
			}),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS] })
			void queryClient.invalidateQueries({ queryKey: [FEATURE_ENROLMENT] })
		},
	})
}
