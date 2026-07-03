import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"

export function useSendReply() {
	return useMutation({
		mutationFn: (data: {
			workspaceCode: string
			conversationId: number
			message: MessageContent
			sentAt: number
		}) => {
			const messageContent = data.message.nodes.flatMap((n) =>
				n.content.join(" "),
			)
			const isoString = new Date(data.sentAt).toISOString()
			return apiClient.post(ApiPaths.SEND_REPLY, {
				workspaceCode: data.workspaceCode,
				conversationId: data.conversationId,
				message: messageContent,
				sentAt: isoString,
			})
		},
	})
}
