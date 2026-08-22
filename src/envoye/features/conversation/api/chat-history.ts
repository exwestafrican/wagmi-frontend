import { apiClient } from "@common/lib/api-client.ts"
import { ApiPaths } from "@envoye/constants.ts"
import { type QueryClient, queryOptions, useQuery } from "@tanstack/react-query"
import type {
	MessageContent,
	MessageState,
} from "@envoye/features/conversation/interface/text-node.ts"
import { toMessageContent } from "@envoye/features/conversation/utils/to-message-content.ts"

export const CONVERSATION_CHAT_HISTORY = "conversation_chat_history"

export function chatHistoryQueryKey(
	workspaceCode: string,
	conversationId: number,
) {
	return [CONVERSATION_CHAT_HISTORY, workspaceCode, conversationId] as const
}

export function addChatHistoryToQueryCache(
	queryClient: QueryClient,
	workspaceCode: string,
	conversationId: number,
	newMessage: MessageContent,
) {
	queryClient.setQueryData<MessageContent[]>(
		chatHistoryQueryKey(workspaceCode, conversationId),
		(previous) => {
			return [...(previous ?? []), newMessage]
		},
	)
}

export async function updateChatHistoryStateInStore(
	queryClient: QueryClient,
	code: string,
	conversationId: number,
	messageId: number,
	state: MessageState,
) {
	const queryKey = chatHistoryQueryKey(code, conversationId)
	await queryClient.cancelQueries({ queryKey })
	const cachedMessaged = queryClient.getQueryData<MessageContent[]>(queryKey)

	const messages = (cachedMessaged ?? []).map((msg) => {
		if (msg.id === messageId) {
			return { ...msg, state: state }
		}

		return msg
	})
	queryClient.setQueryData<MessageContent[]>(queryKey, messages)
}

export function getLastMessageSentAt(
	messages: MessageContent[],
): number | undefined {
	return messages.at(-1)?.createdAt
}

export function getLastReadMessageId(
	messages: MessageContent[],
): number | undefined {
	const serverIds = messages
		.map(({ serverId }) => serverId)
		.filter((id): id is number => id !== undefined)

	return serverIds.length ? Math.max(...serverIds) : undefined
}

export function mergeChatHistory(
	existing: MessageContent[],
	incoming: MessageContent[],
): MessageContent[] {
	const byId = new Map<number, MessageContent>()
	const order: number[] = []

	for (const message of [...existing, ...incoming]) {
		// we always want incoming to be last
		if (!byId.has(message.id)) {
			order.push(message.id)
		}
		byId.set(message.id, message)
	}

	return order.map((id) => byId.get(id)).filter((c) => c !== undefined)
}

export type ChatHistoryApiResponse = {
	id: number
	authorId: number
	sentAt: number
	content: string[]
	url?: string | undefined
	type: string
}

export async function fetchChatHistory(
	workspaceCode: string,
	conversationId: number,
	lastMessageSentAt: number | undefined,
) {
	const res = await apiClient.get<ChatHistoryApiResponse[]>(
		ApiPaths.CONVERSATION_CHAT_HISTORY,
		{
			params: {
				workspaceCode,
				conversationId,
				lastMessageSentAt,
			},
		},
	)

	return res.data.map((raw) => toMessageContent(raw))
}

export function chatHistoryQueryOptions(
	workspaceCode: string,
	conversationId: number,
	lastMessageSentAt?: number,
) {
	return queryOptions({
		queryKey: chatHistoryQueryKey(workspaceCode, conversationId),
		queryFn: async () =>
			fetchChatHistory(workspaceCode, conversationId, lastMessageSentAt),
		enabled: Boolean(workspaceCode) && Boolean(conversationId),
		//:-) we did this because when user navigates around the between conversation
		// we lost old loaded paginated pages, because we do a clean refresh
		// plus the page scrolls to top.
		// if you change this click around in the ui to be sure things are fine.
		staleTime: Number.POSITIVE_INFINITY,
	})
}

export default function useChatHistory(
	workspaceCode: string,
	conversationId: number,
	lastMessageSentAt: number | undefined,
) {
	return useQuery(
		chatHistoryQueryOptions(workspaceCode, conversationId, lastMessageSentAt),
	)
}
