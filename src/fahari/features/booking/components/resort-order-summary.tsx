import { Skeleton } from "@common/components/ui/skeleton.tsx"
import { useBilling } from "@fahari/features/booking/api/calculate-billing.ts"
import { formatNightlyPrice } from "@fahari/features/booking/format.ts"
import { ArrowRight } from "lucide-react"

function Amount({
	amount,
	currency,
}: { amount: number | undefined; currency: string }) {
	if (amount === undefined) {
		return <Skeleton className="h-3 w-16" aria-hidden />
	}

	return <span>{formatNightlyPrice(amount, currency)}</span>
}

function SummaryRow({
	label,
	amount,
	currency,
}: {
	label: string
	amount: number | undefined
	currency: string
}) {
	return (
		<div className="flex items-center justify-between text-xs text-[#012420]">
			<span>{label}</span>
			<Amount amount={amount} currency={currency} />
		</div>
	)
}

export function ResortOrderSummary({
	resortCode,
	numberOfNights,
	numberOfGuests,
	currency,
	includeRide,
}: {
	resortCode: string
	numberOfNights: number
	numberOfGuests: number
	currency: string
	includeRide: boolean
}) {
	const accommodation = useBilling(
		resortCode,
		numberOfNights,
		"accommodation",
		numberOfGuests,
		true,
	)
	const ride = useBilling(
		resortCode,
		numberOfNights,
		"ride",
		numberOfGuests,
		includeRide,
	)
	const nightLabel =
		numberOfNights === 1 ? "1 night" : `${numberOfNights} nights`
	const failed = accommodation.isError || (includeRide && ride.isError)
	const accommodationAmount = accommodation.data?.amount ?? 0
	const rideAmount = includeRide ? (ride.data?.amount ?? 0) : 0
	const total = accommodationAmount + (rideAmount ?? 0)

	if (failed) {
		return <p className="text-xs text-slate-600">Couldn't price this stay.</p>
	}

	return (
		<div
			className="flex flex-col gap-2 text-[#012420]"
			style={{ fontFamily: "Inter, sans-serif" }}
		>
			<SummaryRow
				label={nightLabel}
				amount={accommodationAmount}
				currency={currency}
			/>
			{includeRide &&
				(ride.isSuccess ? (
					<SummaryRow
						label="Car / return ride"
						amount={rideAmount}
						currency={currency}
					/>
				) : (
					<div className="flex items-center justify-between text-xs text-red-600">
						<span>Car / return ride</span>
						<span>Not available for this guest size.</span>
					</div>
				))}
			<hr className="border-slate-200" />
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold">Booking total</span>
				<span className="text-lg leading-[normal] font-semibold">
					<Amount amount={total} currency={currency} />
				</span>
			</div>
			<p className="text-[11px] leading-[normal] text-slate-500">
				{includeRide && ride.isSuccess
					? "Includes cleaning and selected car"
					: "Includes cleaning"}
			</p>
			<button
				type="button"
				className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#10241c] px-4 py-2.5 text-[13px] font-semibold text-white"
			>
				Request this stay
				<ArrowRight className="size-3.5" aria-hidden />
			</button>
		</div>
	)
}
