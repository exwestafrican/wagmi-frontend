import useTeammateConversationInfo from "@/features/conversation/api/list-conversation.ts"
import { useSearch } from "@tanstack/react-router"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import { useState } from "react"
import EnvoyeComposer from "@/features/conversation/components/composer/envoye-composer.tsx"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import ConversationHeader from "@/features/conversation/components/header.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { Chat } from "@/features/conversation/components/chat.tsx"
import { MessageList } from "@/features/conversation/components/message-list.tsx"

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
			<Chat>
				<Chat.Header>
					<ConversationHeader>
						<FallbackAvatar teammate={participantInfo} />
						<h1 className="text-lg md:text-lg font-semibold">
							{fullName(participantInfo)}
						</h1>
					</ConversationHeader>
				</Chat.Header>

				<Chat.Body>
					<MessageList messages={messageContents} />
				</Chat.Body>

				<Chat.Composer>
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
				</Chat.Composer>
			</Chat>
		)
	)
}
