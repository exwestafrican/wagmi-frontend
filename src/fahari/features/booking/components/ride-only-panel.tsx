import { Skeleton } from "@common/components/ui/skeleton.tsx"
import { useBilling } from "@fahari/features/booking/api/calculate-billing.ts"
import { ContactDetails } from "@fahari/features/booking/components/contact-details.tsx"
import { RideTripCard } from "@fahari/features/booking/components/ride-trip-card.tsx"
import { formatNightlyPrice } from "@fahari/features/booking/format.ts"
import {
	CapacityNote,
	GuestPicker,
} from "@fahari/features/booking/guest-picker.tsx"
import {
	type Listing,
	maximumRideCapacity,
} from "@fahari/features/booking/listing.ts"
import {
	addDays,
	differenceInCalendarDays,
	isBefore,
	startOfDay,
} from "date-fns"
import { ArrowRight, Car } from "lucide-react"
import { useState } from "react"

const CONTACT_FORM_ID = "ride-contact-details"

export function RideOnlyPanel({ listing }: { listing: Listing }) {
	const maxPassengers = maximumRideCapacity(listing)
	const [passengers, setPassengers] = useState(1)
	const [pickupDate, setPickupDate] = useState(() => startOfDay(new Date()))
	const [departureDate, setDepartureDate] = useState(() =>
		addDays(startOfDay(new Date()), 1),
	)
	const days = differenceInCalendarDays(departureDate, pickupDate)
	const ride = useBilling(listing.code, days, "ride", passengers, true)
	const price =
		ride.data === undefined
			? undefined
			: formatNightlyPrice(ride.data.amount, listing.currency)

	const changePickupDate = (date: Date) => {
		setPickupDate(date)
		if (isBefore(departureDate, date)) setDepartureDate(date)
	}

	return (
		<section
			className="flex min-h-dvh w-full flex-col gap-2.5 bg-white p-4 md:min-h-0 md:rounded-xl"
			style={{ fontFamily: "Inter, sans-serif" }}
		>
			<div className="flex items-start justify-between gap-3">
				<h1
					className="text-[27px] leading-normal font-normal text-[#012420]"
					style={{ fontFamily: "Lora, Georgia, serif" }}
				>
					Make this your ride
				</h1>
				<Car className="mt-2.5 size-5 shrink-0 text-[#7eaea0]" aria-hidden />
			</div>
			<div className="flex flex-col gap-1">
				<p className="flex items-baseline text-[#012420]">
					{price ? (
						<span className="text-[24px] leading-[normal] font-semibold">
							{price}
						</span>
					) : (
						<Skeleton className="h-6 w-28" aria-hidden />
					)}
					<span className="text-sm leading-[normal] font-normal">
						&nbsp;/ round trip
					</span>
				</p>
				<p className="text-xs text-slate-600">
					Private ride to {listing.name} and back
				</p>
			</div>
			<GuestPicker
				label="Passengers"
				adults={passengers}
				onAdultsChange={setPassengers}
				max={maxPassengers}
			/>
			<CapacityNote max={maxPassengers} />
			<hr className="border-slate-200" />
			<RideTripCard
				meetingPointName={listing.meetingPoint.name}
				destinationName={listing.name}
				startTime={listing.schedule.startTime}
				endTime={listing.schedule.endTime}
				pickupDate={pickupDate}
				departureDate={departureDate}
				onPickupDateChange={changePickupDate}
				onDepartureDateChange={setDepartureDate}
			/>
			{price && (
				<p className="text-[11px] leading-snug text-slate-500">
					Your car includes pickup to the resort and the return ride. {price}{" "}
					covers both journeys.
				</p>
			)}
			<hr className="border-slate-200" />
			<ContactDetails formId={CONTACT_FORM_ID} onSubmit={() => {}} />
			<div className="flex flex-col gap-2 text-[#012420]">
				{ride.isError ? (
					<div className="flex items-center justify-between text-xs text-red-600">
						<span>Car / return ride</span>
						<span>Not available for this guest size.</span>
					</div>
				) : (
					<div className="flex items-center justify-between text-xs">
						<span>Car / return ride</span>
						{price ? (
							<span>{price}</span>
						) : (
							<Skeleton className="h-3 w-16" aria-hidden />
						)}
					</div>
				)}
				<hr className="border-slate-200" />
				<div className="flex items-center justify-between">
					<span className="text-sm font-semibold">Car booking total</span>
					<span className="text-lg leading-[normal] font-semibold">
						{price ? price : <Skeleton className="h-4 w-20" aria-hidden />}
					</span>
				</div>
				<button
					type="submit"
					form={CONTACT_FORM_ID}
					className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#10241c] px-4 py-2.5 text-[13px] font-semibold text-white"
				>
					Request this car
					<ArrowRight className="size-3.5" aria-hidden />
				</button>
			</div>
		</section>
	)
}
