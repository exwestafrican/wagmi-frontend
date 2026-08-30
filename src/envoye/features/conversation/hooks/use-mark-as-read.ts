import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { markConversationAsRead } from "@envoye/features/conversation/api/mark-as-read.ts"
import { logger } from "@common/lib/logger.ts"

export function useMarkAsRead(
	workspaceCode: string,
	conversationId: number,
	lastReadMessageId: number | undefined,
) {
	const { mutate } = useMutation({
		mutationFn: markConversationAsRead,
		onError: (error) => {
			logger.error(error)
		},
	})

	useEffect(() => {
		if (conversationId === 0 || lastReadMessageId === undefined) return

		mutate({
			workspaceCode,
			conversationId,
			lastReadMessageId,
		})
	}, [workspaceCode, conversationId, lastReadMessageId, mutate])
}
