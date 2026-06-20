import useTeammateConversationInfo from "@/features/conversation/api/list-conversation.ts"
import { useSearch } from "@tanstack/react-router"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import EnvoyeComposer from "@/features/conversation/components/composer/envoye-composer.tsx"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import ConversationHeader from "@/features/conversation/components/header.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import TextPart from "@/features/conversation/components/text-part.tsx"

export default function TeammateConversation() {
	const { code, conversationId } = useSearch({
		from: "/workspace/conversation",
	})

	const { data: conversationParticipated } = useTeammateConversationInfo(
		code,
		1,
	)
	const registry = useTeammateInfoRegistry(code)
	const conversationInfo = conversationParticipated?.find(
		(convo) => convo.id === conversationId,
	)
	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)
	const [messageContents, setMessageContents] = useState<MessageContent[]>([])

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
						{messageContents.map((content) => {
							const author = content.author
							const partSentAt = Date.now()
							return (
								<TextPart
									key={`${author.id}-${partSentAt}`}
									author={author}
									nodes={content.nodes}
								/>
							)
						})}
					</div>
				</ScrollArea>
				<div className="px-4 py-3">
					<EnvoyeComposer
						placeholder={`Message ${participantInfo.username}`}
						onSend={(nodes) => {
							if (currentTeammate) {
								setMessageContents((prev) => [
									...prev,
									{
										author: currentTeammate,
										nodes: nodes,
									},
								])
							}
						}}
					/>
				</div>
			</div>
		)
	)
}
