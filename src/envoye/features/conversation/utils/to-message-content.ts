import {
	makeTextNode,
	type MessageContent,
	MessageState,
} from "@envoye/features/conversation/interface/text-node.ts"
import type { ChatHistoryApiResponse } from "@envoye/features/conversation/api/chat-history.ts"

export function toMessageContent(
	chatHistory: ChatHistoryApiResponse,
): MessageContent {
	// if collision occurs with id, ad author id and possibly state to. to form composite key
	return {
		id: chatHistory.sentAt + chatHistory.authorId,
		serverId: chatHistory.id,
		authorId: chatHistory.authorId,
		nodes: chatHistory.content.map((c) => makeTextNode(c)),
		state: MessageState.SENT,
		createdAt: chatHistory.sentAt,
	}
}
