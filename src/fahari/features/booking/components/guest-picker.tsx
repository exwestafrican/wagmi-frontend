import { Button } from "@common/components/ui/button.tsx"
import { Minus, Plus } from "lucide-react"

export function CapacityNote({ max }: { max: number }) {
	return (
		<p className="text-[11px] leading-snug text-slate-500">
			Maximum car capacity is {max} {max === 1 ? "passenger" : "passengers"}.
		</p>
	)
}

function passengerLabel(passengers: number) {
	return passengers === 1 ? "1 adult" : `${passengers} adults`
}

export function GuestPicker({
	passengers,
	maxCapacity,
	onPassengersChange,
}: {
	passengers: number
	maxCapacity: number
	onPassengersChange: (passengers: number) => void
}) {
	return (
		<div className="flex items-center justify-between self-stretch rounded-[8px] border border-[#89C9CA] bg-white p-3">
			<div
				className="flex flex-col gap-1"
				style={{ fontFamily: "Inter, sans-serif" }}
			>
				<p className="text-[11px] leading-[normal] font-semibold text-[#012420] uppercase">
					Passengers
				</p>
				<p className="text-[11px] leading-[normal] font-semibold text-[#012420]">
					{passengerLabel(passengers)}
				</p>
			</div>
			<div className="flex items-center gap-2">
				<Button
					type="button"
					size="icon-sm"
					variant="outline"
					aria-label="Remove adult"
					disabled={passengers <= 1}
					onClick={() => onPassengersChange(Math.max(1, passengers - 1))}
					className="size-7 rounded-full border-[#7eaea0] text-[#2f6a58]"
				>
					<Minus aria-hidden />
				</Button>
				<span className="w-4 text-center text-sm font-normal text-[#10241c] tabular-nums">
					{passengers}
				</span>
				<Button
					type="button"
					size="icon-sm"
					aria-label="Add adult"
					disabled={passengers >= maxCapacity}
					onClick={() =>
						onPassengersChange(Math.min(maxCapacity, passengers + 1))
					}
					className="size-7 rounded-full bg-[#7eaea0] text-white hover:bg-[#7eaea0]/90"
				>
					<Plus aria-hidden />
				</Button>
			</div>
		</div>
	)
}
