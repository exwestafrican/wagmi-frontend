import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import useConversationInfoRegistry from "@/features/conversation/hooks/conversation-info-registry.ts"
import {
	counterpartyTeammates,
	displayCounterParty,
} from "@/features/conversation/utils/participants.ts"
import FallbackAvatar, {
	FallbackAvatarSkeleton,
} from "@/features/directory/component/fallback-avatar.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import ConversationHeader from "@/features/conversation/components/header.tsx"
import { Fragment } from "react"

export default function MultipleConversationParticipants({
	workspaceCode,
	conversationId,
	teammateId,
}: {
	workspaceCode: string
	conversationId: number
	teammateId: number
}) {
	const registry = useTeammateInfoRegistry(workspaceCode)
	const conversationRegistry = useConversationInfoRegistry(
		workspaceCode,
		teammateId,
	)
	const conversationInfo = conversationRegistry.find(conversationId)

	const counterparties = conversationInfo
		? counterpartyTeammates(registry, conversationInfo)
		: []

	if (!conversationInfo) {
		return (
			<ConversationHeader>
				<div className="flex flex-row gap-2 justify-center items-center">
					<FallbackAvatarSkeleton />
					<Skeleton className={"h-4 w-[150px]"} />
				</div>
			</ConversationHeader>
		)
	}

	return (
		<ConversationHeader>
			{/*todo fix this !!*/}
			{counterparties.length > 1 ? (
				<Fragment>
					<FallbackAvatar teammate={counterparties[0]} />
					<h1 className="truncate text-md font-semibold">
						{" "}
						{displayCounterParty(
							counterpartyTeammates(registry, conversationInfo),
						)}{" "}
					</h1>
				</Fragment>
			) : (
				<Fragment>
					<FallbackAvatar teammate={counterparties[0]} />
					<h1
						aria-label="conversation-participant-fullname"
						className="text-md md:text-md font-semibold"
					>
						{displayCounterParty(
							counterpartyTeammates(registry, conversationInfo),
						)}
					</h1>
				</Fragment>
			)}
		</ConversationHeader>
	)
}
