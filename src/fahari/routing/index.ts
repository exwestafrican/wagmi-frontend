import { FahariAdminPages } from "@fahari/constants.ts"
import { AdminBookingsPage } from "@fahari/features/admin/bookings/page.tsx"
import { AdminCheckEmailPage } from "@fahari/features/admin/check-email/page.tsx"
import { handleAuthToken } from "@fahari/features/admin/hooks/handle-auth-token.ts"
import { AdminLoginPage } from "@fahari/features/admin/login/page.tsx"
import FahariHomePage from "@fahari/features/home/page.tsx"
import { type AnyRoute, Outlet, createRoute } from "@tanstack/react-router"
import { z } from "zod"

export function createFahariRouteTree(parentRoute: AnyRoute) {
	const fahariLayoutRoute = createRoute({
		getParentRoute: () => parentRoute,
		path: "fahari",
		component: Outlet,
	})

	const fahariIndexRoute = createRoute({
		getParentRoute: () => fahariLayoutRoute,
		path: "/",
		component: FahariHomePage,
	})

	const fahariAdminLoginRoute = createRoute({
		getParentRoute: () => fahariLayoutRoute,
		path: "admin",
		validateSearch: z.object({
			redirect: z.string().optional(),
		}),
		component: AdminLoginPage,
	})

	const fahariAdminCheckEmailRoute = createRoute({
		getParentRoute: () => fahariLayoutRoute,
		path: "admin/check-email",
		validateSearch: z.object({
			email: z.email(),
		}),
		component: AdminCheckEmailPage,
	})

	const fahariAdminBookingsRoute = createRoute({
		getParentRoute: () => fahariLayoutRoute,
		path: "admin/bookings",
		beforeLoad: ({ location }) => {
			handleAuthToken(location, FahariAdminPages.LOGIN)
		},
		component: AdminBookingsPage,
	})

	return fahariLayoutRoute.addChildren([
		fahariIndexRoute,
		fahariAdminLoginRoute,
		fahariAdminCheckEmailRoute,
		fahariAdminBookingsRoute,
	])
}
