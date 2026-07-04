import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
	chatHistoryQueryKey,
	mergeChatHistory,
} from "@/features/conversation/api/chat-history.ts"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { fetchUnreadMessages } from "@/features/conversation/api/unread-messages.ts"

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

	console.log("mounted use message polling")
	useEffect(() => {
		console.log("enabled", enabled, workspaceCode)
		if (!enabled) return

		async function poll() {
			console.log("attempting to poll")
			if (document.hidden) return // if user navigates away, no need to pool. Maybe it's worth considering we stop polling all together.
			// 	// let's see how this works in the wild
			try {
				const queryKey = chatHistoryQueryKey(workspaceCode, conversationId)
				const unReadMessages = await fetchUnreadMessages(
					workspaceCode,
					conversationId,
				)

				console.log("unReadMessages", unReadMessages, unReadMessages.length > 0)
				if (unReadMessages.length > 0) {
					queryClient.setQueryData<MessageContent[]>(queryKey, (previous) =>
						mergeChatHistory(previous ?? [], unReadMessages),
					)
				}
			} catch (error) {
				// transient failures should not stop polling
				//  TODO: maybe alert
				console.error(error)
			}
		}

		const intervalId = setInterval(poll, intervalMs)
		return () => clearInterval(intervalId)
	}, [workspaceCode, conversationId, enabled, intervalMs, queryClient])
}
