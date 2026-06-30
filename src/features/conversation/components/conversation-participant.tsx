import FallbackAvatar, {
	FallbackAvatarSkeleton,
} from "@/features/directory/component/fallback-avatar.tsx"
import {
	counterpartyTeammates,
	displayName,
} from "@/features/conversation/utils/participants.ts"
import ConversationHeader from "@/features/conversation/components/header.tsx"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import useConversationInfoRegistry from "@/features/conversation/hooks/conversation-info-registry.ts"
import { Skeleton } from "@/components/ui/skeleton.tsx"

export default function ConversationParticipant({
	workspaceCode,
	teammateId,
	conversationId,
}: { workspaceCode: string; teammateId: number; conversationId: number }) {
	const registry = useTeammateInfoRegistry(workspaceCode)
	const conversationRegistry = useConversationInfoRegistry(
		workspaceCode,
		teammateId,
	)
	const conversationInfo = conversationRegistry.find(conversationId)
	const counterparty = conversationInfo
		? counterpartyTeammates(registry, conversationInfo)[0]
		: undefined

	return counterparty && conversationInfo ? (
		<ConversationHeader>
			<FallbackAvatar teammate={counterparty} />
			<h1
				aria-label="conversation-participant-fullname"
				className="text-lg md:text-lg font-semibold"
			>
				{displayName(counterpartyTeammates(registry, conversationInfo))}
			</h1>
		</ConversationHeader>
	) : (
		<ConversationHeader>
			<div className="flex flex-row gap-2 justify-center items-center">
				<FallbackAvatarSkeleton />
				<Skeleton className={"h-4 w-[150px]"} />
			</div>
		</ConversationHeader>
	)
}
