import { useQuery } from "@tanstack/react-query"

export type ConversationPart = {
	authorId: number
	content: string
	sentAt: number
}

const conversationParts: Record<number, ConversationPart[]> = {
	1: [
		{
			authorId: 9,
			content: "Good morning! Quick question about the sprint planning",
			sentAt: 1780260845,
		},
		{
			authorId: 7,
			content: "Morning! What's up?",
			sentAt: 1780260945,
		},
		{
			authorId: 9,
			content: "I noticed some dependencies might be blocking us",
			sentAt: 1780261005,
		},
		{
			authorId: 7,
			content: "Which tickets are affected?",
			sentAt: 1780261070,
		},
		{
			authorId: 9,
			content: "The authentication work is waiting on the API changes.",
			sentAt: 1780261150,
		},
	],

	2: [
		{
			authorId: 7,
			content: "Hey, are we still on for the client demo today?",
			sentAt: 1780262000,
		},
		{
			authorId: 11,
			content: "Yep, scheduled for 2 PM.",
			sentAt: 1780262060,
		},
		{
			authorId: 9,
			content: "Perfect. I'll send over the latest build shortly.",
			sentAt: 1780262130,
		},
		{
			authorId: 11,
			content: "Great, I'll review it before the call.",
			sentAt: 1780262200,
		},
	],

	3: [
		{
			authorId: 7,
			content: "Did anyone investigate the production error from last night?",
			sentAt: 1780263000,
		},
		{
			authorId: 10,
			content: "Yes, looks like a database connection timeout.",
			sentAt: 1780263070,
		},
		{
			authorId: 10,
			content: "Was there any data loss?",
			sentAt: 1780263140,
		},
		{
			authorId: 7,
			content: "No, requests were retried successfully.",
			sentAt: 1780263200,
		},
		{
			authorId: 10,
			content: "Excellent. Let's add monitoring for it.",
			sentAt: 1780263275,
		},
	],
}

export const TEAMMATE_CONVERSATION_PART = "teammate-conversation-part"

export default function useConversationParts(
	appCode: string,
	conversationId: number,
) {
	return useQuery<ConversationPart[]>({
		queryKey: [TEAMMATE_CONVERSATION_PART, conversationId, appCode],
		queryFn: async () => {
			const result: ConversationPart[] = conversationParts[conversationId] ?? []

			return Promise.resolve(result)
		},
	})
}
