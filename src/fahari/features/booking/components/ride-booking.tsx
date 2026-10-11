import { Checkbox } from "@common/components/ui/checkbox.tsx"
import {
	FieldButton,
	FieldInput,
} from "@fahari/features/booking/components/field-button.tsx"
import {
	formatNightlyPrice,
	formatStayDate,
} from "@fahari/features/booking/format.ts"
import type { Listing } from "@fahari/features/booking/listing.ts"
import {
	ArrowDownLeft,
	ArrowUpRight,
	Calendar,
	Car,
	MapPin,
} from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

function DateIcon() {
	return <Calendar className="size-3.5 shrink-0 text-[#10241c]" aria-hidden />
}

export function RideBooking({
	listing,
	stay,
}: {
	listing: Listing
	stay: DateRange | undefined
}) {
	const [enabled, setEnabled] = useState(true)
	const [pickupAddress, setPickupAddress] = useState("")
	const [pickupTime, setPickupTime] = useState(listing.schedule.startTime)
	const [departureTime, setDepartureTime] = useState(listing.schedule.endTime)
	const ride = listing.additionalServices.rides[0]
	const roundTripPrice = ride
		? formatNightlyPrice(ride.returnTrip, listing.currency)
		: null

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-start gap-2">
					<Checkbox
						id="add-car"
						checked={enabled}
						disabled={listing.onlyRideBooking}
						onCheckedChange={(checked) => setEnabled(checked === true)}
						className="mt-0.5 size-5 rounded-[6px] border-[#7eaea0] disabled:opacity-100 data-[state=checked]:border-[#7eaea0] data-[state=checked]:bg-[#7eaea0]"
					/>
					<label htmlFor="add-car">
						<span className="block text-sm font-semibold text-[#012420]">
							Add a car to my booking
						</span>
						<span className="block text-xs text-slate-500">
							Optional private ride to the resort and back
						</span>
						{!enabled && roundTripPrice ? (
							<span className="block text-[11px] leading-[normal] text-slate-500">
								{roundTripPrice} / round trip · not added
							</span>
						) : null}
					</label>
				</div>
				<Car className="size-5 shrink-0 text-[#7eaea0]" aria-hidden />
			</div>
			{enabled ? (
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
						icon={
							<MapPin className="size-4 shrink-0 text-[#10241c]" aria-hidden />
						}
					/>
					<p className="text-xs text-slate-500">Your home, hotel or airport</p>
					<div className="flex gap-1.5">
						<div className="flex min-w-0 flex-1">
							<FieldButton
								label="Pickup date"
								value={stay?.from ? formatStayDate(stay.from) : undefined}
								placeholder="Add date"
								icon={<DateIcon />}
								compact
								onClick={() => {}}
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
					<hr className="border-slate-200" />
					<p className="flex items-center gap-1.5 text-sm font-semibold text-[#012420]">
						<ArrowDownLeft className="size-4" aria-hidden />
						Leaving the resort
					</p>
					<p className="text-xs text-slate-600">
						Pickup: {listing.meetingPoint.name}
					</p>
					<div className="flex gap-1.5">
						<div className="flex min-w-0 flex-1">
							<FieldButton
								label="Departure date"
								value={stay?.to ? formatStayDate(stay.to) : undefined}
								placeholder="Add date"
								icon={<DateIcon />}
								compact
								onClick={() => {}}
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
			) : null}
		</div>
	)
}
