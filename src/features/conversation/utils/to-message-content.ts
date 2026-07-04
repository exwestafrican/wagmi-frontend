import {
	makeTextNode,
	type MessageContent,
	MessageState,
} from "@/features/conversation/interface/text-node.ts"
import type { ChatHistoryApiResponse } from "@/features/conversation/api/chat-history.ts"

export function toMessageContent(
	chatHistory: ChatHistoryApiResponse,
): MessageContent {
	// if collision occurs with id, ad author id and possibly state to. to form composite key
	return {
		id: chatHistory.sentAt + chatHistory.authorId,
		authorId: chatHistory.authorId,
		nodes: chatHistory.content.map((c) => makeTextNode(c)),
		state: MessageState.SENT,
		createdAt: chatHistory.sentAt,
	}
}
