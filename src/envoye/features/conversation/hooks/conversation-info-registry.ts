import {
	conversationListQueryKey,
	type ConversationSummary,
	ConversationType,
} from "@envoye/features/conversation/api/list-conversation.ts"
import indexBy from "@common/utils/indexed-by.ts"
import { useQueryClient } from "@tanstack/react-query"

export default function useConversationInfoRegistry(
	code: string,
	teammateId: number,
) {
	const queryClient = useQueryClient()
	function getConversationFromCache(conversationType: string) {
		return (
			queryClient.getQueryData<ConversationSummary[]>(
				conversationListQueryKey(code, teammateId, conversationType),
			) ?? []
		)
	}

	const data = [
		...getConversationFromCache(ConversationType.COLLABORATIVE),
		...getConversationFromCache(ConversationType.PRIVATE),
	]
	const conversationsParticipated = data ?? []
	const indexedConversations = indexBy(
		conversationsParticipated,
		(convo) => convo.id,
	)

	const indexByCounterParty = indexBy(conversationsParticipated, (convo) =>
		[...convo.counterParties, teammateId].sort().join("-"),
	)
	return {
		find: (conversationId: number) => indexedConversations.get(conversationId),
		findIfExists: (teammateId: number, participantIds: number[]) => {
			const id = [...participantIds, teammateId].sort().join("-")
			return indexByCounterParty.get(id)
		},
	}
}
