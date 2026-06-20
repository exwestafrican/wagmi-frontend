import ConversationHeader from "@/features/conversation/components/header.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import usePlaceholderName from "@/common/hooks/placeholder-names.ts"
import useTeammateFullNameSearch from "@/features/directory/hooks/teammate-search.ts"
import { useSearch } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@/components/ui/popover.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { DESKTOP_KEYS } from "@/constants.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { X } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar.tsx"
import EnvoyeComposer, {
	type EnvoyeComposerRef,
} from "@/features/conversation/components/composer/envoye-composer.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"
import { Chat } from "@/features/conversation/components/chat.tsx"
import { MessageList } from "@/features/conversation/components/message-list.tsx"

export function NewConversationPage() {
	const { code } = useSearch({
		from: "/workspace/new-conversation",
	})

	const query = useTeammateFullNameSearch(code)
	const placeholderName = usePlaceholderName()
	const inputRef = useRef<HTMLInputElement | null>(null)
	const composerRef = useRef<EnvoyeComposerRef>(null)
	const { data: currentTeammate } = useCurrentWorkspaceTeammate(code)

	const { setOpenMobile } = useSidebar()

	const [open, setOpen] = useState<boolean>(true)
	const [queryText, setQueryText] = useState<string>("")

	const [messageContents, setMessageContents] = useState<MessageContent[]>([])

	const [selectedTeammate, setSelectedTeammate] = useState<
		Teammate | undefined
	>(undefined)

	const queryResult = query(queryText)
	const resultFound = queryResult.length > 0

	useEffect(() => {
		if (!selectedTeammate) {
			inputRef.current?.focus()
		}
	}, [selectedTeammate])

	useEffect(() => {
		setOpenMobile(false)
	}, [setOpenMobile])

	useEffect(() => {
		if (selectedTeammate) {
			setOpen(false)
		}

		if (!resultFound) setOpen(false)

		if (resultFound && queryText.trim().length > 0) setOpen(true)
	}, [selectedTeammate, resultFound, queryText])

	function handleSelectionAndFocus(teammate: Teammate) {
		setQueryText("")
		setSelectedTeammate(teammate)
		setOpen(false)
		requestAnimationFrame(() => {
			composerRef.current?.focus()
		})
	}

	return (
		<Chat>
			<Chat.Header>
				<ConversationHeader>
					<h1 className="text-lg md:text-lg font-semibold">New Conversation</h1>
				</ConversationHeader>
				<Popover open={open}>
					<PopoverAnchor asChild>
						<div className="px-4 p-1 text-gray-600 flex items-center gap-2">
							<span className="text-xs"> To:</span>
							{selectedTeammate && (
								<Badge className="bg-purple-200 text-purple-900 dark:bg-purple-950 dark:text-purple-300 text-xs shrink-0 max-w-48 truncate rounded-sm">
									{fullName(selectedTeammate)}
									<button
										type="button"
										onClick={() => setSelectedTeammate(undefined)}
										aria-label={`Remove ${selectedTeammate.id}`}
										className="rounded p-0.5 hover:bg-muted-foreground/20 -mr-0.5 cursor-pointer text-black"
									>
										<X className="size-3.5" />
									</button>
								</Badge>
							)}
							{!selectedTeammate && (
								<input
									aria-label="recipient-search"
									ref={inputRef}
									onFocus={() => setOpen(true)}
									value={queryText}
									type="text"
									className="outline-none text-xs text-black px-2 w-full capitalize"
									placeholder={placeholderName}
									onChange={(e) => {
										const value = e.target.value
										setQueryText(value)
										setSelectedTeammate(undefined)
									}}
									onKeyDown={(e) => {
										switch (e.key) {
											case DESKTOP_KEYS.ENTER:
												e.preventDefault()
												handleSelectionAndFocus(queryResult[0])
												break
											case DESKTOP_KEYS.ESCAPE:
												e.preventDefault()
												setOpen(false)
												break
											default:
												break
										}
									}}
								/>
							)}
						</div>
					</PopoverAnchor>
					<Separator />
					<PopoverContent
						alignOffset={19}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onCloseAutoFocus={(e) => e.preventDefault()}
						className="p-0 flex space-y-0 flex-col  w-[calc(var(--radix-popover-trigger-width)-36px)]"
					>
						<ScrollArea>
							{queryResult.slice(0, 10).map((teammate) => (
								<button
									type="button"
									data-testid="teammate-suggestions"
									key={teammate.id}
									onClick={() => {
										handleSelectionAndFocus(teammate)
									}}
									className="text-xs px-3 py-2  text-black cursor-pointer hover:bg-chestnut-brown/70 flex flex-row flex-1 items-center gap-2 w-full"
									aria-label={`suggested teammate=${teammate.id}`}
								>
									{" "}
									<FallbackAvatar size="xs" teammate={teammate} />
									<div className="flex items-center gap-1">
										<span>{fullName(teammate)}</span> ~
										<span>{teammate.username}</span>
									</div>
								</button>
							))}
						</ScrollArea>
					</PopoverContent>
				</Popover>
			</Chat.Header>

			<Chat.Body>
				<MessageList messages={messageContents} />
			</Chat.Body>

			<Chat.Composer>
				<EnvoyeComposer
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
					}}
				/>
			</Chat.Composer>
		</Chat>
	)
}
