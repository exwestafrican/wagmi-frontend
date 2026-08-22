import type { Teammate } from "@envoye/features/workspace/interface/teammate.interface.ts"
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@common/components/ui/popover.tsx"
import { Badge } from "@common/components/ui/badge.tsx"
import { fullName } from "@envoye/features/directory/utils/teammate.ts"
import { Check, X } from "lucide-react"
import { type RefObject, useCallback, useEffect, useState } from "react"
import { DESKTOP_KEYS } from "@common/constants.ts"
import useTeammateFullNameSearch from "@envoye/features/directory/hooks/teammate-search.ts"
import { Separator } from "@common/components/ui/separator.tsx"
import { ScrollArea } from "@common/components/ui/scroll-area.tsx"
import FallbackAvatar from "@envoye/features/directory/component/fallback-avatar.tsx"
import { cn } from "@common/lib/utils.ts"

export default function RecipientPicker({
	inputRef,
	authorId,
	placeholder,
	workspaceCode,
	onSelect,
	isEditable,
}: {
	inputRef: RefObject<HTMLInputElement | null>
	authorId: number
	placeholder: string
	workspaceCode: string
	onSelect: (teammate: Teammate[]) => void
	isEditable: boolean
}) {
	const [open, setOpen] = useState(true)
	const [recipients, setRecipients] = useState<Teammate[]>([])
	const [queryText, setQueryText] = useState<string>("")

	const query = useTeammateFullNameSearch(workspaceCode)
	const queryResult = query(queryText).filter((result) => {
		if (recipients.length > 0) {
			return result.id !== authorId
		}
		return true
	})

	const resultFound = queryResult.length > 0

	const hasRecipients = recipients.length > 0
	const recipientHash = new Set(recipients.map((recipient) => recipient.id))

	function select(recipient: Teammate) {
		setQueryText("")
		setRecipients((prev) => [...prev, recipient])
		setOpen(false)
		onSelect([...recipients, recipient])
	}

	const focusInput = useCallback(() => {
		inputRef.current?.focus()
	}, [inputRef])

	useEffect(() => {
		if (recipients.length === 0) {
			focusInput()
		}
	}, [recipients, focusInput])

	useEffect(() => {
		if (!resultFound) setOpen(false)

		if (resultFound && queryText.trim().length > 0) setOpen(true)
	}, [resultFound, queryText])

	return (
		<Popover open={open}>
			<PopoverAnchor asChild>
				<div className="px-4 p-1 text-gray-600 flex items-center gap-2">
					<span className="text-xs"> To:</span>
					{recipients.map((recipient) => (
						<Badge
							key={recipient.id}
							className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200  text-xs shrink-0 max-w-48 truncate rounded-sm"
						>
							{fullName(recipient)}
							{isEditable && (
								<button
									type="button"
									onClick={() => {
										const newRecipients = recipients.filter(
											(savedRecipient) => savedRecipient.id !== recipient.id,
										)
										setRecipients(newRecipients)
										onSelect(newRecipients)
									}}
									aria-label={`Remove ${recipient.id}`}
									className="rounded p-0.5 hover:bg-muted-foreground/20 -mr-0.5 cursor-pointer text-black"
								>
									<X className="size-3.5" />
								</button>
							)}
						</Badge>
					))}
					<input
						id={"recipient-search"}
						aria-label="recipient-search"
						ref={inputRef}
						onFocus={() => setOpen(true)}
						value={queryText}
						type="text"
						className="outline-none text-xs text-black px-0 w-full capitalize"
						placeholder={hasRecipients ? "" : placeholder}
						onChange={(e) => {
							const value = e.target.value
							setQueryText(value)
						}}
						onKeyDown={(e) => {
							switch (e.key) {
								case DESKTOP_KEYS.ENTER: {
									e.preventDefault()
									const first = queryResult[0]
									if (first && !recipientHash.has(first.id)) {
										select(first)
									}
									break
								}
								case DESKTOP_KEYS.ESCAPE:
									e.preventDefault()
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
				className="p-0 flex space-y-0 flex-col  w-[calc(var(--radix-popover-trigger-width)-36px)]"
			>
				<ScrollArea>
					{queryResult.slice(0, 10).map((teammate) => {
						const isSelected = recipientHash.has(teammate.id)

						return (
							<button
								type="button"
								data-testid="teammate-suggestions"
								key={teammate.id}
								onClick={() => {
									if (!isSelected) {
										select(teammate)
									}
								}}
								className={cn(
									"text-xs px-3 py-2 text-black flex flex-row flex-1 items-center justify-between gap-2 w-full",
									isSelected
										? "opacity-60 cursor-default"
										: "cursor-pointer hover:bg-chestnut-brown/70",
								)}
								aria-label={`suggested teammate=${teammate.id}${isSelected ? ", selected" : ""}`}
							>
								<div className="flex items-center gap-2 min-w-0">
									<FallbackAvatar size="xs" teammate={teammate} />
									<div className="flex items-center gap-1">
										<span>{fullName(teammate)}</span> ~
										<span>{teammate.username}</span>
										{isSelected && (
											<Check className="size-3.5 shrink-0 text-violet-700" />
										)}
									</div>
								</div>
							</button>
						)
					})}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	)
}
