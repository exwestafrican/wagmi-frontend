import { createRouter, createRootRoute } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"

const rootRoute = createRootRoute({
	component: () => null,
})

export function createFahariRouter(queryClient: QueryClient) {
	const routeTree = rootRoute

	return createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultStructuralSharing: true,
		defaultPreloadStaleTime: 0,
	})
}
