import ConversationHeader from "@/features/conversation/components/header.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import usePlaceholderName from "@/common/hooks/placeholder-names.ts"
import { useSearch } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { useSidebar } from "@/components/ui/sidebar.tsx"
import EnvoyeComposer, {
	type EnvoyeComposerRef,
} from "@/features/conversation/components/composer/envoye-composer.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import { Chat } from "@/features/conversation/components/chat.tsx"
import { MessageList } from "@/features/conversation/components/message-list.tsx"
import { ConversationIntro } from "@/features/conversation/components/conversation-intro.tsx"
import RecipientPicker from "@/features/conversation/components/recipient-picker.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

export function NewConversationPage() {
	const { code } = useSearch({
		from: "/workspace/new-conversation",
	})

	const inputRef = useRef<HTMLInputElement | null>(null)
	const composerRef = useRef<EnvoyeComposerRef>(null)

	const placeholderName = usePlaceholderName()

	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)
	const { setOpenMobile } = useSidebar()

	const [messageContents, setMessageContents] = useState<MessageContent[]>([])

	const [selectedTeammate, setSelectedTeammate] = useState<
		Teammate | undefined
	>(undefined)

	useEffect(() => {
		setOpenMobile(false)
	}, [setOpenMobile])

	const noTeammateSelected = selectedTeammate === undefined
	// if conversation exists navigate user to existing conversation
	// filter out people we have alteady sent
	// on send, add text to ui -> sendNewText -> navigate to new conversation page

	return (
		<Chat>
			<Chat.Header>
				<ConversationHeader>
					<h1 className="text-lg md:text-lg font-semibold">New Conversation</h1>
				</ConversationHeader>
				<RecipientPicker
					inputRef={inputRef}
					placeholder={placeholderName}
					workspaceCode={code}
					onSubmit={(teammate) => {
						setSelectedTeammate(teammate)
						requestAnimationFrame(() => {
							composerRef.current?.focus()
						})
					}}
				/>
			</Chat.Header>

			<Chat.Body>
				<div className="space-y-6">
					{selectedTeammate && (
						<ConversationIntro
							teammate={selectedTeammate}
							isWithSelf={selectedTeammate.id === currentTeammate?.id}
						/>
					)}
					{messageContents.length > 0 && (
						<>
							<Separator />
							<MessageList messages={messageContents} />
						</>
					)}
				</div>
			</Chat.Body>

			<Chat.Composer>
				<EnvoyeComposer
					disabled={noTeammateSelected}
					ref={composerRef}
					placeholder={"Start a new message"}
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
						// sendNewMessage
						// create conversation => with opening line.
						// navigate user to new conversation screen
					}}
				/>
			</Chat.Composer>
		</Chat>
	)
}
