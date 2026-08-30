import { useMutation } from "@tanstack/react-query"
import { ApiPaths } from "@envoye/constants"
import { apiClient } from "@common/lib/api-client"
import type { FeatureRequest } from "@envoye/features/waitlist/interfaces/feature-request"

export function useSendFeatureRequest() {
	return useMutation({
		mutationFn: (featureRequest: FeatureRequest) => {
			return apiClient.post(ApiPaths.ROADMAP_FEATURE_REQUEST, featureRequest)
		},
	})
}
