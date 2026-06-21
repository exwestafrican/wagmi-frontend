import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@/components/ui/popover.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import { X } from "lucide-react"
import { type RefObject, useCallback, useEffect, useState } from "react"
import { DESKTOP_KEYS } from "@/constants.ts"
import useTeammateFullNameSearch from "@/features/directory/hooks/teammate-search.ts"
import { Separator } from "@/components/ui/separator.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"

export default function RecipientPicker({
	inputRef,
	placeholder,
	workspaceCode,
	onSubmit,
}: {
	inputRef: RefObject<HTMLInputElement | null>
	placeholder: string
	workspaceCode: string
	onSubmit: (teammate: Teammate | undefined) => void
}) {
	const [open, setOpen] = useState(false)
	const [recipient, setRecipient] = useState<Teammate | undefined>(undefined)
	const [queryText, setQueryText] = useState<string>("")

	const query = useTeammateFullNameSearch(workspaceCode)
	const queryResult = query(queryText)

	const resultFound = queryResult.length > 0

	function submit(teammate: Teammate | undefined) {
		setQueryText("")
		setRecipient(teammate)
		setOpen(false)
		onSubmit(teammate)
	}

	const focusInput = useCallback(() => {
		inputRef.current?.focus()
	}, [inputRef])

	useEffect(() => {
		if (!recipient) {
			focusInput()
		}
	}, [recipient, focusInput])

	useEffect(() => {
		if (recipient) {
			setOpen(false)
		}

		if (!resultFound) setOpen(false)

		if (resultFound && queryText.trim().length > 0) setOpen(true)
	}, [recipient, resultFound, queryText])

	return (
		<Popover open={open}>
			<PopoverAnchor asChild>
				<div className="px-4 p-1 text-gray-600 flex items-center gap-2">
					<span className="text-xs"> To:</span>
					{recipient ? (
						<Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200  text-xs shrink-0 max-w-48 truncate rounded-sm">
							{fullName(recipient)}
							<button
								type="button"
								onClick={() => setRecipient(undefined)}
								aria-label={`Remove ${recipient.id}`}
								className="rounded p-0.5 hover:bg-muted-foreground/20 -mr-0.5 cursor-pointer text-black"
							>
								<X className="size-3.5" />
							</button>
						</Badge>
					) : (
						<input
							aria-label="recipient-search"
							ref={inputRef}
							onFocus={() => setOpen(true)}
							value={queryText}
							type="text"
							className="outline-none text-xs text-black px-2 w-full capitalize"
							placeholder={placeholder}
							onChange={(e) => {
								const value = e.target.value
								setQueryText(value)
								setRecipient(undefined)
							}}
							onKeyDown={(e) => {
								switch (e.key) {
									case DESKTOP_KEYS.ENTER:
										e.preventDefault()
										submit(queryResult[0])
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
								submit(teammate)
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
	)
}
