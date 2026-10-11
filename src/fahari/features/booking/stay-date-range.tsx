import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@common/components/ui/popover.tsx"
import { cn } from "@common/lib/utils.ts"
import { formatStayDate } from "@fahari/features/booking/format.ts"
import {
	addDays,
	differenceInCalendarDays,
	isBefore,
	startOfDay,
} from "date-fns"
import { Calendar } from "lucide-react"
import { type CSSProperties, useState } from "react"
import { type DateRange, DayPicker } from "react-day-picker"
import "react-day-picker/style.css"

const calendarStyle = {
	"--rdp-accent-color": "#10241c",
	"--rdp-accent-background-color": "#e7f0ec",
	"--rdp-today-color": "#10241c",
	"--rdp-range_middle-background-color": "#e7f0ec",
	"--rdp-range_middle-color": "#10241c",
	"--rdp-range_start-date-background-color": "#10241c",
	"--rdp-range_end-date-background-color": "#10241c",
	"--rdp-day-height": "36px",
	"--rdp-day-width": "36px",
	"--rdp-day_button-height": "32px",
	"--rdp-day_button-width": "32px",
	fontFamily: '"DM Sans", sans-serif',
} as CSSProperties

function DateField({
	label,
	date,
	open,
	onClick,
}: {
	label: string
	date: Date | undefined
	open: boolean
	onClick: () => void
}) {
	return (
		<button
			type="button"
			aria-expanded={open}
			aria-haspopup="dialog"
			onClick={onClick}
			className="flex flex-[1_0_0] flex-col items-start gap-0.5 rounded-xl border border-[#d7e1e8] bg-white p-3 text-left"
			style={{ fontFamily: '"DM Sans", sans-serif' }}
		>
			<span className="text-[9px] leading-none font-semibold uppercase tracking-[0.08em] text-slate-500">
				{label}
			</span>
			<span className="flex w-full items-center justify-between gap-2">
				<span
					className={cn(
						"flex-[1_0_0] text-xs leading-[normal] font-medium text-[#012420]",
						!date && "text-slate-400",
					)}
				>
					{date ? formatStayDate(date) : "Add date"}
				</span>
				<Calendar className="size-4 shrink-0 text-[#10241c]" aria-hidden />
			</span>
		</button>
	)
}

export function StayDateRange({
	value,
	onChange,
	maximumNights,
	maxAdvanceBookingDays,
}: {
	value: DateRange | undefined
	onChange: (value: DateRange | undefined) => void
	maximumNights: number
	maxAdvanceBookingDays: number
}) {
	const [open, setOpen] = useState(false)
	const today = startOfDay(new Date())
	const lastBookableDay = addDays(today, maxAdvanceBookingDays)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverAnchor asChild>
				<div className="flex gap-2">
					<DateField
						label="Check-in"
						date={value?.from}
						open={open}
						onClick={() => setOpen(true)}
					/>
					<DateField
						label="Check-out"
						date={value?.to}
						open={open}
						onClick={() => setOpen(true)}
					/>
				</div>
			</PopoverAnchor>
			<PopoverContent align="start" className="w-auto p-3">
				<DayPicker
					mode="range"
					selected={value}
					onSelect={(range) => {
						onChange(range)
						if (range?.from && range.to) setOpen(false)
					}}
					min={1}
					max={maximumNights}
					resetOnSelect
					excludeDisabled
					disabled={(date) => {
						if (isBefore(date, today) || isBefore(lastBookableDay, date))
							return true
						if (!value?.from || value.to) return false
						const nights = differenceInCalendarDays(date, value.from)
						if (nights === 0) return false
						return nights < 1 || nights > maximumNights
					}}
					defaultMonth={value?.from ?? new Date()}
					style={calendarStyle}
					styles={{
						month_caption: { fontWeight: 500, fontSize: "13px" },
						weekday: { fontSize: "10px" },
						day: { fontSize: "12px" },
					}}
					modifiersStyles={{
						selected: { fontWeight: 500, fontSize: "12px" },
					}}
				/>
			</PopoverContent>
		</Popover>
	)
}
