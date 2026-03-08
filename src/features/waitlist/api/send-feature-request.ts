import { useMutation } from "@tanstack/react-query"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"
import type { FeatureRequest } from "@/features/waitlist/interfaces/feature-request"

export function useSendFeatureRequest() {
	return useMutation({
		mutationFn: (featureRequest: FeatureRequest) => {
			return apiClient.post(ApiPaths.ROADMAP_FEATURE_REQUEST, featureRequest)
		},
	})
}
