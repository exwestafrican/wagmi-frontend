import { useSearch } from "@tanstack/react-router"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import {useEffect, useRef, useState} from "react"
import EnvoyeComposer, {type EnvoyeComposerRef} from "@/features/conversation/components/composer/envoye-composer.tsx"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import ConversationHeader from "@/features/conversation/components/header.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { Chat } from "@/features/conversation/components/chat.tsx"
import { MessageList } from "@/features/conversation/components/message-list.tsx"
import useTeammateConversations from "@/features/conversation/api/list-conversation.ts"

export default function TeammateConversation() {
	const { code, conversationId } = useSearch({
		from: "/workspace/conversation",
	})

    const composerRef = useRef<EnvoyeComposerRef>(null)

	const { data: conversationParticipated } = useTeammateConversations(code)
	const registry = useTeammateInfoRegistry(code)
	const conversationInfo = conversationParticipated?.find(
		(convo) => convo.id === conversationId,
	)
	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)
	const [messageContents, setMessageContents] = useState<MessageContent[]>([])

	const participantInfo =
		conversationInfo?.participantIds[0] && conversationInfo
			? registry.find(conversationInfo.participantIds[0])
			: undefined

    useEffect(() => {
        composerRef.current?.focus()
    })

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

				<Chat.Body scrollKey={messageContents.length}>
					<MessageList messages={messageContents} />
				</Chat.Body>

				<Chat.Composer>
					<EnvoyeComposer
                        ref={composerRef}
						placeholder={`Message ${participantInfo.username}`}
						onSend={(nodes) => {
							if (currentTeammate) {
								const mostRecentMessage: MessageContent = {
									id: crypto.randomUUID(),
									author: currentTeammate,
									nodes: nodes,
									sent: false,
								}

								setMessageContents((prev) => [...prev, mostRecentMessage])
							}
						}}
					/>
				</Chat.Composer>
			</Chat>
		)
	)
}
