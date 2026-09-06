import { FahariAdminCheckEmailPage } from "@fahari/features/admin/check-email/page.tsx"
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
		component: AdminLoginPage,
	})

	const fahariAdminCheckEmailRoute = createRoute({
		getParentRoute: () => fahariLayoutRoute,
		path: "admin/check-email",
		validateSearch: z.object({
			email: z.email(),
		}),
		component: FahariAdminCheckEmailPage,
	})

	return fahariLayoutRoute.addChildren([
		fahariIndexRoute,
		fahariAdminLoginRoute,
		fahariAdminCheckEmailRoute,
	])
}
