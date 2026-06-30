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
import {
	ConversationIntro,
	ConversationIntroSkeleton,
} from "@/features/conversation/components/conversation-intro.tsx"
import RecipientPicker from "@/features/conversation/components/recipient-picker.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import ConversationParticipant from "@/features/conversation/components/conversation-participant.tsx"
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
} from "@/features/conversation/api/chat-history.ts"
import { useSendReply } from "@/features/conversation/api/send-reply.ts"

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
	const [selectedTeammate, setSelectedTeammate] = useState<
		Teammate | undefined
	>(undefined)

	const { setOpenMobile } = useSidebar()
	const { mutate: sendNewMessage, isPending: isSendingNewMessage } =
		useSendNewMessage()
	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)
	const [mostRecentChatHistory] = useState<MessageContent | undefined>(
		undefined,
	)

	const { data: chatHistory } = useChatHistory(
		code,
		conversationId,
		mostRecentChatHistory?.createdAt,
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
		? counterpartyTeammates(registry, conversationInfo)[0]
		: undefined

	useEffect(() => {
		setOpenMobile(false)
	}, [setOpenMobile])

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset draft state when conversationId changes
	useEffect(() => {
		setSelectedTeammate(undefined)
		setNewMessageContents([])
	}, [conversationId])

	const noTeammateSelected = selectedTeammate === undefined
	const isNewConversation = conversationId === 0

	const introTeammate = isNewConversation ? selectedTeammate : counterparty

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
					recipientTeammateId: recipients[0].id,
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
						addChatHistoryToQueryCache(queryClient, code, data.id, [
							{ ...message, sent: true },
						])
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
				{/*TODO: add loading state for chat body*/}
				<div className="space-y-6">
					{introTeammate ? (
						<ConversationIntro
							teammate={introTeammate}
							isWithSelf={introTeammate.id === currentTeammateId}
						/>
					) : (
						<ConversationIntroSkeleton />
					)}

					{messageContents.length > 0 && (
						<>
							<Separator />
							<MessageList workspaceCode={code} messages={messageContents} />
						</>
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
						introTeammate == null
							? "Start a new message"
							: `Message ${introTeammate.username}`
					}
					onSend={(nodes) => {
						if (currentTeammate) {
							const newMessage: MessageContent = {
								id: crypto.randomUUID(),
								authorId: currentTeammate.id,
								nodes: nodes,
								sent: false,
								createdAt: Date.now(),
							}

							if (isNewConversation && selectedTeammate) {
								openNewConversationOrNavigateToExistingConversation(
									currentTeammate,
									[selectedTeammate],
									newMessage,
								)
							} else {
								addChatHistoryToQueryCache(queryClient, code, conversationId, [
									...messageContents,
									{ ...newMessage, sent: true },
								])
								//TODO: on success invalidate messages cache
								reply({
									workspaceCode: code,
									conversationId,
									message: newMessage.nodes.flatMap((n) => n.content.join(" ")),
									sentAt: newMessage.createdAt,
								})
							}
						}
						requestAnimationFrame(() => {
							requestAnimationFrame(() => {
								chatBodyRef.current?.scrollIntoView({
									block: "end",
									behavior: "auto",
								})
							})
						})
					}}
				/>
			</Chat.Composer>
		</Chat>
	)
}
