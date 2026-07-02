import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import { type QueryClient, useQuery } from "@tanstack/react-query"
import {
	makeTextNode,
	type MessageContent,
	MessageState,
} from "@/features/conversation/interface/text-node.ts"

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
	messageId: string,
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

export type ChatHistoryApiResponse = {
	id: number
	authorId: number
	sentAt: number
	content: string[]
	url?: string | undefined
	type: string
}

function toMessageContent(chatHistory: ChatHistoryApiResponse): MessageContent {
	return {
		id: crypto.randomUUID(),
		authorId: chatHistory.authorId,
		nodes: chatHistory.content.map((c) => makeTextNode(c)),
		state: MessageState.SENT,
		createdAt: chatHistory.sentAt,
	}
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

export default function useChatHistory(
	workspaceCode: string,
	conversationId: number,
	lastMessageSentAt: number | undefined,
) {
	return useQuery<MessageContent[]>({
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
