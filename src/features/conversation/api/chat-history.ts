import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import { type QueryClient, useQuery } from "@tanstack/react-query"
import {
	makeDefaultTextNode,
	type MessageContent,
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
	messages: MessageContent[],
) {
	queryClient.setQueryData<MessageContent[]>(
		chatHistoryQueryKey(workspaceCode, conversationId),
		dedupeMessageContents(messages),
	)
}

export type ChatHistoryApiResponse = {
	id: number
	authorId: number
	sentAt: number
	content: string[]
	url?: string | undefined
	type: string
}

function messageFingerprint(message: MessageContent): string {
	return `${message.authorId}:${message.createdAt}`
}

function isServerMessageId(id: string): boolean {
	return /^\d+$/.test(id)
}

/** Collapses optimistic (client) and server copies of the same message. */
export function dedupeMessageContents(
	messages: MessageContent[],
): MessageContent[] {
	const byFingerprint = new Map<string, MessageContent>()

	for (const message of messages) {
		const fingerprint = messageFingerprint(message)
		const existing = byFingerprint.get(fingerprint)

		if (
			!existing ||
			(isServerMessageId(message.id) && !isServerMessageId(existing.id))
		) {
			byFingerprint.set(fingerprint, message)
		}
	}

	return [...byFingerprint.values()].sort(
		(a, b) => a.createdAt - b.createdAt,
	)
}

function toMessageContent(chatHistory: ChatHistoryApiResponse): MessageContent {
	return {
		id: chatHistory.id.toString(),
		authorId: chatHistory.authorId,
		nodes: chatHistory.content.map((c, index) =>
			makeDefaultTextNode(`${chatHistory.id}-${index}`, c),
		),
		sent: true,
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
	})
}
