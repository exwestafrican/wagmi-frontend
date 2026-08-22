import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApiClient } from "@common/lib/admin-api-client.ts"
import { AdminApiPaths } from "@envoye/constants.ts"
import type { FeatureFlag } from "@envoye/features/admin/interface/feature-flag.ts"
import { FEATURE_FLAGS } from "@envoye/features/admin/feature-flags/api/list-feature-flags.ts"
import { FEATURE_ENROLMENT } from "@envoye/features/admin/feature-flags/api/enrollment.ts"

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
