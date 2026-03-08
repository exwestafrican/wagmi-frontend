import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useSetupWorkspace() {
	return useMutation({
		mutationFn: (preverificationId: string) => {
			return apiClient.post("/workspace/setup", { id: preverificationId })
		},
	})
}
