import { ResortOrderSummary } from "@fahari/features/booking/components/resort-order-summary.tsx"
import { RideBooking } from "@fahari/features/booking/components/ride-booking.tsx"
import { ScheduleTime } from "@fahari/features/booking/components/schedule-time.tsx"
import { StaySummary } from "@fahari/features/booking/components/stay-summary.tsx"
import {
	formatNightlyPrice,
	formatStaySummary,
} from "@fahari/features/booking/format.ts"
import { GuestPicker } from "@fahari/features/booking/guest-picker.tsx"
import type { Listing } from "@fahari/features/booking/listing.ts"
import { StayDateRange } from "@fahari/features/booking/stay-date-range.tsx"
import { differenceInCalendarDays } from "date-fns"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

export function BookingPanel({
	listing,
	stay,
	onStayChange,
	adults,
	onAdultsChange,
}: {
	listing: Listing
	stay: DateRange | undefined
	onStayChange: (stay: DateRange | undefined) => void
	adults: number
	onAdultsChange: (adults: number) => void
}) {
	const [includeRide, setIncludeRide] = useState(true)
	const price = formatNightlyPrice(listing.pricePerNight, listing.currency)
	const summary =
		stay?.from && stay.to ? formatStaySummary(stay.from, stay.to) : null
	const nights =
		stay?.from && stay.to ? differenceInCalendarDays(stay.to, stay.from) : 0
	const rideAvailable = listing.rideProviders.some(
		(provider) => provider.maximumCapacity >= adults,
	)

	return (
		<section className="flex min-h-dvh w-full flex-col gap-2.5 bg-white p-4 md:min-h-0 md:rounded-xl">
			<h1
				className="text-[27px] leading-normal font-normal text-[#012420]"
				style={{ fontFamily: "Lora, Georgia, serif" }}
			>
				{listing.tagLine}
			</h1>
			<p className="text-[#012420]" style={{ fontFamily: "Inter, sans-serif" }}>
				<span className="text-[24px] leading-[normal] font-semibold">
					{price}
				</span>
				<span className="text-sm leading-[normal] font-normal"> / night</span>
			</p>
			<StayDateRange
				value={stay}
				onChange={onStayChange}
				maximumNights={listing.bookingPolicy.maximumNights}
				maxAdvanceBookingDays={listing.bookingPolicy.maxAdvanceBookingDays}
			/>
			<div
				className="flex items-start gap-5 self-stretch rounded-xl bg-[#10241c] p-3.5"
				style={{ fontFamily: "Inter, sans-serif" }}
			>
				<ScheduleTime
					label="Check-in"
					detail={`From ${listing.schedule.startTime}`}
				/>
				<ScheduleTime
					label="Check-out"
					detail={`By ${listing.schedule.endTime}`}
				/>
			</div>
			<GuestPicker adults={adults} onAdultsChange={onAdultsChange} />
			{summary && <StaySummary summary={summary} />}
			<RideBooking
				meetingPointName={listing.meetingPoint.name}
				startTime={listing.schedule.startTime}
				endTime={listing.schedule.endTime}
				stay={stay}
				enabled={includeRide}
				available={rideAvailable}
				onEnabledChange={setIncludeRide}
			/>
			<ResortOrderSummary
				resortCode={listing.code}
				numberOfNights={nights}
				numberOfGuests={adults}
				currency={listing.currency}
				includeRide={rideAvailable && includeRide}
				rideUnavailable={includeRide && !rideAvailable}
			/>
		</section>
	)
}
