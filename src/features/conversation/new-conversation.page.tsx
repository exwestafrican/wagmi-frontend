import ConversationHeader from "@/features/conversation/components/header.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import usePlaceholderName from "@/common/hooks/placeholder-names.ts"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { useSidebar } from "@/components/ui/sidebar.tsx"
import EnvoyeComposer, {
	type EnvoyeComposerRef,
} from "@/features/conversation/components/composer/envoye-composer.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import {
	Chat,
	type ChatBodyRef,
} from "@/features/conversation/components/chat.tsx"
import { MessageList } from "@/features/conversation/components/message-list.tsx"
import { ConversationIntro } from "@/features/conversation/components/conversation-intro.tsx"
import RecipientPicker from "@/features/conversation/components/recipient-picker.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import ConversationParticipant from "@/features/conversation/components/conversation-participant.tsx"
import useConversationInfoRegistry from "@/features/conversation/hooks/conversation-info-registry.ts"
import { counterpartyTeammates } from "@/features/conversation/utils/participants.ts"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"

export function NewConversationPage() {
	const { code, conversationId } = useSearch({
		from: "/workspace/conversation",
	})

	const inputRef = useRef<HTMLInputElement | null>(null)
	const composerRef = useRef<EnvoyeComposerRef>(null)
	const chatBodyRef = useRef<ChatBodyRef>(null)

	const [messageContents, setMessageContents] = useState<MessageContent[]>([])
	const [selectedTeammate, setSelectedTeammate] = useState<
		Teammate | undefined
	>(undefined)

	const { setOpenMobile } = useSidebar()
	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)
	const currentTeammateId = currentTeammate?.id ?? 0
	const placeholderName = usePlaceholderName()
	const conversationRegistry = useConversationInfoRegistry(
		code,
		currentTeammateId,
	)
	const registry = useTeammateInfoRegistry(code)

	const navigate = useNavigate()

	const prevMessageContent: MessageContent[] = [] // use the URL  to fetch this -> pass in conversationId
	const conversationInfo = conversationRegistry.find(conversationId)
	const counterparty = conversationInfo
		? counterpartyTeammates(registry, conversationInfo)[0]
		: undefined

	useEffect(() => {
		setOpenMobile(false)
	}, [setOpenMobile])

    // biome-ignore lint/correctness/useExhaustiveDependencies: reset draft state when conversationId changes
    useEffect(() => {
		setSelectedTeammate(undefined)
        setMessageContents([])
	}, [conversationId])
	//clear message content and selected teammate

	const noTeammateSelected = selectedTeammate === undefined
	const isNewConversation = conversationId === 0

	const introTeammate = isNewConversation ? selectedTeammate : counterparty
	// if conversation exists navigate user to existing conversation
	// filter out people we have alteady sent
	// on send, add text to ui -> sendNewText -> navigate to new conversation page

	return (
		<Chat>
			{isNewConversation ? (
				<Chat.Header>
					<ConversationHeader>
						<h1 className="text-lg md:text-lg font-semibold">
							New Conversation
						</h1>
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
			) : (
				<Chat.Header>
					<ConversationParticipant
						conversationId={conversationId}
						workspaceCode={code}
						teammateId={currentTeammate?.id ?? 0}
					/>
				</Chat.Header>
			)}

			<Chat.Body ref={chatBodyRef} scrollKey={messageContents.length}>
				<div className="space-y-6">
					{introTeammate && (
						<ConversationIntro
							teammate={introTeammate}
							isWithSelf={introTeammate.id === currentTeammateId}
						/>
					)}

					{messageContents.length > 0 && (
						<>
							<Separator />
							<MessageList
								messages={[...prevMessageContent, ...messageContents]}
							/>
						</>
					)}
				</div>
			</Chat.Body>
			<Chat.Composer>
				<EnvoyeComposer
					disabled={isNewConversation && noTeammateSelected}
					ref={composerRef}
					placeholder={
						introTeammate == null
							? "Start a new message"
							: `Message ${introTeammate.username}`
					}
					onSend={(nodes) => {
						if (currentTeammate ) {
							setMessageContents((prev) => [
								...prev,
								{
									author: currentTeammate,
									nodes: nodes,
								},
							])

                            if(selectedTeammate) {
                                const prevConversation = conversationRegistry.findIfExists(
                                    currentTeammate.id,
                                    [selectedTeammate.id],
                                )

                                if (prevConversation) {
                                    // fetch conversation

                                    navigate({
                                        from: "/workspace",
                                        to: "/workspace/conversation",
                                        search: {
                                            code: code,
                                            conversationId: prevConversation.id,
                                        },
                                    })
                                }
                            }

							// disable conversation picker
							// create new conversation
							// navigate user.
						}
						requestAnimationFrame(() => {
							requestAnimationFrame(() => {
								chatBodyRef.current?.scrollIntoView({
									block: "end",
									behavior: "auto",
								})
							})
						})
						// sendNewMessage
						// create conversation => with opening line.
						// navigate user to new conversation screen
					}}
				/>
			</Chat.Composer>
		</Chat>
	)
}
