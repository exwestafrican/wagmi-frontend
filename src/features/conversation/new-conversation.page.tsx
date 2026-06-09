import ConversationHeader from "@/features/conversation/components/header.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import usePlaceholderName from "@/common/hooks/placeholder-names.ts"
import useTeammateFullNameSearch from "@/features/directory/hooks/teammate-search.ts"
import { useSearch } from "@tanstack/react-router"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
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
import EnvoyComposer from "@/features/conversation/components/composer/envoy-composer.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import TextPart from "@/features/conversation/components/text-part.tsx"
import { useCurrentWorkspaceTeammate } from "@/features/workspace/api/current-teammate.ts"

export function NewConversationPage() {
	const { code } = useSearch({
		from: "/workspace/new-conversation",
	})

	const query = useTeammateFullNameSearch(code)
	const placeholderName = usePlaceholderName()
	const inputRef = useRef<HTMLInputElement | null>(null)
	const composerRef = useRef<HTMLTextAreaElement | null>(null)
	const messageScrollRef = useRef<HTMLDivElement | null>(null)
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

	function handleSelection(teammate: Teammate) {
		setQueryText("")
		setSelectedTeammate(teammate)
		setOpen(false)
	}

	function scrollToLatestMessage() {
		const viewport = messageScrollRef.current?.querySelector(
			'[data-slot="scroll-area-viewport"]',
		) as HTMLElement | null
		if (viewport) {
			viewport.scrollTop = viewport.scrollHeight
		}
	}

	useLayoutEffect(() => {
		if (messageContents.length > 0) {
			scrollToLatestMessage()
		}
	}, [messageContents])

	return (
		<div className="flex flex-col h-svh min-h-0 overflow-hidden">
			<div className="shrink-0">
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
											setQueryText("")
											setSelectedTeammate(queryResult[0])
											setOpen(false)
											requestAnimationFrame(() => {
												composerRef.current?.focus()
											})
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
									handleSelection(teammate)
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
			</div>
			<div ref={messageScrollRef} className="flex-1 min-h-0">
				<ScrollArea className="h-full">
					<div className="px-4 py-3 flex flex-col gap-3">
						{messageContents.map((content) => {
							const author = content.author
							return (
								<TextPart
									key={`${content.nodes.map((n) => n.id).join("-")}`}
									author={author}
									nodes={content.nodes}
								/>
							)
						})}
					</div>
				</ScrollArea>
			</div>
			<div className="shrink-0 px-4 pt-4 pb-6">
				<EnvoyComposer
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
			</div>
		</div>
	)
}
