import { useMutation } from "@tanstack/react-query"
import { API_BASE_URL } from "@/constants.ts"
import axios from "axios"

interface FeatureFeedbackPayload {
	email: string
	feedback: string
	featureId: string
}

export function useSendFeatureFeedback() {
	return useMutation({
		mutationFn: (payload: FeatureFeedbackPayload) => {
			return axios.post(`${API_BASE_URL}/roadmap/feedback`, payload)
		},
	})
}
