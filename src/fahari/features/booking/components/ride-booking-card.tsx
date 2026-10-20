import {
	Form,
	FormField,
	FormItem,
	FormMessage,
} from "@common/components/ui/form"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, isBefore, startOfDay } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, Calendar, MapPin } from "lucide-react"
import { type CSSProperties, useState } from "react"
import { DayPicker } from "react-day-picker"
import { useForm } from "react-hook-form"
import "react-day-picker/style.css"
import { z } from "zod"

const bookingCalendarStyle = {
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

export const rideFormId = "ride-booking"

const tripSchema = z.object({
	pickupAddress: z
		.string()
		.trim()
		.nonempty({ message: "Pickup address is required" }),
	pickupDate: z.date(),
	pickupTime: z
		.string()
		.trim()
		.nonempty({ message: "Pickup time is required" }),
	departureDate: z.date(),
	departureTime: z
		.string()
		.trim()
		.nonempty({ message: "Departure time is required" }),
})

type TripDetails = z.infer<typeof tripSchema>

export type RideDates = {
	pickupDate: Date
	departureDate: Date
}

export function initialRideDates(): RideDates {
	const pickupDate = startOfDay(new Date())
	return { pickupDate, departureDate: addDays(pickupDate, 1) }
}

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
	value: Date
	earliest: Date
	onChange: (date: Date) => void
}) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverAnchor asChild>
				<div className="flex w-full">
					<FieldButton
						label={label}
						value={formatStayDate(value)}
						placeholder="Add date"
						icon={<DateIcon />}
						open={open}
						compact
						onClick={() => setOpen(true)}
					/>
				</div>
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
					defaultMonth={value}
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

export function RideBooking({
	destinationName,
	meetingPointName,
	startTime,
	endTime,
	onDatesChange,
}: {
	destinationName: string
	meetingPointName: string
	startTime: string
	endTime: string
	onDatesChange: (dates: RideDates) => void
}) {
	const today = startOfDay(new Date())
	const form = useForm<TripDetails>({
		resolver: zodResolver(tripSchema),
		defaultValues: {
			pickupAddress: "",
			...initialRideDates(),
			pickupTime: startTime,
			departureTime: endTime,
		},
	})
	const pickupDate = form.watch("pickupDate")
	const departureDate = form.watch("departureDate")

	const changeDates = (pickup: Date, departure: Date) => {
		const nextDeparture = isBefore(departure, pickup) ? pickup : departure
		form.setValue("pickupDate", pickup)
		form.setValue("departureDate", nextDeparture)
		onDatesChange({ pickupDate: pickup, departureDate: nextDeparture })
	}

	return (
		<Form {...form}>
			<form
				id={rideFormId}
				noValidate
				onSubmit={form.handleSubmit(() => undefined)}
				className="flex flex-col gap-3 rounded-xl border border-[#89C9CA] p-3"
			>
				<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
					<ArrowUpRight className="size-4" aria-hidden />
					Going to the resort
				</p>
				<FormField
					control={form.control}
					name="pickupAddress"
					render={({ field, fieldState }) => (
						<FormItem className="gap-1.5">
							<FieldInput
								id="pickup-address"
								label="Pick me up from"
								value={field.value}
								placeholder="Add pickup"
								autoComplete="street-address"
								invalid={fieldState.invalid}
								onChange={field.onChange}
								icon={
									<MapPin
										className="size-4 shrink-0 text-[#10241c]"
										aria-hidden
									/>
								}
							/>
							<FormMessage className="text-[11px]" />
						</FormItem>
					)}
				/>
				<p className="text-xs text-slate-500">Your home, hotel or airport</p>
				<div className="flex gap-1.5">
					<div className="flex min-w-0 flex-1">
						<RideDateField
							label="Pickup date"
							value={pickupDate}
							earliest={today}
							onChange={(date) => changeDates(date, departureDate)}
						/>
					</div>
					<FormField
						control={form.control}
						name="pickupTime"
						render={({ field, fieldState }) => (
							<FormItem className="min-w-0 flex-1 gap-1.5">
								<FieldInput
									id="pickup-time"
									type="time"
									label="Pickup time"
									value={field.value}
									placeholder="Add time"
									invalid={fieldState.invalid}
									onChange={field.onChange}
									compact
								/>
								<FormMessage className="text-[11px]" />
							</FormItem>
						)}
					/>
				</div>
				<p className="text-xs text-slate-600">Destination: {destinationName}</p>
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
							earliest={pickupDate}
							onChange={(date) => changeDates(pickupDate, date)}
						/>
					</div>
					<FormField
						control={form.control}
						name="departureTime"
						render={({ field, fieldState }) => (
							<FormItem className="min-w-0 flex-1 gap-1.5">
								<FieldInput
									id="departure-time"
									type="time"
									label="Departure time"
									value={field.value}
									placeholder="Add time"
									invalid={fieldState.invalid}
									onChange={field.onChange}
									compact
								/>
								<FormMessage className="text-[11px]" />
							</FormItem>
						)}
					/>
				</div>
				<p className="text-xs text-slate-500">
					Return to your original pickup location.
				</p>
			</form>
		</Form>
	)
}
