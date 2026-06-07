import ConversationHeader from "@/features/conversation/components/header.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import usePlaceholderName from "@/common/hooks/placeholder-names.ts"
import useTeammateFullNameSearch from "@/features/directory/hooks/teammate-search.ts"
import { useSearch } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@/components/ui/popover.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"

const DESKTOP_KEYS = {
	ENTER: "Enter",
	ESCAPE: "Escape",
}

export function NewConversationPage() {
	const { code } = useSearch({
		from: "/workspace/new-conversation",
	})

	const [queryText, setQueryText] = useState<string>("")
	const [selectedTeammate, setSelectedTeammate] = useState<
		Teammate | undefined
	>(undefined)

	const [open, setOpen] = useState<boolean>(true)

	const placeholderName = usePlaceholderName()
	const query = useTeammateFullNameSearch(code)

	const queryResult = query(queryText)

	useEffect(() => {
		if (queryResult.length === 0 || selectedTeammate !== undefined) {
			setOpen(false)
		}
	}, [queryResult, selectedTeammate])

	return (
		<div className="flex flex-col h-full min-h-0">
			<ConversationHeader>
				<h1 className="text-lg md:text-lg font-semibold">New Conversation</h1>
			</ConversationHeader>
			<Popover open={open}>
				<PopoverAnchor asChild>
					<div className="px-4 p-1 text-gray-600 flex">
						<span className="text-xs"> To:</span>
						<input
							autoFocus
							onFocus={() => {
								console.log("focus")
								setOpen(true)
							}}
							onBlur={() => {
								console.log("blur")
							}}
							value={queryText}
							type="text"
							className="outline-none text-xs text-black px-2 w-full capitalize"
							placeholder={placeholderName}
							onChange={(e) => {
								const input = e.target.value
								setQueryText(input)
								setSelectedTeammate(undefined)
							}}
							onKeyDown={(e) => {
								console.log("enter", e.key)
								console.log(e.key, "key code")
								switch (e.key) {
									case DESKTOP_KEYS.ENTER:
										setQueryText("")
										setSelectedTeammate(queryResult[0])
										console.log("after enter key", queryResult[0])
										break
									case DESKTOP_KEYS.ESCAPE:
										setOpen(false)
										break
									default:
										break
								}
							}}
						/>
					</div>
				</PopoverAnchor>
				<Separator />

				<PopoverContent
					alignOffset={19}
					onOpenAutoFocus={(e) => e.preventDefault()}
					onCloseAutoFocus={(e) => e.preventDefault()}
					className="px-0 flex space-y-0 flex-col  w-[calc(var(--radix-popover-trigger-width)-36px)]"
				>
					<ScrollArea>
						{queryResult.slice(0, 10).map((teammate) => (
							<div
                                data-testid="teammate-suggestions"
								key={teammate.id}
								onClick={() => {
									setQueryText(fullName(teammate))
									setSelectedTeammate(teammate)
								}}
								className="text-xs px-3 py-2  text-black cursor-pointer hover:bg-chestnut-brown/70 flex flex-row flex-1 items-center gap-2 "
							>
								{" "}
								<FallbackAvatar size="xs" teammate={teammate} />
								<div className="flex items-center gap-1">
									<span>{fullName(teammate)}</span>
									<div className="w-0.5 h-4 bg-black rounded-sm"></div>
									<span>{teammate.username}</span>
								</div>
							</div>
						))}
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</div>
	)
}
