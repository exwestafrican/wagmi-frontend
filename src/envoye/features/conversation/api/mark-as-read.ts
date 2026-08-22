import { apiClient } from "@common/lib/api-client.ts"
import { ApiPaths } from "@envoye/constants.ts"

export async function markConversationAsRead(data: {
	workspaceCode: string
	conversationId: number
	lastReadMessageId: number
}) {
	return apiClient.post(ApiPaths.MARK_AS_READ, {
		workspaceCode: data.workspaceCode,
		conversationId: data.conversationId,
		lastReadMessageId: data.lastReadMessageId,
	})
}
