import { useQuery } from "@tanstack/react-query"

export type TeammateConversationInfo = {
	id: number
	authorId: number
	recipientId: number
}

export const TEAMMATE_CONVERSATION_LIST = "teammate-conversation-list"

export default function useTeammateConversationInfo(
	appCode: string,
	adminId: number,
) {
	return useQuery<TeammateConversationInfo[]>({
		queryKey: [TEAMMATE_CONVERSATION_LIST, adminId, appCode],
		queryFn: async () => {
			return Promise.resolve([
				{
					id: 1,
					authorId: 7,
					recipientId: 9,
				},
				{
					id: 2,
					authorId: 7,
					recipientId: 11,
				},
				{
					id: 3,
					authorId: 7,
					recipientId: 10,
				},
			])
		},
	})
}
