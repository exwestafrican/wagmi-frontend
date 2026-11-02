import type { Product } from "@common/hooks/use-product-branding.ts"
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

export function createAppRouter(queryClient: QueryClient) {
	const routeTree = rootRoute.addChildren([
		...getEnvoyeRouteChildren(),
		...createFahariRouteTree(rootRoute),
	])

	return createRouter({
		routeTree,
		context: { queryClient },
		...defaultRouterOptions,
	})
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createAppRouter>
	}

	interface StaticDataRouteOption {
		product?: Product
	}
}
