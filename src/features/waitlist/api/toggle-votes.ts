import { API_BASE_URL } from "@/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { ROADMAP_FEATURES } from "@/features/waitlist/api/roadmap-features.ts"
import { USER_VOTES } from "@/features/waitlist/api/user-votes"

interface VoteOnFeaturePayload {
	email: string
	featureId: string
}

export function useToggleVotes() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: VoteOnFeaturePayload) => {
			console.log("making api call")
			return axios.post(`${API_BASE_URL}/roadmap/vote`, payload)
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [ROADMAP_FEATURES] }),
				queryClient.invalidateQueries({ queryKey: [USER_VOTES] }),
			])
		},
		onError: (error) => {
			console.error("Mutation error:", error)
		},
		retry: false,
	})
}
