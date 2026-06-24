import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export type ConversationApiResponse = {
	id: number
	authorId: number
	participantIds: number[]
}

export type ConversationSummary = {
	id: number
	authorId: number
	counterParties: number[]
}

export function toConversationSummary(
	raw: ConversationApiResponse,
	currentTeammateId: number,
): ConversationSummary {
	const counterParties = [
		...new Set([raw.authorId, ...raw.participantIds]),
	].filter((id) => id !== currentTeammateId)

	return {
		id: raw.id,
		authorId: raw.authorId,
		counterParties: counterParties.length > 0 ? counterParties : [raw.authorId],
	}
}

export const TEAMMATE_CONVERSATION_LIST = "teammate-conversation-list"

export default function useTeammateConversations(
	workspaceCode: string,
	currentTeammateId: number,
) {
	return useQuery<ConversationSummary[]>({
		queryKey: [TEAMMATE_CONVERSATION_LIST, workspaceCode, currentTeammateId],
		queryFn: async () => {
			const res = await apiClient.get<ConversationApiResponse[]>(
				ApiPaths.CONVERSATIONS,
				{
					params: { workspaceCode },
				},
			)
			return res.data.map((raw) =>
				toConversationSummary(raw, currentTeammateId),
			)
		},
		enabled: Boolean(workspaceCode) && Boolean(currentTeammateId),
	})
}
