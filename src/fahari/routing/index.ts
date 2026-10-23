import { FahariAdminPages, FahariPages } from "@fahari/constants.ts"
import { AdminAccountsPage } from "@fahari/features/admin/accounts/page.tsx"
import AdminDashboardPage from "@fahari/features/admin/admin-dashboard.page.tsx"
import { currentAdminQueryOptions } from "@fahari/features/admin/api/current-admin.ts"
import { AdminBookingsPage } from "@fahari/features/admin/bookings/page.tsx"
import { AdminCheckEmailPage } from "@fahari/features/admin/check-email/page.tsx"
import { AdminDashboardPending } from "@fahari/features/admin/components/admin-dashboard-pending.tsx"
import { handleAuthToken } from "@fahari/features/admin/hooks/handle-auth-token.ts"
import { AdminLoginPage } from "@fahari/features/admin/login/page.tsx"
import { listingQueryOptions } from "@fahari/features/booking/api/get-listing.ts"
import { BookingError } from "@fahari/features/booking/components/booking-error.tsx"
import { BookingPending } from "@fahari/features/booking/components/booking-pending.tsx"
import { BookingPage } from "@fahari/features/booking/page.tsx"
import { BookingSuccessPage } from "@fahari/features/booking/success-page.tsx"
import { type AnyRoute, createRoute } from "@tanstack/react-router"
import { z } from "zod"

export function createFahariRouteTree(parentRoute: AnyRoute) {
	const fahariBookingRoute = createRoute({
		getParentRoute: () => parentRoute,
		path: "booking",
		validateSearch: z.object({
			code: z.string(),
		}),
		loaderDeps: ({ search: { code } }) => ({ code }),
		loader: ({ context: { queryClient }, deps: { code } }) =>
			queryClient.ensureQueryData(listingQueryOptions(code)),
		pendingComponent: BookingPending,
		errorComponent: BookingError,
		component: BookingPage,
	})

	const fahariBookingSuccessRoute = createRoute({
		getParentRoute: () => parentRoute,
		path: FahariPages.BOOKING_SUCCESS,
		component: BookingSuccessPage,
	})

	const fahariAdminLoginRoute = createRoute({
		getParentRoute: () => parentRoute,
		path: "admin",
		validateSearch: z.object({
			redirect: z.string().optional(),
		}),
		component: AdminLoginPage,
	})

	const fahariAdminCheckEmailRoute = createRoute({
		getParentRoute: () => parentRoute,
		path: "admin/check-email",
		validateSearch: z.object({
			email: z.email(),
		}),
		component: AdminCheckEmailPage,
	})

	const fahariAdminDashboardLayoutRoute = createRoute({
		getParentRoute: () => parentRoute,
		id: "fahari-admin-dashboard",
		beforeLoad: ({ location }) => {
			handleAuthToken(location, FahariAdminPages.LOGIN)
		},
		loader: async ({ context: { queryClient } }) => {
			await queryClient.ensureQueryData(currentAdminQueryOptions())
		},
		pendingComponent: AdminDashboardPending,
		component: AdminDashboardPage,
	})

	const fahariAdminAccountsRoute = createRoute({
		getParentRoute: () => fahariAdminDashboardLayoutRoute,
		path: "admin/accounts",
		component: AdminAccountsPage,
	})

	const fahariAdminBookingsRoute = createRoute({
		getParentRoute: () => fahariAdminDashboardLayoutRoute,
		path: "admin/bookings",
		component: AdminBookingsPage,
	})

	return [
		fahariBookingSuccessRoute,
		fahariBookingRoute,
		fahariAdminLoginRoute,
		fahariAdminCheckEmailRoute,
		fahariAdminDashboardLayoutRoute.addChildren([
			fahariAdminAccountsRoute,
			fahariAdminBookingsRoute,
		]),
	]
}
