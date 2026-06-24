import useTeammateConversations from "@/features/conversation/api/list-conversation.ts"
import indexBy from "@/utils/indexed-by.ts"

export default function useConversationInfoRegistry(
	code: string,
	teammateId: number,
) {
	const { data } = useTeammateConversations(code, teammateId)
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
