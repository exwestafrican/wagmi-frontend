import {
	type QueryClient,
	queryOptions,
	useQuery,
} from "@tanstack/react-query"
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

export const ConversationType = {
	PRIVATE: "private",
	COLLABORATIVE: "collaborative",
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
	conversationType: string,
) {
	return [
		TEAMMATE_CONVERSATION_LIST,
		workspaceCode,
		teammateId,
		conversationType,
	] as const
}

export function addConversationToQueryCache(
	queryClient: QueryClient,
	workspaceCode: string,
	teammateId: number,
	conversationType: string,
	conversation: ConversationSummary,
) {
	queryClient.setQueryData<ConversationSummary[]>(
		conversationListQueryKey(workspaceCode, teammateId, conversationType),
		(previous) => {
			return [...(previous ?? []), conversation]
		},
	)
}

export function getConversationType(participantCount: number) {
	if (participantCount <= 2) {
		return ConversationType.PRIVATE
	}
	return ConversationType.COLLABORATIVE
}

export function teammateConversationsQueryOptions(
	workspaceCode: string,
	currentTeammateId: number,
	conversationType: string,
) {
	return queryOptions({
		queryKey: conversationListQueryKey(
			workspaceCode,
			currentTeammateId,
			conversationType,
		),
		queryFn: async () => {
			const res = await apiClient.get<ConversationApiResponse[]>(
				ApiPaths.CONVERSATIONS,
				{
					params: { workspaceCode, conversationType },
				},
			)
			return res.data.map((raw) =>
				toConversationSummary(raw, currentTeammateId),
			)
		},
		enabled: Boolean(workspaceCode) && Boolean(currentTeammateId),
	})
}

export default function useTeammateConversations(
	workspaceCode: string,
	currentTeammateId: number,
	conversationType: string,
) {
	return useQuery(
		teammateConversationsQueryOptions(
			workspaceCode,
			currentTeammateId,
			conversationType,
		),
	)
}
