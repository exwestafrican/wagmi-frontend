import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { API_BASE_URL } from "@/constants.ts"
import { useAuthStore } from "@/stores/auth.store.ts"

export function useSetupWorkspace() {
	const token = useAuthStore((state) => state.token)
	return useMutation({
		mutationFn: (preverificationId: string) => {
			return axios.post(
				`${API_BASE_URL}/workspace/setup`,
				{ id: preverificationId },
				{ headers: { Authorization: `Bearer ${token}` } },
			)
		},
	})
}
