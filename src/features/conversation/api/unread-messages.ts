import { useQuery } from "@tanstack/react-query"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { type ChatHistoryApiResponse } from "@/features/conversation/api/chat-history.ts"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import { toMessageContent } from "@/features/conversation/utils/to-message-content.ts"

export const UNREAD_MESSAGES = "unread_messages"

export function unreadMessageQueryKey(
	workspaceCode: string,
	conversationId: number,
) {
	return [UNREAD_MESSAGES, workspaceCode, conversationId] as const
}

export async function fetchUnreadMessages(
	workspaceCode: string,
	conversationId: number,
) {
	const res = await apiClient.get<ChatHistoryApiResponse[]>(
		ApiPaths.UNREAD_MESSAGES,
		{
			params: {
				workspaceCode,
				conversationId,
			},
		},
	)
	return res.data
		.sort((a, b) => a.sentAt - b.sentAt)
		.map((raw) => toMessageContent(raw))
}

export default function useUnreadMessages(
	workspaceCode: string,
	conversationId: number,
) {
	return useQuery<MessageContent[]>({
		queryKey: unreadMessageQueryKey(workspaceCode, conversationId),
		queryFn: async () => fetchUnreadMessages(workspaceCode, conversationId),
		enabled: Boolean(workspaceCode) && Boolean(conversationId),
		staleTime: Number.POSITIVE_INFINITY,
	})
}
