import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@common/components/ui/popover.tsx"
import { FieldButton } from "@fahari/features/booking/components/field-button.tsx"
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

export const bookingCalendarStyle = {
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

function DateIcon() {
	return <Calendar className="size-4 shrink-0 text-[#10241c]" aria-hidden />
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
					<FieldButton
						label="Check-in"
						value={value?.from ? formatStayDate(value.from) : undefined}
						placeholder="Add date"
						icon={<DateIcon />}
						open={open}
						onClick={() => setOpen(true)}
					/>
					<FieldButton
						label="Check-out"
						value={value?.to ? formatStayDate(value.to) : undefined}
						placeholder="Add date"
						icon={<DateIcon />}
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
					style={bookingCalendarStyle}
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
