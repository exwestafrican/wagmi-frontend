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
import { titleCase } from "@common/utils/sentence-case.ts"
import {
	type ChauffeurClient,
	departureIsAfterPickup,
	showsLeaving,
	tripWindow,
} from "@fahari/features/booking/chauffeur-client.ts"
import { PickupAddressField } from "@fahari/features/booking/components/pickup-address-field.tsx"
import { formatStayDate } from "@fahari/features/booking/format.ts"
import type { RideFormValues } from "@fahari/features/booking/schema/trip.schema.ts"
import { addDays, isAfter, isBefore, startOfDay } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, CalendarIcon } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

function clampReturn(
	pickup: Date,
	departure: Date,
	returnWithinDays: number | undefined,
) {
	const pickupDay = startOfDay(pickup)
	const departureDay = startOfDay(departure)
	let next = isBefore(departureDay, pickupDay) ? pickupDay : departureDay
	if (returnWithinDays !== undefined) {
		const latest = addDays(pickupDay, returnWithinDays)
		if (isAfter(next, latest)) next = latest
	}
	return next
}

function RideDateField({
	label,
	value,
	earliest,
	latest,
	onChange,
}: {
	label: string
	value: Date
	earliest: Date
	latest?: Date
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
							onChange(startOfDay(date))
							setOpen(false)
						}}
						disabled={
							latest
								? { before: earliest, after: latest }
								: { before: earliest }
						}
						defaultMonth={value}
					/>
				</PopoverContent>
			</Popover>
		</FormItem>
	)
}

export function RideBookingCard({
	goingLabel,
	leavingLabel,
	showLeaving,
	destinationName,
	meetingPointName,
	pickupEarliest,
	pickupLatest,
	returnWithinDays,
}: {
	goingLabel: string
	leavingLabel: string
	showLeaving: boolean
	destinationName: string
	meetingPointName: string
	pickupEarliest: Date
	pickupLatest?: Date
	returnWithinDays?: number
}) {
	const form = useFormContext<RideFormValues>()
	const pickupDate = form.watch("pickupDate")
	const departureDate = form.watch("departureDate")
	const pickupTime = form.watch("pickupTime")
	const departureTime = form.watch("departureTime")
	const leavingLatest =
		returnWithinDays === undefined
			? undefined
			: addDays(startOfDay(pickupDate), returnWithinDays)
	const departureBeforePickup =
		showLeaving &&
		!departureIsAfterPickup({
			pickupDate,
			pickupTime,
			departureDate,
			departureTime,
		})

	return (
		<Card className="gap-3 border-[#89C9CA] py-3 shadow-none">
			<CardContent className="flex flex-col gap-3 px-3">
				<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
					<ArrowUpRight className="size-4" aria-hidden />
					{goingLabel}
				</p>
				<PickupAddressField />
				<p className="text-xs text-slate-500">Your home, hotel or airport</p>
				<FormField
					control={form.control}
					name="nearestLandmark"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<InputGroup className="h-auto items-stretch rounded-xl border-[#d7e1e8] bg-white shadow-none has-[[aria-invalid=true]]:border-red-400 has-[[aria-invalid=true]]:ring-0">
								<InputGroupAddon align="block-start" className="px-2 pt-2 pb-0">
									<FormLabel className="text-[9px] leading-none font-semibold uppercase tracking-[0.08em] text-slate-500">
										Nearest landmark
									</FormLabel>
								</InputGroupAddon>
								<div className="flex w-full items-center gap-2 px-2 pb-2">
									<FormControl>
										<InputGroupInput
											placeholder="e.g. Opposite Shoprite"
											className="h-auto px-0 text-xs font-medium text-[#012420] md:text-xs"
											{...field}
										/>
									</FormControl>
								</div>
							</InputGroup>
							<FormMessage className="text-[11px]" />
						</FormItem>
					)}
				/>
				<div className="flex items-start gap-1.5">
					<FormField
						control={form.control}
						name="pickupDate"
						render={() => (
							<RideDateField
								label="Pickup date"
								value={pickupDate}
								earliest={pickupEarliest}
								latest={pickupLatest}
								onChange={(date) => {
									form.setValue("pickupDate", date, {
										shouldValidate: true,
									})
									if (!showLeaving) return
									form.setValue(
										"departureDate",
										clampReturn(date, departureDate, returnWithinDays),
										{ shouldValidate: true },
									)
								}}
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
				{showLeaving && <Separator />}
				{showLeaving && (
					<>
						<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
							<ArrowDownLeft className="size-4" aria-hidden />
							{leavingLabel}
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
										latest={leavingLatest}
										onChange={(date) => {
											form.setValue("departureDate", date, {
												shouldValidate: true,
											})
										}}
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
						{departureBeforePickup && (
							<p className="text-[11px] text-red-600">
								Departure must be after pickup.
							</p>
						)}
						<p className="text-xs text-slate-500">
							Return to your original pickup location.
						</p>
					</>
				)}
			</CardContent>
		</Card>
	)
}

export function RideBooking({ client }: { client: ChauffeurClient }) {
	const dates = tripWindow(client.bookingPolicy)
	const meetup = titleCase(client.meetupPoint.name)
	return (
		<RideBookingCard
			goingLabel="Going"
			leavingLabel="Leaving"
			showLeaving={showsLeaving(client)}
			destinationName={meetup}
			meetingPointName={meetup}
			pickupEarliest={dates.earliest}
			pickupLatest={dates.latest}
			returnWithinDays={
				client.tripType.code === "round_trip"
					? client.bookingPolicy.maxDaysAfterPickup
					: undefined
			}
		/>
	)
}
