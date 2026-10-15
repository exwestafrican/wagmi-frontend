import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@common/components/ui/popover.tsx"
import {
	FieldButton,
	FieldInput,
} from "@fahari/features/booking/components/field-button.tsx"
import { formatStayDate } from "@fahari/features/booking/format.ts"
import { bookingCalendarStyle } from "@fahari/features/booking/stay-date-range.tsx"
import { isBefore, startOfDay } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, Calendar, MapPin } from "lucide-react"
import { useState } from "react"
import { DayPicker } from "react-day-picker"

function DateIcon() {
	return <Calendar className="size-3.5 shrink-0 text-[#10241c]" aria-hidden />
}

function RideDateField({
	label,
	value,
	earliest,
	onChange,
}: {
	label: string
	value: Date | undefined
	earliest: Date
	onChange?: (date: Date) => void
}) {
	const [open, setOpen] = useState(false)
	const field = (
		<FieldButton
			label={label}
			value={value ? formatStayDate(value) : undefined}
			placeholder="Add date"
			icon={<DateIcon />}
			open={open}
			compact
			onClick={() => {
				if (onChange) setOpen(true)
			}}
		/>
	)

	if (!onChange) return field

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverAnchor asChild>
				<div className="flex w-full">{field}</div>
			</PopoverAnchor>
			<PopoverContent align="start" className="w-auto p-3">
				<DayPicker
					mode="single"
					required
					selected={value}
					onSelect={(date) => {
						onChange(date)
						setOpen(false)
					}}
					disabled={(date) => isBefore(date, earliest)}
					defaultMonth={value ?? earliest}
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

export function RideTripCard({
	meetingPointName,
	destinationName,
	startTime,
	endTime,
	pickupDate,
	departureDate,
	onPickupDateChange,
	onDepartureDateChange,
}: {
	meetingPointName: string
	destinationName?: string
	startTime: string
	endTime: string
	pickupDate: Date | undefined
	departureDate: Date | undefined
	onPickupDateChange?: (date: Date) => void
	onDepartureDateChange?: (date: Date) => void
}) {
	const [pickupAddress, setPickupAddress] = useState("")
	const [pickupTime, setPickupTime] = useState(startTime)
	const [departureTime, setDepartureTime] = useState(endTime)
	const today = startOfDay(new Date())

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-[#89C9CA] p-3">
			<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
				<ArrowUpRight className="size-4" aria-hidden />
				Going to the resort
			</p>
			<FieldInput
				id="pickup-address"
				label="Pick me up from"
				value={pickupAddress}
				placeholder="Add pickup"
				autoComplete="street-address"
				onChange={setPickupAddress}
				icon={<MapPin className="size-4 shrink-0 text-[#10241c]" aria-hidden />}
			/>
			<p className="text-xs text-slate-500">Your home, hotel or airport</p>
			<div className="flex gap-1.5">
				<div className="flex min-w-0 flex-1">
					<RideDateField
						label="Pickup date"
						value={pickupDate}
						earliest={today}
						onChange={onPickupDateChange}
					/>
				</div>
				<div className="flex min-w-0 flex-1">
					<FieldInput
						id="pickup-time"
						type="time"
						label="Pickup time"
						value={pickupTime}
						placeholder="Add time"
						onChange={setPickupTime}
						compact
					/>
				</div>
			</div>
			{destinationName && (
				<p className="text-xs text-slate-600">Destination: {destinationName}</p>
			)}
			<hr className="border-slate-200" />
			<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
				<ArrowDownLeft className="size-4" aria-hidden />
				Leaving the resort
			</p>
			<p className="text-xs text-slate-600">Pickup: {meetingPointName}</p>
			<div className="flex gap-1.5">
				<div className="flex min-w-0 flex-1">
					<RideDateField
						label="Departure date"
						value={departureDate}
						earliest={pickupDate ?? today}
						onChange={onDepartureDateChange}
					/>
				</div>
				<div className="flex min-w-0 flex-1">
					<FieldInput
						id="departure-time"
						type="time"
						label="Departure time"
						value={departureTime}
						placeholder="Add time"
						onChange={setDepartureTime}
						compact
					/>
				</div>
			</div>
			<p className="text-xs text-slate-500">
				Return to your original pickup location.
			</p>
		</div>
	)
}
