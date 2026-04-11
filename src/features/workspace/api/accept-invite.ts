import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export function useAcceptInvite() {
	return useMutation({
		mutationFn: (data: {
			workspaceCode: string
			inviteCode: string
			teammateEmail: string
			firstName: string
			lastName: string
			username: string
		}) => {
			return apiClient.post(ApiPaths.ACCEPT_INVITE, data)
		},
	})
}
