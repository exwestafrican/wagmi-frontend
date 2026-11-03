import type { Product } from "@common/hooks/use-product-branding.ts"
import { productFromHost } from "@common/product-from-host.ts"
import { getEnvoyeRouteChildren } from "@envoye/routes.ts"
import { rootRoute } from "@envoye/routing/root.ts"
import { createFahariRouteTree } from "@fahari/routing/index.ts"
import type { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"

const defaultRouterOptions = {
	defaultPreload: "intent" as const,
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
}

// Both products stay in the registered router type so links in either tree
// still typecheck. Only the host's routes are mounted.
function createRegisteredRouter(queryClient: QueryClient) {
	return createRouter({
		routeTree: rootRoute.addChildren([
			...getEnvoyeRouteChildren(),
			...createFahariRouteTree(rootRoute),
		]),
		context: { queryClient },
		...defaultRouterOptions,
	})
}

type AppRouter = ReturnType<typeof createRegisteredRouter>

export function createAppRouter(
	queryClient: QueryClient,
	product: Product = productFromHost(window.location.hostname),
): AppRouter {
	const routeTree = rootRoute.addChildren(
		product === "fahari"
			? createFahariRouteTree(rootRoute)
			: getEnvoyeRouteChildren(),
	)

	return createRouter({
		routeTree,
		context: { queryClient },
		...defaultRouterOptions,
	}) as unknown as AppRouter
}

declare module "@tanstack/react-router" {
	interface Register {
		router: AppRouter
	}

	interface StaticDataRouteOption {
		product?: Product
	}
}
