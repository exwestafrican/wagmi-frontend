import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
	chatHistoryQueryKey,
	fetchChatHistory,
	getLastMessageSentAt,
	mergeChatHistory,
} from "@/features/conversation/api/chat-history.ts"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"

const DEFAULT_POLL_INTERVAL_MS = 3000

export function useMessagePolling(
	workspaceCode: string,
	conversationId: number,
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
			// let's see how this works in the wild

			try {
				const queryKey = chatHistoryQueryKey(workspaceCode, conversationId)
				const cached =
					queryClient.getQueryData<MessageContent[]>(queryKey) ?? []
				const lastMessageSentAt = getLastMessageSentAt(cached)

				const newMessages = await fetchChatHistory(
					workspaceCode,
					conversationId,
					lastMessageSentAt,
				)

				if (newMessages.length === 0) return

				queryClient.setQueryData<MessageContent[]>(queryKey, (previous) =>
					mergeChatHistory(previous ?? [], newMessages),
				)
			} catch {
				// transient failures should not stop polling
				// TODO: maybe alert
			}
		}

		const intervalId = setInterval(poll, intervalMs)
		return () => clearInterval(intervalId)
	}, [workspaceCode, conversationId, enabled, intervalMs, queryClient])
}
