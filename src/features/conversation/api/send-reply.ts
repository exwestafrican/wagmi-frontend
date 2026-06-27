import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export function useSendReply() {
	return useMutation({
		mutationFn: (data: {
			workspaceCode: string
			conversationId: number
			message: string[]
			sentAt: number
		}) => {
			const isoString = new Date(data.sentAt).toISOString()
			return apiClient.post(ApiPaths.SEND_REPLY, {
				...data,
				sentAt: isoString,
			})
		},
	})
}
