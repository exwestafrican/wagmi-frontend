import { Calendar } from "@common/components/ui/calendar.tsx"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@common/components/ui/field.tsx"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@common/components/ui/input-group.tsx"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@common/components/ui/popover.tsx"
import { Textarea } from "@common/components/ui/textarea.tsx"
import { cn } from "@common/lib/utils.ts"
import { format } from "date-fns"
import { AlarmClock, CalendarIcon, CircleAlert } from "lucide-react"
import { type ComponentProps, type ReactNode, useId, useState } from "react"

interface FieldShellProps {
	label: ReactNode
	// Shown under the input. An error takes its place when there is one.
	helper?: ReactNode
	error?: ReactNode
}

// Label on top, control in the middle, helper or error underneath.
function FieldShell({
	id,
	label,
	helper,
	error,
	disabled,
	className,
	children,
}: FieldShellProps & {
	id: string
	disabled?: boolean
	className?: string
	children: ReactNode
}) {
	return (
		<Field
			data-invalid={error ? true : undefined}
			data-disabled={disabled ? true : undefined}
			className={cn("gap-2 data-[disabled=true]:opacity-50", className)}
		>
			<FieldLabel
				htmlFor={id}
				className="text-sm leading-normal font-bold text-fh-ink group-data-[disabled=true]/field:opacity-100"
			>
				{label}
			</FieldLabel>
			{children}
			{error ? (
				<FieldError
					id={`${id}-message`}
					className="flex items-center gap-1.5 text-[13px] font-semibold text-fh-error"
				>
					<CircleAlert aria-hidden className="size-3.5 shrink-0" />
					<span>{error}</span>
				</FieldError>
			) : helper ? (
				<FieldDescription
					id={`${id}-message`}
					className="text-[13px] text-fh-ink-muted"
				>
					{helper}
				</FieldDescription>
			) : null}
		</Field>
	)
}

// The 52px box every single-line field shares: border darkens on hover, turns
// accent on focus and red on error.
const inputBoxClasses = cn(
	"h-[52px] gap-2.5 rounded-fh-sm border-[1.5px] border-fh-line bg-fh-surface px-3.5 shadow-none transition-colors dark:bg-fh-surface",
	"hover:border-fh-line-strong has-[>[data-align=inline-start]]:[&>input]:pl-0",
	"has-[[data-slot=input-group-control]:focus-visible]:border-fh-accent-ink has-[[data-slot=input-group-control]:focus-visible]:ring-0",
	"has-[[data-slot][aria-invalid=true]]:border-fh-error",
)

const inputTextClasses =
	"h-full px-0 text-base text-fh-ink caret-fh-accent-ink placeholder:text-fh-ink-muted md:text-base"

const addonClasses =
	"gap-2.5 p-0 text-base font-bold text-fh-ink has-[>button]:ml-0"

type TextFieldProps = FieldShellProps &
	Omit<ComponentProps<"input">, "prefix"> & {
		// Leading icon, e.g. a calendar.
		icon?: ReactNode
		// Leading text with a divider after it, e.g. a currency sign or dial code.
		prefix?: ReactNode
	}

export function TextField({
	label,
	helper,
	error,
	icon,
	prefix,
	id,
	className,
	disabled,
	...props
}: TextFieldProps) {
	const generatedId = useId()
	const fieldId = id ?? generatedId
	const hasMessage = Boolean(error || helper)

	return (
		<FieldShell
			id={fieldId}
			label={label}
			helper={helper}
			error={error}
			disabled={disabled}
			className={className}
		>
			<InputGroup className={inputBoxClasses}>
				{icon ? (
					<InputGroupAddon
						className={cn(
							addonClasses,
							"text-fh-accent-ink [&>svg:not([class*='size-'])]:size-[18px]",
						)}
					>
						{icon}
					</InputGroupAddon>
				) : null}
				{prefix ? (
					<InputGroupAddon className={addonClasses}>
						<span>{prefix}</span>
						<span aria-hidden className="h-6 w-px bg-fh-line" />
					</InputGroupAddon>
				) : null}
				<InputGroupInput
					id={fieldId}
					disabled={disabled}
					aria-invalid={error ? true : undefined}
					aria-describedby={hasMessage ? `${fieldId}-message` : undefined}
					className={inputTextClasses}
					{...props}
				/>
			</InputGroup>
		</FieldShell>
	)
}

export function PhoneField({
	dialCode = "🇳🇬 +234",
	...props
}: Omit<TextFieldProps, "prefix" | "icon" | "type"> & {
	dialCode?: ReactNode
}) {
	return (
		<TextField
			type="tel"
			inputMode="tel"
			autoComplete="tel-national"
			prefix={dialCode}
			{...props}
		/>
	)
}

export function PriceField({
	currency = "₦",
	...props
}: Omit<TextFieldProps, "prefix" | "icon" | "type"> & {
	currency?: ReactNode
}) {
	return (
		<TextField type="text" inputMode="numeric" prefix={currency} {...props} />
	)
}

// Uses the device's own time picker; clicking anywhere in the field opens it.
export function TimeField(
	props: Omit<TextFieldProps, "prefix" | "icon" | "type">,
) {
	return (
		<TextField
			type="time"
			icon={<AlarmClock aria-hidden />}
			onClick={(event) => {
				try {
					event.currentTarget.showPicker?.()
				} catch {
					// Some browsers only allow this straight after a tap; typing still works.
				}
			}}
			{...props}
			className={cn(
				"[&_input::-webkit-calendar-picker-indicator]:hidden",
				props.className,
			)}
		/>
	)
}

type TextareaFieldProps = FieldShellProps & ComponentProps<"textarea">

export function TextareaField({
	label,
	helper,
	error,
	id,
	className,
	disabled,
	...props
}: TextareaFieldProps) {
	const generatedId = useId()
	const fieldId = id ?? generatedId
	const hasMessage = Boolean(error || helper)

	return (
		<FieldShell
			id={fieldId}
			label={label}
			helper={helper}
			error={error}
			disabled={disabled}
			className={className}
		>
			<Textarea
				id={fieldId}
				disabled={disabled}
				aria-invalid={error ? true : undefined}
				aria-describedby={hasMessage ? `${fieldId}-message` : undefined}
				className={cn(
					"min-h-[120px] resize-none rounded-fh-sm border-[1.5px] border-fh-line bg-fh-surface p-3.5 text-base leading-[1.4] text-fh-ink caret-fh-accent-ink shadow-none transition-colors placeholder:text-fh-ink-muted md:text-base dark:bg-fh-surface",
					"hover:border-fh-line-strong focus-visible:border-fh-accent-ink focus-visible:ring-0 aria-invalid:border-fh-error",
				)}
				{...props}
			/>
		</FieldShell>
	)
}

type DateFieldProps = FieldShellProps & {
	value?: Date
	onChange: (date: Date) => void
	placeholder?: string
	// How the picked date is written in the field.
	dateFormat?: string
	// Days that cannot be picked, in the calendar's own format.
	disabledDays?: ComponentProps<typeof Calendar>["disabled"]
	disabled?: boolean
	id?: string
	className?: string
}

export function DateField({
	label,
	helper,
	error,
	value,
	onChange,
	placeholder = "Select date",
	dateFormat = "EEE d MMM yyyy",
	disabledDays,
	disabled,
	id,
	className,
}: DateFieldProps) {
	const generatedId = useId()
	const fieldId = id ?? generatedId
	const hasMessage = Boolean(error || helper)
	const [open, setOpen] = useState(false)

	return (
		<FieldShell
			id={fieldId}
			label={label}
			helper={helper}
			error={error}
			disabled={disabled}
			className={className}
		>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						id={fieldId}
						disabled={disabled}
						aria-invalid={error ? true : undefined}
						aria-describedby={hasMessage ? `${fieldId}-message` : undefined}
						className={cn(
							"flex h-[52px] items-center gap-2.5 rounded-fh-sm border-[1.5px] border-fh-line bg-fh-surface px-3.5 text-left text-base outline-none transition-colors",
							"hover:border-fh-line-strong focus-visible:border-fh-accent-ink data-[state=open]:border-fh-accent-ink aria-invalid:border-fh-error",
							value ? "text-fh-ink" : "text-fh-ink-muted",
						)}
					>
						<CalendarIcon
							aria-hidden
							className="size-[18px] shrink-0 text-fh-accent-ink"
						/>
						<span className="truncate">
							{value ? format(value, dateFormat) : placeholder}
						</span>
					</button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className="w-auto rounded-fh-md border-fh-line p-0"
				>
					<Calendar
						mode="single"
						selected={value}
						defaultMonth={value}
						disabled={disabledDays}
						onSelect={(date) => {
							if (!date) return
							onChange(date)
							setOpen(false)
						}}
					/>
				</PopoverContent>
			</Popover>
		</FieldShell>
	)
}
