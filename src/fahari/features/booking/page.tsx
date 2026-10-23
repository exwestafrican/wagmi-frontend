import { useListing } from "@fahari/features/booking/api/get-listing.ts"
import { RideOnlyPanel } from "@fahari/features/booking/components/ride-only-panel.tsx"
import { useSearch } from "@tanstack/react-router"
import { Toaster } from "sileo"
import "sileo/styles.css"

export function BookingPage() {
	const { code } = useSearch({ from: "/booking" })
	const { data: listing } = useListing(code)

	return (
		<main className="flex min-h-dvh justify-center bg-white md:bg-[#FCFBF8] md:px-4 md:py-10">
			<Toaster position="top-center" theme="light" />
			<div className="w-full md:max-w-[360px]">
				<RideOnlyPanel listing={listing} />
			</div>
		</main>
	)
}
