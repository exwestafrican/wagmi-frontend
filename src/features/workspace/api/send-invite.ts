import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export function useSendWorkspaceInvite() {
	return useMutation({
		mutationFn: (data: { code: string; emails: string[]; role: string }) => {
			return apiClient.post(
				ApiPaths.INVITE_TEAMMATES,
				{ emails: data.emails, role: data.role },
				{ params: { workspaceCode: data.code } },
			)
		},
	})
}
