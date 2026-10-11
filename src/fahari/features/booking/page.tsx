import { BookingPanel } from "@fahari/features/booking/booking-panel.tsx"
import { findListingByCode } from "@fahari/features/booking/listing.ts"
import { useSearch } from "@tanstack/react-router"
import { addDays, startOfDay } from "date-fns"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

function defaultStay(): DateRange {
	const checkIn = startOfDay(new Date())
	return { from: checkIn, to: addDays(checkIn, 1) }
}

export function BookingPage() {
	const { code } = useSearch({ from: "/fahari/booking" })
	const listing = findListingByCode(code)
	const [stay, setStay] = useState<DateRange | undefined>(defaultStay)
	const [adults, setAdults] = useState(1)

	if (!listing) {
		return (
			<main className="flex min-h-dvh items-center justify-center bg-white px-4 md:bg-[#FCFBF8]">
				<p className="text-sm text-slate-600">No stay matches this code.</p>
			</main>
		)
	}

	return (
		<main className="flex min-h-dvh justify-center bg-white md:bg-[#FCFBF8] md:px-4 md:py-10">
			<div className="w-full md:max-w-[360px]">
				<BookingPanel
					listing={listing}
					stay={stay}
					onStayChange={setStay}
					adults={adults}
					onAdultsChange={setAdults}
				/>
			</div>
		</main>
	)
}
