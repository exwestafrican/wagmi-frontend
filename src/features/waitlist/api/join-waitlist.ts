import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useJoinWaitList() {
	return useMutation({
		mutationFn: (email: string) => {
			return apiClient.post("/waitlist/join", { email })
		},
		onError: (error: unknown) => {
			console.error("Failed to join wait list", error)
		},
	})
}
