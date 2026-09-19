import { NewBookingSheet } from "@fahari/features/admin/bookings/components/new-booking-sheet.tsx"

export function AdminBookingsPage() {
	return (
		<div className="flex min-h-dvh flex-col bg-[#fafaf8]">
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 md:px-8">
				<h1 className="text-sm font-semibold tracking-tight text-slate-900">
					Bookings
				</h1>
				<NewBookingSheet />
			</header>
			<div className="min-h-0 flex-1" />
		</div>
	)
}
