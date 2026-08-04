import type { ChatHistoryApiResponse } from "@/features/conversation/api/chat-history.ts"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import { toMessageContent } from "@/features/conversation/utils/to-message-content.ts"

export async function fetchMessagesSince(
	workspaceCode: string,
	conversationId: number,
	lastReadMessageId: number | undefined,
) {
	const res = await apiClient.get<ChatHistoryApiResponse[]>(
		ApiPaths.MESSAGES_SINCE,
		{
			params: {
				workspaceCode,
				conversationId,
				lastReadMessageId,
			},
		},
	)
	return res.data
		.sort((a, b) => a.sentAt - b.sentAt)
		.map((raw) => toMessageContent(raw))
}
