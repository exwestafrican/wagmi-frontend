import { API_BASE_URL } from "@/constants"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useJoinWaitList() {
	return useMutation({
		mutationFn: (email: string) => {
			return axios.post(`${API_BASE_URL}/waitlist/join`, { email })
		},
		onSuccess: () => {},
		onError: (error: unknown) => {
			console.error("Failed to join wait list", error)
		},
	})
}
