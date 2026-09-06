import {
	AdminDashboardLayout,
	AdminDashboardMenuButton,
} from "@fahari/features/admin/components/admin-dashboard-layout.tsx"

export function AdminBookingsPage() {
	return (
		<AdminDashboardLayout>
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 md:px-8">
				<div className="flex items-center gap-3">
					<AdminDashboardMenuButton />
					<h1 className="text-sm font-semibold tracking-tight text-slate-900">
						Bookings
					</h1>
				</div>
			</header>
			<div className="min-h-0 flex-1 overflow-auto" />
		</AdminDashboardLayout>
	)
}
