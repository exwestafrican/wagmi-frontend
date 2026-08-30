import { useMutation } from "@tanstack/react-query"
import { ApiPaths } from "@envoye/constants"
import { apiClient } from "@common/lib/api-client"

export function useSetupWorkspace() {
	return useMutation({
		mutationFn: (preverificationId: string) => {
			return apiClient.post(ApiPaths.WORKSPACE_SETUP, { id: preverificationId })
		},
	})
}
