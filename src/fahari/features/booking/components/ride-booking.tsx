import { Checkbox } from "@common/components/ui/checkbox.tsx"
import { RideTripCard } from "@fahari/features/booking/components/ride-trip-card.tsx"
import { Car } from "lucide-react"
import type { DateRange } from "react-day-picker"

export function RideBooking({
	meetingPointName,
	startTime,
	endTime,
	stay,
	enabled,
	onEnabledChange,
}: {
	meetingPointName: string
	startTime: string
	endTime: string
	stay: DateRange | undefined
	enabled: boolean
	onEnabledChange: (enabled: boolean) => void
}) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-start gap-2">
					<Checkbox
						id="add-car"
						checked={enabled}
						onCheckedChange={(checked) => onEnabledChange(checked === true)}
						className="mt-0.5 size-5 rounded-[6px] border-[#7eaea0] data-[state=checked]:border-[#7eaea0] data-[state=checked]:bg-[#7eaea0]"
					/>
					<label htmlFor="add-car">
						<span className="block text-sm font-semibold text-[#012420]">
							Add a car to my booking
						</span>
						<span className="block text-xs text-slate-500">
							Optional private ride to the resort and back
						</span>
					</label>
				</div>
				<Car className="size-5 shrink-0 text-[#7eaea0]" aria-hidden />
			</div>
			{enabled && (
				<RideTripCard
					meetingPointName={meetingPointName}
					startTime={startTime}
					endTime={endTime}
					pickupDate={stay?.from}
					departureDate={stay?.to}
				/>
			)}
			{enabled ? (
				<>
					<p className="text-[11px] leading-snug text-slate-500">
						Your selected car includes pickup to the resort and the return ride.
						This is included in the booking total below.
					</p>
					<hr className="border-slate-200" />
				</>
			) : null}
		</div>
	)
}
