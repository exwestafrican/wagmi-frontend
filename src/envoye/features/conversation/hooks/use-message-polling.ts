import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
	chatHistoryQueryKey,
	mergeChatHistory,
} from "@envoye/features/conversation/api/chat-history.ts"
import type { MessageContent } from "@envoye/features/conversation/interface/text-node.ts"
import { fetchMessagesSince } from "@envoye/features/conversation/api/messages-since.ts"
import { logger } from "@common/lib/logger.ts"

const DEFAULT_POLL_INTERVAL_MS = 3000

export function useMessagePolling(
	workspaceCode: string,
	conversationId: number,
	lastReadMessageId: number | undefined,
	options?: { intervalMs?: number; enabled?: boolean },
) {
	const queryClient = useQueryClient()
	const intervalMs = options?.intervalMs ?? DEFAULT_POLL_INTERVAL_MS
	const enabled =
		conversationId > 0 && Boolean(workspaceCode) && (options?.enabled ?? true)

	useEffect(() => {
		if (!enabled) return

		async function poll() {
			if (document.hidden) return // if user navigates away, no need to pool. Maybe it's worth considering we stop polling all together.
			// 	// let's see how this works in the wild
			try {
				const queryKey = chatHistoryQueryKey(workspaceCode, conversationId)
				const newMessages = await fetchMessagesSince(
					workspaceCode,
					conversationId,
					lastReadMessageId,
				)

				if (newMessages.length > 0) {
					queryClient.setQueryData<MessageContent[]>(queryKey, (previous) =>
						mergeChatHistory(previous ?? [], newMessages),
					)
				}
			} catch (error) {
				// transient failures should not stop polling
				//  TODO: maybe alert
				logger.error(error)
			}
		}

		const intervalId = setInterval(poll, intervalMs)
		return () => clearInterval(intervalId)
	}, [
		workspaceCode,
		conversationId,
		lastReadMessageId,
		enabled,
		intervalMs,
		queryClient,
	])
}
