import { useMutation } from "@tanstack/react-query"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"

export function useJoinWaitList() {
	return useMutation({
		mutationFn: (email: string) => {
			return apiClient.post(ApiPaths.WAITLIST_JOIN, { email })
		},
		onError: (error: unknown) => {
			console.error("Failed to join wait list", error)
		},
	})
}
