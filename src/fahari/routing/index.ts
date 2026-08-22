import { createRoute, Outlet, type AnyRoute } from "@tanstack/react-router"
import FahariHomePage from "@fahari/features/home/page.tsx"

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

	return fahariLayoutRoute.addChildren([fahariIndexRoute])
}
