import { API_BASE_URL } from "@/constants"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import type { FeatureRequest } from "@/features/waitlist/interfaces/feature-request"

export function useSendFeatureRequest() {
	return useMutation({
		mutationFn: (featureRequest: FeatureRequest) => {
			return axios.post(
				`${API_BASE_URL}/roadmap/feature-request`,
				featureRequest,
			)
		},
	})
}
