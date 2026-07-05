import ConversationHeader from "@/features/conversation/components/header.tsx"
import usePlaceholderName from "@/common/hooks/placeholder-names.ts"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { useSidebar } from "@/components/ui/sidebar.tsx"
import EnvoyeComposer, {
	type EnvoyeComposerRef,
} from "@/features/conversation/components/composer/envoye-composer.tsx"
import {
	type MessageContent,
	MessageState,
} from "@/features/conversation/interface/text-node.ts"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import {
	Chat,
	type ChatBodyRef,
} from "@/features/conversation/components/chat.tsx"
import { MessageList } from "@/features/conversation/components/message-list.tsx"
import RecipientPicker from "@/features/conversation/components/recipient-picker.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import useConversationInfoRegistry from "@/features/conversation/hooks/conversation-info-registry.ts"
import { counterpartyTeammates } from "@/features/conversation/utils/participants.ts"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import useSendNewMessage from "@/features/conversation/api/new-message.ts"
import {
	addConversationToQueryCache,
	TEAMMATE_CONVERSATION_LIST,
} from "@/features/conversation/api/list-conversation.ts"
import { useQueryClient } from "@tanstack/react-query"
import useChatHistory, {
	addChatHistoryToQueryCache,
	updateChatHistoryStateInStore,
} from "@/features/conversation/api/chat-history.ts"
import { useMessagePolling } from "@/features/conversation/hooks/use-message-polling.ts"
import { useSendReply } from "@/features/conversation/api/send-reply.ts"
import { ConversationParticipantInfo } from "@/features/conversation/components/conversation-participant-info.tsx"
import ConversationParticipants from "@/features/conversation/components/conversation-participants.tsx"

export function NewConversationPage() {
	const { code, conversationId } = useSearch({
		from: "/workspace/conversation",
	})

	const inputRef = useRef<HTMLInputElement | null>(null)
	const composerRef = useRef<EnvoyeComposerRef>(null)
	const chatBodyRef = useRef<ChatBodyRef>(null)

	const [newMessageContents, setNewMessageContents] = useState<
		MessageContent[]
	>([])

	const [selectedRecipients, setSelectedRecipients] = useState<Teammate[]>([])

	const { setOpenMobile } = useSidebar()
	const { mutate: sendNewMessage, isPending: isSendingNewMessage } =
		useSendNewMessage()
	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)

	const { data: chatHistory, isLoading: isLoadingChatHistory } = useChatHistory(
		code,
		conversationId,
		undefined,
	)

	const { mutate: reply } = useSendReply()

	const currentTeammateId = currentTeammate?.id ?? 0
	const placeholderName = usePlaceholderName()
	const conversationRegistry = useConversationInfoRegistry(
		code,
		currentTeammateId,
	)
	const registry = useTeammateInfoRegistry(code)
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const conversationInfo = conversationRegistry.find(conversationId)
	const counterparty = conversationInfo
		? counterpartyTeammates(registry, conversationInfo)
		: []

	useMessagePolling(code, conversationId)

	useEffect(() => {
		setOpenMobile(false)
	}, [setOpenMobile])

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset draft state when conversationId changes
	useEffect(() => {
		setSelectedRecipients([])
		setNewMessageContents([])
	}, [conversationId])

	const noTeammateSelected = selectedRecipients.length === 0
	const isNewConversation = conversationId === 0

	// const introTeammate = isNewConversation ? selectedTeammate : counterparty
	const participants = (
		isNewConversation ? selectedRecipients : counterparty
	).filter((p) => p !== undefined)

	const messageContents = [
		...(chatHistory ?? []),
		...newMessageContents.filter(
			(pending) => !chatHistory?.some((saved) => saved.id === pending.id),
		),
	]

	function openNewConversationOrNavigateToExistingConversation(
		sender: Teammate,
		recipients: Teammate[],
		message: MessageContent,
	) {
		const hasContent = message.nodes.some((node) =>
			node.content.join("").trim(),
		)
		if (!hasContent) return

		const prevConversation = conversationRegistry.findIfExists(
			sender.id,
			recipients.map((recipient) => recipient.id),
		)

		if (prevConversation) {
			//TODO: move this to an on select teammate operation.
			navigate({
				from: "/workspace/conversation",
				search: { code: code, conversationId: prevConversation.id },

				replace: true,
			})
		} else {
			setNewMessageContents((previous) => [...previous, message])
			sendNewMessage(
				{
					recipientTeammateIds: recipients.map((r) => r.id),
					workspaceCode: code,
					openingMessage: message.nodes.flatMap((n) => n.content.join(" ")),
					sentAt: message.createdAt,
				},
				{
					onSuccess: ({ data }) => {
						addConversationToQueryCache(queryClient, code, sender.id, {
							id: data.id,
							authorId: sender.id,
							counterParties: [recipients[0].id],
						})
						addChatHistoryToQueryCache(queryClient, code, data.id, {
							...message,
							state: MessageState.SENT,
						})
						navigate({
							from: "/workspace/conversation",
							search: { code: code, conversationId: data.id },
							replace: true,
						})
						queryClient.invalidateQueries({
							queryKey: [TEAMMATE_CONVERSATION_LIST, code],
						})
					},
				},
			)
		}
	}

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
						authorId={currentTeammateId}
						placeholder={placeholderName}
						workspaceCode={code}
						onSelect={(recipients) => {
							setSelectedRecipients(recipients)
							requestAnimationFrame(() => {
								composerRef.current?.focus()
							})
						}}
						isEditable={!isSendingNewMessage} // We add this so user cannot edit selected teammate while sending
					/>
				</Chat.Header>
			) : (
				<Chat.Header>
					<ConversationParticipants
						workspaceCode={code}
						conversationId={conversationId}
						teammateId={currentTeammateId}
					/>
				</Chat.Header>
			)}

			<Chat.Body
				ref={chatBodyRef}
				isLoading={isLoadingChatHistory}
				scrollKey={messageContents.length}
			>
				{/*TODO: add loading state for chat body*/}
				<div className="space-y-1">
					{participants.length > 0 && (
						<ConversationParticipantInfo
							participants={participants}
							authorId={currentTeammateId}
						/>
					)}

					{messageContents.length > 0 && (
						<div className="animate-in fade-in duration-300">
							<MessageList
								workspaceCode={code}
								messages={messageContents}
								conversationId={conversationId}
							/>
						</div>
					)}
				</div>
			</Chat.Body>
			<Chat.Composer>
				<EnvoyeComposer
					disableInput={isSendingNewMessage}
					disableSend={
						(isNewConversation && noTeammateSelected) || isSendingNewMessage
					}
					ref={composerRef}
					placeholder={
						participants.length === 0
							? "Start a new message"
							: `Message ${participants.map((t) => t?.username).join(", ")}`
					}
					onSend={(nodes) => {
						if (currentTeammate) {
							const createdAt = Date.now()
							const newMessage: MessageContent = {
								id: createdAt + currentTeammate.id,
								authorId: currentTeammate.id,
								nodes: nodes,
								state: MessageState.SENDING,
								createdAt: createdAt,
							}

							if (isNewConversation) {
								openNewConversationOrNavigateToExistingConversation(
									currentTeammate,
									selectedRecipients,
									newMessage,
								)
							} else {
								addChatHistoryToQueryCache(
									queryClient,
									code,
									conversationId,
									newMessage,
								)
								reply(
									{
										workspaceCode: code,
										conversationId,
										message: newMessage,
										sentAt: newMessage.createdAt,
									},
									{
										onSuccess: async () => {
											await updateChatHistoryStateInStore(
												queryClient,
												code,
												conversationId,
												newMessage.id,
												MessageState.SENT,
											)
											//TODO: on success invalidate messages cache -> maybe polling is enough here
										},

										onError: () => {
											updateChatHistoryStateInStore(
												queryClient,
												code,
												conversationId,
												newMessage.id,
												MessageState.FAILED,
											)
										},
									},
								)
							}
						}
					}}
				/>
			</Chat.Composer>
		</Chat>
	)
}
