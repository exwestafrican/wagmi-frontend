import { useSearch } from "@tanstack/react-router"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import { useState } from "react"
import EnvoyeComposer from "@/features/conversation/components/composer/envoye-composer.tsx"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import ConversationHeader from "@/features/conversation/components/header.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { Chat } from "@/features/conversation/components/chat.tsx"
import { MessageList } from "@/features/conversation/components/message-list.tsx"
import useTeammateConversations from "@/features/conversation/api/list-conversation.ts"
import {
	counterpartyTeammates,
	displayName,
} from "@/features/conversation/utils/participants.ts"

export default function TeammateConversation() {
	const { code, conversationId } = useSearch({
		from: "/workspace/conversation",
	})

	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)
	const { data: conversationParticipated } = useTeammateConversations(
		code,
		currentTeammate?.id ?? 0,
	)
	const registry = useTeammateInfoRegistry(code)
	const conversationInfo = conversationParticipated?.find(
		(convo) => convo.id === conversationId,
	)
	const [messageContents, setMessageContents] = useState<MessageContent[]>([])

	const counterparty = conversationInfo
		? counterpartyTeammates(registry, conversationInfo)[0]
		: undefined

	return (
		counterparty &&
		conversationInfo && (
			<Chat>
				<Chat.Header>
					<ConversationHeader>
						<FallbackAvatar teammate={counterparty} />
						<h1 className="text-lg md:text-lg font-semibold">
							{displayName(counterpartyTeammates(registry, conversationInfo))}
						</h1>
					</ConversationHeader>
				</Chat.Header>

				<Chat.Body>
					<MessageList messages={messageContents} />
				</Chat.Body>

				<Chat.Composer>
					<EnvoyeComposer
						disabled={false}
						placeholder={`Message ${counterparty.username}`}
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
