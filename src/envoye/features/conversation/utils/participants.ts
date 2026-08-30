import type { ConversationSummary } from "@envoye/features/conversation/api/list-conversation.ts"
import { fullNameWithFallback } from "@envoye/features/directory/utils/teammate.ts"
import type { Teammate } from "@envoye/features/workspace/interface/teammate.interface.ts"

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
	return counterParties.map((c) => fullNameWithFallback(c)).join(", ")
}

export function displayCounterParty(counterParties: Teammate[]): string {
	return counterParties.map((c) => fullNameWithFallback(c)).join(", ")
}
