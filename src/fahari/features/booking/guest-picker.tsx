import { Minus, Plus } from "lucide-react"

function guestLabel(adults: number) {
	return adults === 1 ? "1 adult" : `${adults} adults`
}

export function CapacityNote({ max }: { max: number }) {
	return (
		<p className="text-[11px] leading-snug text-slate-500">
			Maximum car capacity is {max} {max === 1 ? "passenger" : "passengers"}.
		</p>
	)
}

export function GuestPicker({
	adults,
	onAdultsChange,
	label = "Guests",
	max,
}: {
	adults: number
	onAdultsChange: (adults: number) => void
	label?: string
	max: number
}) {
	return (
		<div className="flex items-center justify-between self-stretch rounded-[8px] border border-[#89C9CA] bg-white p-3">
			<div
				className="flex flex-col gap-1"
				style={{ fontFamily: "Inter, sans-serif" }}
			>
				<p className="text-[11px] leading-[normal] font-semibold text-[#012420] uppercase">
					{label}
				</p>
				<p className="text-[11px] leading-[normal] font-semibold text-[#012420]">
					{guestLabel(adults)}
				</p>
			</div>
			<div className="flex items-center gap-2">
				<button
					type="button"
					aria-label="Remove adult"
					disabled={adults <= 1}
					onClick={() => onAdultsChange(adults - 1)}
					className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#7eaea0] text-[#2f6a58] disabled:cursor-not-allowed disabled:opacity-40"
				>
					<Minus className="size-4" aria-hidden />
				</button>
				<span className="w-4 text-center text-sm font-normal text-[#10241c] tabular-nums">
					{adults}
				</span>
				<button
					type="button"
					aria-label="Add adult"
					disabled={adults >= max}
					onClick={() => onAdultsChange(adults + 1)}
					className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#7eaea0] text-white disabled:cursor-not-allowed disabled:opacity-40"
				>
					<Plus className="size-4" aria-hidden />
				</button>
			</div>
		</div>
	)
}
