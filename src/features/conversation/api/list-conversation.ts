import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export type ConversationInfo = {
	id: number
	authorId: number
	participantIds: number[]
}

export const TEAMMATE_CONVERSATION_LIST = "teammate-conversation-list"

export default function useTeammateConversations(workspaceCode: string) {
	return useQuery<ConversationInfo[]>({
		queryKey: [TEAMMATE_CONVERSATION_LIST, workspaceCode],
		queryFn: async () => {
			const res = await apiClient.get<ConversationInfo[]>(
				ApiPaths.CONVERSATIONS,
				{
					params: { workspaceCode },
				},
			)
			return res.data
		},
		enabled: Boolean(workspaceCode),
	})
}
