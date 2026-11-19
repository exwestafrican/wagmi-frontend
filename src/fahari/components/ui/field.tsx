import { Calendar, CalendarDayButton } from "@common/components/ui/calendar.tsx"
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
import { useIsMobile } from "@common/hooks/use-mobile.ts"
import { cn } from "@common/lib/utils.ts"
import { Button } from "@fahari/components/ui/button.tsx"
import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetTitle,
	BottomSheetTrigger,
} from "@fahari/components/ui/overlay.tsx"
import { format } from "date-fns"
import { CalendarIcon, Check, CircleAlert, Clock3 } from "lucide-react"
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useId,
	useState,
} from "react"

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

// The box a picker field shows when closed. It looks like a text input but is
// a button, because the value is chosen from a panel rather than typed.
const pickerTriggerClasses = cn(
	"flex h-[52px] items-center gap-2.5 rounded-fh-sm border-[1.5px] border-fh-line bg-fh-surface px-3.5 text-left text-base outline-none transition-colors",
	"hover:border-fh-line-strong focus-visible:border-fh-accent-ink data-[state=open]:border-fh-accent-ink aria-invalid:border-fh-error",
)

const pickerPanelClasses =
	"rounded-fh-md border-fh-line bg-fh-surface p-0 shadow-fh-popover"

function PickerDayButton({
	className,
	...props
}: ComponentProps<typeof CalendarDayButton>) {
	return (
		<CalendarDayButton
			className={cn(
				"aspect-auto h-9 min-w-0 rounded-fh-sm text-sm font-medium text-fh-ink hover:bg-fh-subtle hover:text-fh-ink dark:hover:text-fh-ink",
				// The shared button halves the opacity of anything disabled; here the
				// faint text colour alone marks a day that cannot be picked.
				"disabled:opacity-100",
				"group-data-[focused=true]/day:border-transparent group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-fh-accent-ink",
				"data-[selected-single=true]:bg-fh-accent data-[selected-single=true]:font-bold data-[selected-single=true]:text-fh-on-accent data-[selected-single=true]:hover:bg-fh-accent-hover",
				className,
			)}
			{...props}
		/>
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
	// A line under the calendar, e.g. to explain why some days are greyed out.
	pickerNote?: ReactNode
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
	pickerNote,
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
							pickerTriggerClasses,
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
					className={cn(pickerPanelClasses, "w-[300px]")}
				>
					<Calendar
						mode="single"
						weekStartsOn={1}
						selected={value}
						defaultMonth={value}
						disabled={disabledDays}
						onSelect={(date) => {
							if (!date) return
							onChange(date)
							setOpen(false)
						}}
						className="w-full bg-transparent p-3.5"
						classNames={{
							root: "w-full",
							months: "relative flex flex-col",
							month: "flex w-full flex-col gap-2.5",
							nav: "absolute inset-x-0 top-0 flex items-center justify-between",
							button_previous:
								"flex size-8 items-center justify-center rounded-fh-sm text-fh-ink outline-none hover:bg-fh-subtle focus-visible:ring-2 focus-visible:ring-fh-accent-ink aria-disabled:opacity-35 [&>svg]:size-[18px]",
							button_next:
								"flex size-8 items-center justify-center rounded-fh-sm text-fh-ink outline-none hover:bg-fh-subtle focus-visible:ring-2 focus-visible:ring-fh-accent-ink aria-disabled:opacity-35 [&>svg]:size-[18px]",
							month_caption: "flex h-8 items-center justify-center",
							caption_label: "text-[15px] font-bold text-fh-ink select-none",
							weekdays: "flex",
							weekday:
								"flex h-6 flex-1 items-center justify-center text-xs font-semibold text-fh-ink-muted select-none",
							week: "mt-0.5 flex w-full gap-0.5",
							day: "group/day relative h-9 flex-1 p-0 text-center select-none",
							today: "",
							// Days from the months either side are a step quieter than this
							// month's, but still clearly darker than days that cannot be picked.
							outside: "[&>button:not(:disabled)]:text-fh-ink-muted",
							disabled: "[&>button]:text-fh-ink-faint",
						}}
						components={{ DayButton: PickerDayButton }}
						formatters={{
							formatWeekdayName: (day) => format(day, "EEEEE"),
						}}
					/>
					{pickerNote ? (
						<p className="px-3.5 pb-3.5 text-xs text-fh-ink-muted">
							{pickerNote}
						</p>
					) : null}
				</PopoverContent>
			</Popover>
		</FieldShell>
	)
}

// Every time of day at the given spacing, as 24-hour "HH:mm" strings.
function timesOfDay(minuteStep: number) {
	const times: string[] = []
	for (let minutes = 0; minutes < 24 * 60; minutes += minuteStep) {
		const hours = Math.floor(minutes / 60)
		times.push(
			`${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
		)
	}
	return times
}

// "14:30" -> "2:30 PM"
function formatTime(value: string) {
	const [hours, minutes] = value.split(":").map(Number)
	const suffix = hours < 12 ? "AM" : "PM"
	return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`
}

function TimeList({
	times,
	selected,
	isTimeDisabled,
	onSelect,
	className,
}: {
	times: string[]
	selected?: string
	isTimeDisabled?: (time: string) => boolean
	onSelect: (time: string) => void
	className?: string
}) {
	// Start the list at the picked time, or the first time that can be picked.
	const anchor = selected ?? times.find((time) => !isTimeDisabled?.(time))
	const scrollToAnchor = useCallback((list: HTMLUListElement | null) => {
		list
			?.querySelector<HTMLElement>("[data-anchor=true]")
			?.scrollIntoView?.({ block: "center" })
	}, [])

	return (
		<ul
			ref={scrollToAnchor}
			className={cn(
				"flex h-[280px] flex-col gap-0.5 overflow-y-auto p-1.5",
				className,
			)}
		>
			{times.map((time) => {
				const isSelected = time === selected
				return (
					<li key={time}>
						<button
							type="button"
							disabled={isTimeDisabled?.(time)}
							aria-pressed={isSelected}
							data-anchor={time === anchor}
							onClick={() => onSelect(time)}
							className={cn(
								"flex h-10 w-full items-center justify-between rounded-fh-sm px-3 text-sm font-medium text-fh-ink outline-none transition-colors",
								"hover:bg-fh-subtle focus-visible:ring-2 focus-visible:ring-fh-accent-ink focus-visible:ring-inset disabled:pointer-events-none disabled:text-fh-ink-faint",
								isSelected &&
									"bg-fh-accent font-bold text-fh-on-accent hover:bg-fh-accent-hover",
							)}
						>
							{formatTime(time)}
							{isSelected ? <Check aria-hidden className="size-4" /> : null}
						</button>
					</li>
				)
			})}
		</ul>
	)
}

type TimeFieldProps = FieldShellProps & {
	// 24-hour "HH:mm", e.g. "14:30". Shown to the person as "2:30 PM".
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	// Minutes between the times on offer.
	minuteStep?: number
	// Return true for times that cannot be picked.
	isTimeDisabled?: (time: string) => boolean
	// Title of the sheet on phones.
	sheetTitle?: ReactNode
	doneLabel?: ReactNode
	disabled?: boolean
	id?: string
	className?: string
}

// A list of times to pick from: a dropdown under the field on larger screens,
// a bottom sheet with a Done button on phones.
export function TimeField({
	label,
	helper,
	error,
	value,
	onChange,
	placeholder = "Select time",
	minuteStep = 15,
	isTimeDisabled,
	sheetTitle = "Pick a time",
	doneLabel = "Done",
	disabled,
	id,
	className,
}: TimeFieldProps) {
	const generatedId = useId()
	const fieldId = id ?? generatedId
	const hasMessage = Boolean(error || helper)
	const isMobile = useIsMobile()
	const [open, setOpen] = useState(false)
	// On phones the choice only counts once Done is pressed.
	const [pending, setPending] = useState(value)
	const times = timesOfDay(minuteStep)

	function handleOpenChange(next: boolean) {
		if (next) setPending(value)
		setOpen(next)
	}

	const trigger = (
		<button
			type="button"
			id={fieldId}
			disabled={disabled}
			aria-invalid={error ? true : undefined}
			aria-describedby={hasMessage ? `${fieldId}-message` : undefined}
			className={cn(
				pickerTriggerClasses,
				value ? "text-fh-ink" : "text-fh-ink-muted",
			)}
		>
			<Clock3 aria-hidden className="size-[18px] shrink-0 text-fh-accent-ink" />
			<span className="truncate">
				{value ? formatTime(value) : placeholder}
			</span>
		</button>
	)

	return (
		<FieldShell
			id={fieldId}
			label={label}
			helper={helper}
			error={error}
			disabled={disabled}
			className={className}
		>
			{isMobile ? (
				<BottomSheet open={open} onOpenChange={handleOpenChange}>
					<BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
					<BottomSheetContent
						aria-describedby={undefined}
						className="px-4 pb-6"
					>
						<BottomSheetTitle>{sheetTitle}</BottomSheetTitle>
						<TimeList
							times={times}
							selected={pending}
							isTimeDisabled={isTimeDisabled}
							onSelect={setPending}
							className="p-0"
						/>
						<Button
							className="w-full"
							disabled={!pending}
							onClick={() => {
								if (pending) onChange(pending)
								setOpen(false)
							}}
						>
							{doneLabel}
						</Button>
					</BottomSheetContent>
				</BottomSheet>
			) : (
				<Popover open={open} onOpenChange={handleOpenChange}>
					<PopoverTrigger asChild>{trigger}</PopoverTrigger>
					<PopoverContent
						align="start"
						sideOffset={8}
						className={cn(
							pickerPanelClasses,
							"w-(--radix-popover-trigger-width) min-w-[200px] overflow-hidden",
						)}
					>
						<TimeList
							times={times}
							selected={value}
							isTimeDisabled={isTimeDisabled}
							onSelect={(time) => {
								onChange(time)
								setOpen(false)
							}}
						/>
					</PopoverContent>
				</Popover>
			)}
		</FieldShell>
	)
}
