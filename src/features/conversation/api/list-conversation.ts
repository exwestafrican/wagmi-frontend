import { type QueryClient, useQuery } from "@tanstack/react-query"
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

export function conversationListQueryKey(
	workspaceCode: string,
	teammateId: number,
) {
	return [TEAMMATE_CONVERSATION_LIST, workspaceCode, teammateId] as const
}

export function addConversationToQueryCache(
	queryClient: QueryClient,
	workspaceCode: string,
	teammateId: number,
	conversation: ConversationSummary,
) {
	queryClient.setQueryData<ConversationSummary[]>(
		conversationListQueryKey(workspaceCode, teammateId),
		(previous) => {
			return [...(previous ?? []), conversation]
		},
	)
}

export default function useTeammateConversations(
	workspaceCode: string,
	currentTeammateId: number,
) {
	return useQuery<ConversationSummary[]>({
		queryKey: conversationListQueryKey(workspaceCode, currentTeammateId),
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
