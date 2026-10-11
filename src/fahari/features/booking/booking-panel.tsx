import {
	formatNightlyPrice,
	formatStaySummary,
} from "@fahari/features/booking/format.ts"
import { GuestPicker } from "@fahari/features/booking/guest-picker.tsx"
import type { Listing } from "@fahari/features/booking/listing.ts"
import { StayDateRange } from "@fahari/features/booking/stay-date-range.tsx"
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
	const price = formatNightlyPrice(listing.pricePerNight, listing.currency)
	const summary =
		stay?.from && stay.to ? formatStaySummary(stay.from, stay.to) : null

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
				<div className="flex flex-[1_0_0] flex-col items-start self-stretch">
					<p className="text-[9px] font-semibold uppercase leading-tight text-[#F7F9E4]">
						Check-in
					</p>
					<p className="text-xs font-semibold leading-tight text-[#F7F9E4]">
						From {listing.schedule.startTime}
					</p>
				</div>
				<div className="flex flex-[1_0_0] flex-col items-start self-stretch">
					<p className="text-[9px] font-semibold uppercase leading-tight text-[#F7F9E4]">
						Check-out
					</p>
					<p className="text-xs font-semibold leading-tight text-[#F7F9E4]">
						By {listing.schedule.endTime}
					</p>
				</div>
			</div>
			<GuestPicker adults={adults} onAdultsChange={onAdultsChange} />
			{summary ? (
				<div>
					<p
						className="text-xs tracking-tight text-slate-600"
						style={{ fontFamily: "Inter, sans-serif" }}
					>
						{summary}
					</p>
					<hr className="mt-2.5 border-slate-200" />
				</div>
			) : null}
		</section>
	)
}
