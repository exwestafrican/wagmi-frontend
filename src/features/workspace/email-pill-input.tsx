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

const maxEntriesErrorText = (max: number) =>
	max === 1 ? "Maximum of 1 email." : `Maximum of ${max} emails.`

export function EmailPillInput({
	emailEntries,
	setEmailEntries,
	placeholder,
	disabled,
	maxEmailEntries,
}: {
	emailEntries: EmailEntry[]
	setEmailEntries: (emailEntry: EmailEntry[]) => void
	placeholder: string
	disabled: boolean
	maxEmailEntries: number
}) {
	const [inputValue, setInputValue] = useState("")

	const inputRef = useRef<HTMLInputElement>(null)

	const overMax = emailEntries.length > maxEmailEntries

	const addEmail = (email: string) => {
		const trimmed = email.trim().toLowerCase()
		if (!trimmed || !emailRegex.test(trimmed)) return
		setEmailEntries([
			...emailEntries,
			{ id: crypto.randomUUID(), email: trimmed },
		])
		setInputValue("")
	}

	const removeEmail = (id: string) => {
		setEmailEntries(emailEntries.filter((entry) => entry.id !== id))
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
			e.preventDefault()
			addEmail(inputValue)
		} else if (
			e.key === "Backspace" &&
			!inputValue &&
			emailEntries.length > 0
		) {
			removeEmail(emailEntries[emailEntries.length - 1].id)
		}
	}

	const handleBlur = () => {
		if (inputValue.trim()) addEmail(inputValue)
	}

	const maxErrorId = "email-pill-max-error"
	const showMaxError = overMax

	return (
		<label
			htmlFor="email-pill-input"
			className={cn(
				"flex flex-col gap-1.5 w-full rounded-md border bg-transparent shadow-xs transition-colors cursor-text",
				overMax
					? "border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40 focus-within:ring-[3px]"
					: "border-input focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
				disabled && "pointer-events-none opacity-50",
			)}
		>
			<div
				className={cn(
					"flex flex-wrap gap-2 items-center min-h-9 max-h-24 w-full px-3 py-2",
					"overflow-y-auto overflow-x-hidden",
				)}
			>
				{emailEntries.map((entry) => (
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
					aria-invalid={showMaxError ? true : undefined}
					aria-describedby={showMaxError ? maxErrorId : undefined}
					placeholder={overMax ? "" : placeholder}
					className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground py-1 aria-invalid:placeholder:text-destructive/70"
				/>
			</div>
			{showMaxError ? (
				<p
					id={maxErrorId}
					data-testid="email-pill-max-error"
					role="alert"
					className="text-destructive text-sm px-3 pb-2 -mt-1"
				>
					{maxEntriesErrorText(maxEmailEntries)}
				</p>
			) : null}
		</label>
	)
}
