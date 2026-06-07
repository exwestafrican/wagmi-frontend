import useTeammateConversationInfo from "@/features/conversation/api/list-conversation.ts"
import { useSearch } from "@tanstack/react-router"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import LegacyTextPart from "@/features/conversation/components/text-part.legacy.tsx"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import useConversationParts, {
	type ConversationPart,
} from "@/features/conversation/api/conversation-parts.ts"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import EnvoyComposer from "@/features/conversation/components/composer/envoy-composer.tsx"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import ConversationHeader from "@/features/conversation/components/header.tsx"

export default function TeammateConversation() {
	const { code, conversationId } = useSearch({
		from: "/workspace/conversation",
	})

	const { data: conversationParticipated } = useTeammateConversationInfo(
		code,
		1,
	)
	const registry = useTeammateInfoRegistry(code)
	const { data: conversationParts } = useConversationParts(code, conversationId)
	const conversationInfo = conversationParticipated?.find(
		(convo) => convo.id === conversationId,
	)
	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)

	const [localParts, setLocalParts] = useState<ConversationPart[]>([])

	const allParts = conversationParts
		? [...conversationParts, ...localParts]
		: localParts

	const participantInfo = conversationInfo
		? registry.find(conversationInfo.recipientId)
		: undefined

	return (
		participantInfo && (
			<div className="flex flex-col h-full min-h-0">
				<ConversationHeader>
					<FallbackAvatar teammate={participantInfo} />
					<h1 className="text-lg md:text-lg font-semibold">
						{" "}
						{fullName(participantInfo)}{" "}
					</h1>
				</ConversationHeader>
				<ScrollArea className="flex-1 min-h-0">
					<div className="px-4 py-3 flex flex-col gap-3 flex-1 ">
						{allParts.map((part) => {
							const author = registry.find(part.authorId)
							return (
								author && (
									<LegacyTextPart
										key={`${part.authorId}-${part.sentAt}`}
										author={author}
										content={[{ msg: part.content, timestamp: part.sentAt }]}
									/>
								)
							)
						})}
					</div>
				</ScrollArea>
				<div className="px-4 py-3">
					<EnvoyComposer
						onSend={() => {}}
						onEnter={(textInput) =>
							setLocalParts((prev) => [
								...prev,
								{
									authorId: currentTeammate?.id ?? 0,
									content: textInput,
									sentAt: Date.now(),
								},
							])
						}
					/>
				</div>
			</div>
		)
	)
}
