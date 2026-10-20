import { useListing } from "@fahari/features/booking/api/get-listing.ts"
import { BookingPanel } from "@fahari/features/booking/booking-panel.tsx"
import { RideOnlyPanel } from "@fahari/features/booking/components/ride-only-panel.tsx"
import { useSearch } from "@tanstack/react-router"
import { addDays, startOfDay } from "date-fns"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

function defaultStay(): DateRange {
	const checkIn = startOfDay(new Date())
	return { from: checkIn, to: addDays(checkIn, 1) }
}

export function BookingPage() {
	const { code } = useSearch({ from: "/booking" })
	const { data: listing } = useListing(code)
	const [stay, setStay] = useState<DateRange | undefined>(defaultStay)
	const [adults, setAdults] = useState(1)

	return (
		<main className="flex min-h-dvh justify-center bg-white md:bg-[#FCFBF8] md:px-4 md:py-10">
			<div className="w-full md:max-w-[360px]">
				{listing.onlyRideBooking ? (
					<RideOnlyPanel listing={listing} />
				) : (
					<BookingPanel
						listing={listing}
						stay={stay}
						onStayChange={setStay}
						adults={adults}
						onAdultsChange={setAdults}
					/>
				)}
			</div>
		</main>
	)
}
