import { useMutation } from "@tanstack/react-query"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"

export function useSetupWorkspace() {
	return useMutation({
		mutationFn: (preverificationId: string) => {
			return apiClient.post(ApiPaths.WORKSPACE_SETUP, { id: preverificationId })
		},
	})
}
