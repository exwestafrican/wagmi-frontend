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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function EmailPillInput({
	emails,
	setEmails,
	placeholder,
	disabled,
}: {
	emails: string[]
	setEmails: (emails: string[]) => void
	placeholder: string
	disabled: boolean
}) {
	const [inputValue, setInputValue] = useState("")

	const inputRef = useRef<HTMLInputElement>(null)

	const addEmail = (email: string) => {
		const trimmed = email.trim().toLowerCase()
		if (!trimmed || !emailRegex.test(trimmed)) return
		if (emails.includes(trimmed)) return
		setEmails([...emails, trimmed])
		setInputValue("")
	}

	const removeEmail = (index: number) => {
		setEmails(emails.filter((_, i) => i !== index))
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
			e.preventDefault()
			addEmail(inputValue)
		} else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
			removeEmail(emails.length - 1)
		}
	}

	const handleBlur = () => {
		if (inputValue.trim()) addEmail(inputValue)
	}

	return (
		<div
			className={cn(
				"flex flex-wrap gap-2 items-center min-h-9 max-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2",
				"overflow-y-auto overflow-x-hidden",
				"shadow-xs transition-colors focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
				disabled && "pointer-events-none opacity-50",
			)}
			onClick={() => !disabled && inputRef.current?.focus()}
		>
			{emails.map((email, index) => (
				<Badge
					key={`${email}-${index}`}
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
									{email}
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>{email}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							removeEmail(index)
						}}
						className="rounded p-0.5 hover:bg-muted-foreground/20 -mr-0.5 cursor-pointer"
						aria-label={`Remove ${email}`}
					>
						<X className="size-3.5" />
					</button>
				</Badge>
			))}
			<input
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
		</div>
	)
}

//TODO on close clear email
// On submit clear emails
// button is disabled if email is empty


//TODO checkbox
// |"enter email" in a very light  place holder format