import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"
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
			return apiClient.post(ApiPaths.ROADMAP_VOTE, payload)
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
