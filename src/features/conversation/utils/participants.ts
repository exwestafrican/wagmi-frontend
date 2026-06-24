import type { ConversationSummary } from "@/features/conversation/api/list-conversation.ts"
import { fullNameWithFallback } from "@/features/directory/utils/teammate.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

type Registry = { find: (id: number) => Teammate | undefined }

export function counterpartyTeammates(
	registry: Registry,
	summary: ConversationSummary,
): Teammate[] {
	return summary.counterParties
		.map((id) => registry.find(id))
		.filter((t) => t !== undefined)
}

export function displayName(counterParties: Teammate[]): string {
	return fullNameWithFallback(counterParties[0])
}
