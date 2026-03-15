import { useState, useRef, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils.ts"
import { User, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

export type EmailEntry = { id: string; email: string }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailPillInput({
	emails,
	setEmails,
	placeholder,
	disabled,
}: {
	emails: EmailEntry[]
	setEmails: (emails: EmailEntry[]) => void
	placeholder: string
	disabled: boolean
}) {
	const [inputValue, setInputValue] = useState("")

	const inputRef = useRef<HTMLInputElement>(null)

	const addEmail = (email: string) => {
		const trimmed = email.trim().toLowerCase()
		if (!trimmed || !emailRegex.test(trimmed)) return
		setEmails([...emails, { id: crypto.randomUUID(), email: trimmed }])
		setInputValue("")
	}

	const removeEmail = (id: string) => {
		setEmails(emails.filter((entry) => entry.id !== id))
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
			e.preventDefault()
			addEmail(inputValue)
		} else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
			removeEmail(emails[emails.length - 1].id)
		}
	}

	const handleBlur = () => {
		if (inputValue.trim()) addEmail(inputValue)
	}

	return (
		<label
			htmlFor="email-pill-input"
			className={cn(
				"flex flex-wrap gap-2 items-center min-h-9 max-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2",
				"overflow-y-auto overflow-x-hidden",
				"shadow-xs transition-colors focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
				disabled && "pointer-events-none opacity-50",
				"cursor-text",
			)}
		>
			{emails.map((entry) => (
				<Badge
					key={entry.id}
					variant="secondary"
					className="gap-1.5 pr-1 py-1 font-normal"
				>
					<User
						className="size-3.5 text-muted-foreground"
						data-slot="inline-start"
					/>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="truncate min-w-0 max-w-full block">
									{entry.email}
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>{entry.email}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							removeEmail(entry.id)
						}}
						className="rounded p-0.5 hover:bg-muted-foreground/20 -mr-0.5 cursor-pointer"
						aria-label={`Remove ${entry.email}`}
					>
						<X className="size-3.5" />
					</button>
				</Badge>
			))}
			<input
				id="email-pill-input"
				data-testid="email-pill-input"
				ref={inputRef}
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				disabled={disabled}
				placeholder={emails.length === 0 ? placeholder : "Enter email"}
				className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground py-1"
			/>
		</label>
	)
}
