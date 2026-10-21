import { Button } from "@common/components/ui/button.tsx"
import { Calendar } from "@common/components/ui/calendar.tsx"
import { Card, CardContent } from "@common/components/ui/card.tsx"
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
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
import { Separator } from "@common/components/ui/separator.tsx"
import { formatStayDate } from "@fahari/features/booking/format.ts"
import type { RideFormValues } from "@fahari/features/booking/schema/trip.schema.ts"
import { addDays, isBefore, startOfDay } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, CalendarIcon, MapPin } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

export type RideDates = {
	pickupDate: Date
	departureDate: Date
}

export function initialRideDates(): RideDates {
	const pickupDate = startOfDay(new Date())
	return { pickupDate, departureDate: addDays(pickupDate, 1) }
}

const fieldLabelClassName =
	"text-[9px] leading-none font-semibold uppercase tracking-[0.08em] text-slate-500"

const groupClassName =
	"h-auto items-stretch rounded-xl border-[#d7e1e8] bg-white shadow-none has-[[aria-invalid=true]]:border-red-400 has-[[aria-invalid=true]]:ring-0"

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
		<FormItem className="min-w-0 flex-1 gap-1.5">
			<FormLabel className="text-[11px] font-semibold text-[#012420]">
				{label}
			</FormLabel>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<FormControl>
						<Button
							type="button"
							variant="outline"
							className="w-full justify-start px-2 font-normal text-[#012420]"
						>
							<CalendarIcon />
							{formatStayDate(value)}
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-auto p-0">
					<Calendar
						mode="single"
						selected={value}
						onSelect={(date) => {
							if (!date) return
							onChange(date)
							setOpen(false)
						}}
						disabled={{ before: earliest }}
						defaultMonth={value}
					/>
				</PopoverContent>
			</Popover>
		</FormItem>
	)
}

export function RideBooking({
	destinationName,
	meetingPointName,
}: {
	destinationName: string
	meetingPointName: string
}) {
	const today = startOfDay(new Date())
	const form = useFormContext<RideFormValues>()
	const pickupDate = form.watch("pickupDate")
	const departureDate = form.watch("departureDate")

	const changeDates = (pickup: Date, departure: Date) => {
		const nextDeparture = isBefore(departure, pickup) ? pickup : departure
		form.setValue("pickupDate", pickup)
		form.setValue("departureDate", nextDeparture)
	}

	return (
		<Card className="gap-3 border-[#89C9CA] py-3 shadow-none">
			<CardContent className="flex flex-col gap-3 px-3">
				<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
					<ArrowUpRight className="size-4" aria-hidden />
					Going to the resort
				</p>
				<FormField
					control={form.control}
					name="pickupAddress"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<InputGroup className={groupClassName}>
								<InputGroupAddon align="block-start" className="px-2 pt-2 pb-0">
									<FormLabel className={fieldLabelClassName}>
										Pick me up from
									</FormLabel>
								</InputGroupAddon>
								<div className="flex w-full items-center gap-2 px-2 pb-2">
									<FormControl>
										<InputGroupInput
											autoComplete="street-address"
											placeholder="Add pickup"
											className="h-auto px-0 text-xs font-medium text-[#012420] md:text-xs"
											{...field}
										/>
									</FormControl>
									<InputGroupAddon align="inline-end" className="p-0">
										<MapPin
											className="size-4 shrink-0 text-[#10241c]"
											aria-hidden
										/>
									</InputGroupAddon>
								</div>
							</InputGroup>
							<FormMessage className="text-[11px]" />
						</FormItem>
					)}
				/>
				<p className="text-xs text-slate-500">Your home, hotel or airport</p>
				<div className="flex items-start gap-1.5">
					<FormField
						control={form.control}
						name="pickupDate"
						render={() => (
							<RideDateField
								label="Pickup date"
								value={pickupDate}
								earliest={today}
								onChange={(date) => changeDates(date, departureDate)}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name="pickupTime"
						render={({ field }) => (
							<FormItem className="min-w-0 flex-1 gap-1.5">
								<FormLabel className="text-[11px] font-semibold text-[#012420]">
									Pickup time
								</FormLabel>
								<InputGroup className="h-9 rounded-md border-[#d7e1e8] bg-white shadow-none has-[[aria-invalid=true]]:border-red-400 has-[[aria-invalid=true]]:ring-0">
									<FormControl>
										<InputGroupInput
											type="time"
											placeholder="Add time"
											className="h-9 px-2 text-sm font-normal text-[#012420] md:text-sm"
											{...field}
										/>
									</FormControl>
								</InputGroup>
								<FormMessage className="text-[11px]" />
							</FormItem>
						)}
					/>
				</div>
				<p className="text-xs text-slate-600">Destination: {destinationName}</p>
				<Separator />
				<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
					<ArrowDownLeft className="size-4" aria-hidden />
					Leaving the resort
				</p>
				<p className="text-xs text-slate-600">Pickup: {meetingPointName}</p>
				<div className="flex items-start gap-1.5">
					<FormField
						control={form.control}
						name="departureDate"
						render={() => (
							<RideDateField
								label="Departure date"
								value={departureDate}
								earliest={pickupDate}
								onChange={(date) => changeDates(pickupDate, date)}
							/>
						)}
					/>
					<FormField
						control={form.control}
						name="departureTime"
						render={({ field }) => (
							<FormItem className="min-w-0 flex-1 gap-1.5">
								<FormLabel className="text-[11px] font-semibold text-[#012420]">
									Departure time
								</FormLabel>
								<InputGroup className="h-9 rounded-md border-[#d7e1e8] bg-white shadow-none has-[[aria-invalid=true]]:border-red-400 has-[[aria-invalid=true]]:ring-0">
									<FormControl>
										<InputGroupInput
											type="time"
											placeholder="Add time"
											className="h-9 px-2 text-sm font-normal text-[#012420] md:text-sm"
											{...field}
										/>
									</FormControl>
								</InputGroup>
								<FormMessage className="text-[11px]" />
							</FormItem>
						)}
					/>
				</div>
				<p className="text-xs text-slate-500">
					Return to your original pickup location.
				</p>
			</CardContent>
		</Card>
	)
}
